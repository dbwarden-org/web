// CSP hash drift gate. index.html carries one inline <script> (the no-flash
// theme bootstrap); its sha256 is pinned in public/_headers so the strict
// CSP keeps working. If either side changes, the page breaks silently under
// the CSP — so this script fails the build.
//
//   node scripts/verify-csp.mjs

import { createHash } from 'node:crypto'
import { readFileSync } from 'node:fs'

const html = readFileSync('index.html', 'utf8')
const match = html.match(/<script>([\s\S]*?)<\/script>/)
if (!match) throw new Error('verify-csp: no bare inline <script> found in index.html')

const hash = `'sha256-${createHash('sha256').update(match[1]).digest('base64')}'`
const headers = readFileSync('public/_headers', 'utf8')

const failures = []
if (!headers.includes(hash)) {
  failures.push(`index.html theme script now hashes to ${hash} but public/_headers does not pin it`)
}
if (!headers.includes('__STYLE_SHA256__')) {
  failures.push('public/_headers is missing the __STYLE_SHA256__ placeholder for the inlined stylesheet hash')
}

if (failures.length) {
  for (const failure of failures) console.error(`verify-csp: FAIL ${failure}`)
  process.exit(1)
}
console.log(`verify-csp: OK (${hash})`)
