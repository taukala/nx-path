# nx-path

URL path matching with Next.js-style `[param]` syntax. Decodes percent-encoded paths, extracts params, and handles query strings and hash fragments — in any JavaScript runtime.

Based on [react-router](https://github.com/remix-run/react-router)'s `matchPath` utility, modified to support `[param]` brackets instead of `:param` and to add path decoding and query/hash handling.

## Why this exists

I ran into this while working on a Next.js app. If you're *on* a dynamic route, Next.js hands you the params — `useParams()`, middleware, the `params` prop, all covered. But I had routes written down as plain strings in a permissions config, and there was no way to ask the other direction: "does this pathname match `/inventory/[id]/items`?"

The existing matchers all speak `:param`, so I'd have to maintain my route list in a different syntax than my actual route folders. That felt wrong. I just wanted to write `[id]` in my config, same as in `app/`, and check a pathname against it. So I took react-router's matcher, swapped the syntax, and added the decoding and query/hash handling I needed along the way.

## Features

- **Next.js-style patterns** — `/users/[id]/posts/[postId]`, plus trailing splat `/*`
- **Framework agnostic** — pure JavaScript, no dependencies. Works in Node.js, browsers, Deno, Bun, with or without Next.js
- **Percent-decoding built in** — `/products/summer%20collection` matches with `params.category === 'summer collection'`, while encoded slashes (`%2F`) are preserved to avoid ambiguity with path separators
- **Strict by default** — paths containing `?` or `#` don't match unless you opt in with `allowQuery` / `allowHash`

## Install

```bash
npm install @taukala/nx-path
```

## Quick start

```js
import { checkPath } from '@taukala/nx-path';

const result = checkPath('/users/[id]', '/users/123');
// {
//   originalPath: '/users/123',
//   decodedPath: '/users/123',
//   match: { params: { id: '123' }, ... },
//   isMatch: true,
//   params: { id: '123' },
//   query: null,
//   hash: null
// }
```

A typical route-guard usage:

```js
const routes = [
  '/system/inventory/[id]/in/[inId]/add-items/*',
  '/users/[userId]/profile',
  '/products/[category]/[itemId]'
];

const matched = routes.find((pattern) => checkPath(pattern, pathname).isMatch);
```

## API

### `checkPath(pattern, path, options?)`

The main entry point. Decodes `path`, then matches it against `pattern`.

#### `pattern` — `string | object`

A pattern string, or an object for more control:

```js
checkPath(
  {
    path: '/API/[version]/[endpoint]',
    caseSensitive: true, // default false
    end: true            // match to end of path, default true
  },
  '/API/v1/users'
);
```

Pattern syntax:

| Syntax | Example | Matches |
|---|---|---|
| Static segment | `/about` | `/about` |
| `[param]` | `/users/[id]` | `/users/123` → `params.id === '123'` |
| Trailing splat `/*` | `/files/*` | `/files`, `/files/a/b/c` → `params['*'] === 'a/b/c'` |

Param names may contain letters, digits, and underscores (`[item_id]`, `[page2]`).

#### `options` — `object` (optional)

| Option | Default | Description |
|---|---|---|
| `allowQuery` | `false` | Whether a query string is allowed in the path. When `true`, it is stripped before matching and returned as `result.query`. When `false`, a path containing `?` never matches. |
| `allowHash` | `false` | Same for hash fragments (`#section`), returned as `result.hash`. |

```js
checkPath('/users/[id]', '/users/123?tab=profile');
// => { isMatch: false, query: 'tab=profile', ... }   strict by default

checkPath('/users/[id]', '/users/123?tab=profile', { allowQuery: true });
// => { isMatch: true, params: { id: '123' }, query: 'tab=profile', ... }

checkPath('/users/[id]', '/users/123?tab=a#top', { allowQuery: true, allowHash: true });
// => { isMatch: true, params: { id: '123' }, query: 'tab=a', hash: 'top', ... }
```

`result.query` is the raw query string without the leading `?`. Parse it with the standard `URLSearchParams` if you need an object:

```js
Object.fromEntries(new URLSearchParams(result.query));
// 'tab=a&sort=asc' => { tab: 'a', sort: 'asc' }
```

#### Returns

| Field | Type | Description |
|---|---|---|
| `originalPath` | `string` | The input path, untouched |
| `decodedPath` | `string` | Decoded pathname (query/hash excluded) |
| `match` | `object \| null` | Full match object from `matchPath`, or `null` |
| `isMatch` | `boolean` | Whether the path matches |
| `params` | `object \| undefined` | Extracted params, e.g. `{ id: '123', '*': 'a/b' }` |
| `query` | `string \| null` | Raw query string without `?`, or `null` if none |
| `hash` | `string \| null` | Hash fragment without `#`, or `null` if none |

On a rejected path (`?`/`#` present without the corresponding `allow` option), `query` and `hash` are still populated so you can see why it failed.

### `matchPath(pattern, pathname)`

Lower-level matcher — no decoding, no query/hash handling. Returns a match object (`params`, `pathname`, `pathnameBase`, `pattern`) or `null`.

```js
import { matchPath } from '@taukala/nx-path';

matchPath('/users/[id]/profile', '/users/123/profile');
// => { params: { id: '123' }, pathname: '/users/123/profile', ... }
```

### `decodePath(value)`

Decodes percent-encoded characters segment by segment, preserving encoded slashes. Falls back to the original value (with a console warning) on malformed encoding.

```js
import { decodePath } from '@taukala/nx-path';

decodePath('/products/summer%20collection');  // => '/products/summer collection'
decodePath('/files/2023%2F01%2Fdoc.pdf');     // => '/files/2023%2F01%2Fdoc.pdf' (%2F kept)
```

## Edge cases worth knowing

- **Encoded slashes are preserved.** `%2F` inside a segment stays encoded after decoding, so a literal slash in a param value is never confused with a path separator: `/products/winter%2Ffall` → `params.category === 'winter%2Ffall'`.
- **Everything after `#` is the hash.** In `/users/123#sec?weird`, the hash is `sec?weird` — the `?` belongs to the fragment, matching how URLs actually parse.
- **Trailing splat is optional.** `/blog/[slug]/comments/*` matches both `/blog/post/comments` (splat `''`) and `/blog/post/comments/1/replies` (splat `1/replies`).
- **Query/hash stripping happens before decoding**, so an encoded `%3F` in a param value never gets mistaken for a query separator.

## License

MIT

Contains code derived from [react-router](https://github.com/remix-run/react-router) (MIT):
Copyright (c) React Training LLC 2015-2019, Remix Software Inc. 2020-2021, Shopify Inc. 2022-2023.
