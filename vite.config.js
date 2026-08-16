import { mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { breadcrumbFor, canonicalFor, ogTypeFor, pages, schemaFor } from './src/seo-data.js'

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

const notFoundPage = `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta name="robots" content="noindex" />
    <meta name="description" content="The page you are looking for does not exist on dbwarden.org." />
    <title>Page not found | dbwarden</title>
    <style>
      :root { color-scheme: light dark; }
      * { box-sizing: border-box; }
      body { margin: 0; min-height: 100vh; display: grid; place-items: center; font-family: 'Inter Variable', Inter, system-ui, sans-serif; background: #f7f9fc; color: #111827; }
      @media (prefers-color-scheme: dark) { body { background: #0b1220; color: #e6edf7; } }
      .wrap { text-align: center; padding: 40px 24px; }
      .brand { display: inline-flex; align-items: center; gap: 8px; font-weight: 800; font-size: 18px; letter-spacing: .02em; color: inherit; text-decoration: none; }
      .brand img { width: 29px; height: 29px; }
      h1 { font-size: clamp(28px, 5vw, 44px); line-height: 1.15; margin: 32px 0 12px; }
      p { margin: 0 auto 28px; max-width: 42ch; line-height: 1.7; color: #68758a; }
      @media (prefers-color-scheme: dark) { p { color: #9fb0c8; } }
      a.back { display: inline-block; padding: 10px 18px; border-radius: 8px; background: #2563eb; color: #fff; font-weight: 600; text-decoration: none; }
      a.back:hover { background: #1d4ed8; }
    </style>
  </head>
  <body>
    <div class="wrap">
      <a class="brand" href="/"><img src="/icon.webp" alt="" width="29" height="29" /><span>dbwarden</span></a>
      <h1>That page doesn't exist.</h1>
      <p>The page you are looking for does not exist on dbwarden.org. The URL may be mistyped, or the page may have moved.</p>
      <a class="back" href="/">Back to the home page</a>
    </div>
  </body>
</html>
`

// Writes a static index.html per route with route-specific title, description,
// canonical, OG/Twitter tags, and JSON-LD (plus breadcrumbs on nested pages),
// plus a static 404.html. Every route resolves to a real asset, so deep URLs
// carry correct meta without executing JavaScript, and unknown paths return a
// real 404 status instead of a soft 404.
function prerenderSeo() {
  return {
    name: 'dbwarden-prerender-seo',
    closeBundle() {
      const outDir = 'dist'
      const template = readFileSync(join(outDir, 'index.html'), 'utf8')
      for (const path of Object.keys(pages)) {
        const html = applyHead(template, path)
        const file = path === '/' ? join(outDir, 'index.html') : join(outDir, path, 'index.html')
        mkdirSync(dirname(file), { recursive: true })
        writeFileSync(file, html)
      }
      writeFileSync(join(outDir, '404.html'), notFoundPage)
      console.log(`prerendered ${Object.keys(pages).length} routes + 404.html with per-page SEO`)
    },
  }
}

export default defineConfig({
  plugins: [react(), prerenderSeo()],
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
