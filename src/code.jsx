// Code highlighting and the CodeBlock renderer. Kept out of the eager home
// bundle: only the /why and tool-scope pages render code blocks, so this whole
// module loads with those lazy chunks instead of shipping on every page.

// Guards run against the full string at position i, so patterns can't rely on
// \b or lookbehind behaving correctly at the start of a sliced substring.
const boundary = (i, code) => !code[i - 1] || !/\w/.test(code[i - 1])
const shellCommand = (i, code) => { const prev = code.slice(Math.max(0, i - 2), i); return prev === '$ ' || prev === '&& ' || prev === '; ' }
const shellFlag = (i, code) => !code[i - 1] || !/[\w-]/.test(code[i - 1])

const GRAMMARS = {
  python: [
    ['comment', /#[^\n]*/, boundary],
    ['string', /(?:[frbu]{0,2})(?:"""[\s\S]*?"""|'''[\s\S]*?'''|"(?:[^"\\\n]|\\.)*"|'(?:[^'\\\n]|\\.)*')/, boundary],
    ['decorator', /@[A-Za-z_][A-Za-z0-9_.]*/],
    ['keyword', /(?:class|def|return|import|from|as|pass|if|elif|else|for|while|in|not|and|or|is|None|True|False|with|raise|try|except|finally|lambda|yield|async|await|global|nonlocal|del|assert|break|continue|self)\b/, boundary],
    ['builtin', /(?:str|int|float|bool|dict|list|tuple|set|bytes|object|type|datetime|date|time|cls)\b/, boundary],
    ['type', /[A-Z][A-Za-z0-9_]*\b/, boundary],
    ['number', /\d+(?:\.\d+)?\b/, boundary],
    ['function', /[a-z_][A-Za-z0-9_]*(?=\()/, boundary],
  ],
  sql: [
    ['comment', /--[^\n]*/],
    ['string', /"(?:[^"\\\n]|\\.)*"|'(?:[^'\\\n]|\\.)*'/],
    ['keyword', /(?:SELECT|FROM|WHERE|CREATE|ALTER|DROP|TABLE|INDEX|VIEW|IF|NOT|EXISTS|ADD|COLUMN|RENAME|TO|TYPE|PRIMARY|KEY|FOREIGN|REFERENCES|UNIQUE|NULL|DEFAULT|AND|OR|IN|IS|AS|WITH|JOIN|LEFT|RIGHT|INNER|OUTER|FULL|CROSS|ON|USING|ORDER|BY|GROUP|HAVING|LIMIT|OFFSET|ASC|DESC|DISTINCT|CASE|WHEN|THEN|ELSE|END|CONSTRAINT|CHECK|GENERATED|ALWAYS|IDENTITY|SERIAL|BIGINT|SMALLINT|INTEGER|INT|TINYINT|MEDIUMINT|VARCHAR|CHAR|TEXT|BOOLEAN|BOOL|TIMESTAMP|DATETIME|DATETIME64|DATE|TIME|NUMERIC|DECIMAL|REAL|DOUBLE|PRECISION|BLOB|JSON|JSONB|UUID|ENUM|AUTO_INCREMENT|ENGINE|COLLATE|CHARSET|COMMENT|PARTITION|STORAGE|CODEC|TRUE|FALSE|RETURNING|CASCADE|RESTRICT|INSERT|INTO|VALUES|UPDATE|SET|DELETE|TRUNCATE|GRANT|REVOKE|ROLE|POLICY|TRIGGER|FUNCTION|PROCEDURE|REPLACE|UNSIGNED|LowCardinality|Nullable|UInt8|UInt16|UInt32|UInt64|Int8|Int16|Int32|Int64|Float32|Float64|Array|Map|Tuple|String|FixedString|Decimal32|Decimal64)\b/i, boundary],
    ['number', /\d+(?:\.\d+)?\b/, boundary],
    ['function', /[A-Za-z_][A-Za-z0-9_]*(?=\()/, boundary],
  ],
  shell: [
    ['comment', /#[^\n]*/],
    ['string', /"(?:[^"\\\n]|\\.)*"|'(?:[^'\\\n]|\\.)*'/],
    ['command', /[A-Za-z_][A-Za-z0-9_.-]*/, shellCommand],
    ['flag', /--?[A-Za-z][A-Za-z0-9_-]*/, shellFlag],
  ],
}

export function highlightCode(code, language) {
  if (language === 'plain') return [{ type: 'text', value: code }]
  const grammar = GRAMMARS[language] || GRAMMARS.python
  const parts = []
  let last = 0
  let i = 0
  while (i < code.length) {
    const rest = code.slice(i)
    let matched = null
    for (const [type, re, guard] of grammar) {
      re.lastIndex = 0
      const m = re.exec(rest)
      if (m && m.index === 0 && (!guard || guard(i, code))) { matched = [type, m[0]]; break }
    }
    if (!matched) { i += 1; continue }
    if (i > last) parts.push({ type: 'text', value: code.slice(last, i) })
    parts.push({ type: matched[0], value: matched[1] })
    i += matched[1].length
    last = i
  }
  if (last < code.length) parts.push({ type: 'text', value: code.slice(last) })
  return parts
}

export function renderCodeParts(parts, keyPrefix = '') {
  return parts.map((part, index) => part.type === 'text' ? part.value : <span key={`${keyPrefix}${index}`} className={`code-${part.type}`}>{part.value}</span>)
}

// Mixed blocks (model + artifact) switch from Python to SQL at the first '--' line.
export function highlightBlock(text) {
  const lines = text.split('\n')
  let mode = 'python'
  const parts = []
  for (let li = 0; li < lines.length; li += 1) {
    const line = lines[li]
    if (line.trimStart().startsWith('--')) mode = 'sql'
    parts.push(...highlightCode(line, mode))
    if (li < lines.length - 1) parts.push({ type: 'text', value: '\n' })
  }
  const merged = []
  for (const part of parts) {
    const prev = merged[merged.length - 1]
    if (prev && prev.type === 'text' && part.type === 'text') prev.value += part.value
    else merged.push({ ...part })
  }
  return merged
}

export function CodeBlock({ children, label, lang }) {
  const content = typeof children === 'string' && children.includes('database_config')
    ? 'from dbwarden import DbwardenDatabase\n\nclass Primary(DbwardenDatabase):\n    database_name = "primary"\n    default = True\n    database_type = "postgresql"\n    database_url_sync = "postgresql://user:password@localhost:5432/primary"\n    model_paths = ["app"]'
    : children
  const trimmed = String(content).trimStart()
  const detected = lang || (trimmed.startsWith('--') ? 'sql' : trimmed.startsWith('$') ? 'shell' : 'python')
  const labelText = label || detected
  const parts = highlightCode(String(content), detected)
  return <div className="code-block"><div className="code-block-bar" aria-hidden="true"><span /><span /><span /><b>{labelText}</b></div><pre className="article-code"><code>{renderCodeParts(parts)}</code></pre></div>
}
