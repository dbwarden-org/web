# dbwarden web

The public website for [dbwarden](https://github.com/dbwarden-org/dbwarden).

## Development

```bash
npm install
npm run dev
```

Create a production build with `npm run build`. The generated site is in `dist/`.

## Cloudflare Pages

Use `npm run build` as the build command and `dist` as the output directory. The intended domains are:

- `dbwarden.org`
- `www.dbwarden.org`

The Cloudflare Pages project should use the name `dbwarden-web`.
