import { createHash } from 'node:crypto'
import { mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs'
import { dirname, join, resolve } from 'node:path'
import { pathToFileURL } from 'node:url'
import { build, defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { breadcrumbFor, canonicalFor, ogTypeFor, pages, schemaFor, siteUrl } from './src/seo-data.js'

function escapeAttr(value) {
  return value.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
}

function setTitle(html, title) {
  return html.replace(/<title>[\s\S]*?<\/title>/, `<title>${title}</title>`)
}

function setMeta(html, attribute, key, content) {
  const re = new RegExp(`(<meta ${attribute}="${key}"[^>]*?content=")[^"]*("\\s*/?>)`)
  if (!re.test(html)) throw new Error(`prerender: meta ${attribute}="${key}" not found in index.html template`)
  return html.replace(re, `$1${escapeAttr(content)}$2`)
}

function setLink(html, rel, href) {
  const re = new RegExp(`(<link rel="${rel}"[^>]*?href=")[^"]*("\\s*/?>)`)
  if (!re.test(html)) throw new Error(`prerender: link rel="${rel}" not found in index.html template`)
  return html.replace(re, `$1${href}$2`)
}

function setJsonLd(html, id, data) {
  const re = new RegExp(`(<script id="${id}" type="application/ld\\+json">)[\\s\\S]*?(</script>)`)
  if (!re.test(html)) throw new Error(`prerender: script id="${id}" not found in index.html template`)
  return html.replace(re, `$1${JSON.stringify(data)}$2`)
}

function removeJsonLd(html, id) {
  const re = new RegExp(`\\n?\\s*<script id="${id}" type="application/ld\\+json">[\\s\\S]*?</script>`)
  return html.replace(re, '')
}

function withBreadcrumb(html, path) {
  const crumb = breadcrumbFor(path)
  if (!crumb) return html
  const tag = `<script id="dbwarden-breadcrumb-jsonld" type="application/ld+json">${JSON.stringify(crumb)}</script>`
  const main = /<script id="dbwarden-jsonld"[\s\S]*?<\/script>/
  if (!main.test(html)) throw new Error('prerender: dbwarden-jsonld script not found for breadcrumb insertion')
  return html.replace(main, (match) => `${match}\n    ${tag}`)
}

function applyHead(template, path) {
  const page = pages[path]
  const canonical = canonicalFor(path)
  let html = template
  html = setTitle(html, page.title)
  html = setMeta(html, 'name', 'description', page.description)
  html = setMeta(html, 'property', 'og:type', ogTypeFor(page.type))
  html = setMeta(html, 'property', 'og:title', page.title)
  html = setMeta(html, 'property', 'og:description', page.description)
  html = setMeta(html, 'property', 'og:url', canonical)
  html = setMeta(html, 'name', 'twitter:title', page.title)
  html = setMeta(html, 'name', 'twitter:description', page.description)
  html = setLink(html, 'canonical', canonical)
  html = setJsonLd(html, 'dbwarden-jsonld', schemaFor(path))
  html = withBreadcrumb(html, path)
  return html
}

// The 404 page boots the same React app as every other route (same hashed
// assets), so an unknown URL renders the site's NotFoundPage with the full
// header, nav, and footer while Cloudflare still serves it with a real 404
// status. Meta is fixed to a noindex "Page not found" and the site's main
// JSON-LD is dropped.
function apply404(template) {
  const description = 'The page you are looking for does not exist on dbwarden.org. The URL may be mistyped, or the page may have moved.'
  let html = template
  html = setTitle(html, 'Page not found | dbwarden')
  html = setMeta(html, 'name', 'description', description)
  html = setMeta(html, 'name', 'robots', 'noindex')
  html = setMeta(html, 'property', 'og:type', 'website')
  html = setMeta(html, 'property', 'og:title', 'Page not found | dbwarden')
  html = setMeta(html, 'property', 'og:description', description)
  html = setMeta(html, 'property', 'og:url', siteUrl)
  html = setMeta(html, 'name', 'twitter:title', 'Page not found | dbwarden')
  html = setMeta(html, 'name', 'twitter:description', description)
  html = setLink(html, 'canonical', siteUrl)
  html = removeJsonLd(html, 'dbwarden-jsonld')
  return html
}

// Writes a static index.html per route with route-specific title, description,
// canonical, OG/Twitter tags, and JSON-LD (plus breadcrumbs on nested pages),
// plus a static 404.html. Every route resolves to a real asset, so deep URLs
// carry correct meta without executing JavaScript, and unknown paths return a
// real 404 status instead of a soft 404.
function prerenderSeo() {
  return {
    name: 'dbwarden-prerender-seo',
    async closeBundle() {
      const outDir = 'dist'
      let template = readFileSync(join(outDir, 'index.html'), 'utf8')
      // Build the server bundle (src/ssr.jsx) so every route can be rendered to
      // full HTML at build time; content then paints before any JavaScript runs.
      await build({
        configFile: false,
        root: process.cwd(),
        plugins: [
          {
            name: 'preact-alias',
            resolveId(source) {
              if (source === 'react/jsx-runtime') return join(process.cwd(), 'node_modules/preact/jsx-runtime/dist/jsxRuntime.module.js')
              if (source === 'react') return join(process.cwd(), 'node_modules/preact/compat')
              if (source === 'react-dom') return join(process.cwd(), 'node_modules/preact/compat')
              if (source === 'react-dom/client') return join(process.cwd(), 'node_modules/preact/compat')
              return null
            },
          },
          react(),
        ],
        build: { ssr: 'src/ssr.jsx', outDir: 'dist-ssr', emptyOutDir: true, minify: false },
        ssr: { noExternal: ['preact-render-to-string'] },
        logLevel: 'silent',
      })
      const ssrBundle = join('dist-ssr', 'ssr.js')
      const ssr = await import(pathToFileURL(ssrBundle).href + `?t=${Date.now()}`)
      const renderRoute = (path) => ssr.renderRoute(path)
      // Inline the single stylesheet into every prerendered page so nothing
      // render-blocks first paint. The CSS is ~7 kB gzipped and shared by all
      // routes, so the copy cost per page is negligible and the render-blocking
      // request disappears.
      const cssLink = template.match(/<link rel="stylesheet"[^>]*?href="([^"]+)"/)
      if (cssLink) {
        const cssPath = join(outDir, cssLink[1].replace(/^\//, ''))
        const css = readFileSync(cssPath, 'utf8')
        template = template.replace(cssLink[0], `<style>${css}</style>`)
        // The stylesheet is now inlined; the asset is dead weight on the host.
        rmSync(cssPath, { force: true })
        // Pin the inlined stylesheet's hash in the CSP. The site's CSP is
        // strict (style-src 'self'), so an unpinned inline <style> would be
        // silently blocked; the hash keeps the CSP strict and the page
        // styled. The theme bootstrap hash stays pinned in public/_headers.
        const hash = `'sha256-${createHash('sha256').update(css).digest('base64')}'`
        const headersFile = join(outDir, '_headers')
        const headers = readFileSync(headersFile, 'utf8')
        if (!headers.includes('__STYLE_SHA256__')) throw new Error('prerender: __STYLE_SHA256__ placeholder not found in _headers')
        writeFileSync(headersFile, headers.replace('__STYLE_SHA256__', hash))
      }
      // Preload the only font the English site actually uses (the committed
      // latin subset of the Inter variable font, public/fonts/) so it downloads
      // in parallel with the JS instead of after first paint. The font itself
      // is committed, so no font tooling is needed at build time.
      if (!template.includes('rel="preload" as="font"')) {
        const preload = `<link rel="preload" href="/fonts/inter-latin-wght-normal.woff2" as="font" type="font/woff2" crossorigin />`
        template = template.replace('<script type="module"', `${preload}\n    <script type="module"`)
      }
      for (const path of Object.keys(pages)) {
        const body = renderRoute(path)
        const html = applyHead(template.replace('<div id="root"></div>', `<div id="root">${body}</div>`), path)
        const file = path === '/' ? join(outDir, 'index.html') : join(outDir, path, 'index.html')
        mkdirSync(dirname(file), { recursive: true })
        writeFileSync(file, html)
      }
      writeFileSync(join(outDir, '404.html'), apply404(template.replace('<div id="root"></div>', `<div id="root">${renderRoute('/this-page-does-not-exist')}</div>`)))
      // The CSP must pin a real style hash by now, or the strict CSP would
      // block the inlined stylesheet silently. Fail the build instead.
      const finalHeaders = readFileSync(join(outDir, '_headers'), 'utf8')
      if (finalHeaders.includes('__STYLE_SHA256__')) throw new Error('prerender: _headers still has the __STYLE_SHA256__ placeholder')
      if (!finalHeaders.includes("style-src 'self' 'sha256-")) throw new Error('prerender: _headers CSP is missing the inlined style hash')
      console.log(`prerendered ${Object.keys(pages).length} routes + 404.html with per-page SEO`)
    },
  }
}

export default defineConfig({
  plugins: [react(), prerenderSeo()],
  resolve: {
    alias: {
      react: 'preact/compat',
      'react-dom': 'preact/compat',
      'react-dom/client': 'preact/compat',
      'react/jsx-runtime': 'preact/jsx-runtime',
    },
  },
  css: {
    transformer: 'lightningcss',
  },
  build: {
    cssMinify: 'lightningcss',
    // oxc (Rust) is the most aggressive JS minifier available here:
    // benchmarked against terser with passes:5 + toplevel + full compress
    // on this bundle, oxc wins: 518.48 kB / 157.71 gzip vs 518.94 / 158.69,
    // and builds ~30x faster (117ms vs 3.7s).
    minify: 'oxc',
  },
  server: {
    allowedHosts: true,
  },
  preview: {
    allowedHosts: true,
  },
})
