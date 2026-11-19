# Google Drive Gatekeeper Proxy

The proxy is the only public delivery path for Drive-hosted files. It must not become an arbitrary Drive fetch endpoint.

## Image route
`GET /api/image/{fileId}`

Required flow:
1. Validate the File ID parameter format and length.
2. Query `performances` for the exact `drive_file_id` and `is_published = true`.
3. If no matching row exists, return 404.
4. Validate the stored MIME type against the approved image allowlist.
5. Fetch only the File ID obtained from the database row.
6. Verify Drive response status and actual content type; check file size where practical.
7. Stream the file to the response.
8. Set safe content headers and cache only successful public responses.

## Research paper route
`GET /api/paper/{fileId}` follows the same pattern against `research_papers`. Require `application/pdf`. Confirm with the owner that each paper is approved for public access before publishing.

## Example server-only Drive client
Create during Phase 2, for example at `src/lib/google-drive/client.ts`:

```ts
import "server-only";
import { google } from "googleapis";

const privateKey = process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, "\n");

const auth = new google.auth.GoogleAuth({
  credentials: {
    client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
    private_key: privateKey,
  },
  scopes: ["https://www.googleapis.com/auth/drive.readonly"],
});

export const drive = google.drive({ version: "v3", auth });
```

Keep this module out of client components and browser bundles. The Service Account must have access to the intended folder/file.

## Safe response behavior
- Return 404 for missing or unpublished records.
- Reject invalid or unsupported MIME types.
- Return safe error messages; log technical details server-side only.
- Set `X-Content-Type-Options: nosniff`.
- Do not cache errors or unpublished content.
- Do not blindly forward arbitrary upstream headers.
- Do not buffer large files unnecessarily; stream them.

## Caching and revocation
Successful public image responses use:

```http
Cache-Control: public, max-age=3600, s-maxage=86400, stale-while-revalidate=604800
X-Content-Type-Options: nosniff
```

This provides one-hour browser caching and one-day shared-cache freshness, with a seven-day `stale-while-revalidate` window.

Successful public paper responses use a shorter policy:

```http
Cache-Control: public, max-age=60, s-maxage=300
X-Content-Type-Options: nosniff
```

This provides one-minute browser caching and five-minute shared-cache
freshness. Only publish a paper after the owner has confirmed public
viewing/download rights. The schema has no separate rights-approval field, so
the publishing workflow must enforce this check before setting
`is_published = true`.

Important: unpublishing a row does not instantly revoke an already cached public response. A browser may retain an image for up to one hour and a paper for up to one minute. A shared cache may serve an image as fresh for one day and may serve stale content during its seven-day revalidation window; a paper may remain fresh for up to five minutes. Purge a cache when faster revocation is required. Choose and document an approach:
- Shorter cache TTL for content that may need quick revocation.
- Versioned URLs/cache keys.
- Explicit CDN purge where supported.

Do not promise immediate revocation while using long-lived public caching.

## Video
No video route is included in this version. Do not add one unless the owner requests a future video feature.
