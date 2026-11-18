# Phase 3 Proxy Route Test Plan

This is a test plan for the public photo and research-paper delivery routes:

- `GET /api/image/{fileId}`
- `GET /api/paper/{fileId}`

It describes expected behavior; it does not claim the cases have been run. The
repository currently has no test files, test runner configuration, or test
script. Use this plan when the Next.js foundation and a test setup are ready.

## Safety and test setup

- Read `../docs/DATABASE.md` and `../docs/DRIVE_PROXY.md` before testing.
- Prefer isolated route tests with mocked Supabase and Google Drive clients.
  Use a local/test Supabase project and dedicated private Drive fixtures for
  integration checks.
- Do not use production records or publish a paper unless the owner has approved
  public viewing/download rights. The current schema has no separate rights
  approval column, so the publishing workflow must confirm approval before
  setting `is_published = true`.
- Never make test Drive files public. Share only the test folder with the
  Service Account as Viewer.
- Do not put credentials, access tokens, real private keys, or sensitive file
  names in fixtures, test output, or this document.
- Confirm that test setup does not call Drive folder listing/search APIs or
  download content except in the explicit streaming cases below.

## Shared request validation cases

Run for both route handlers.

| Case | Setup/request | Expected result |
| --- | --- | --- |
| Valid-looking ID | A syntactically valid File ID with no published row | `404`; Drive is not called |
| Empty or malformed ID | Empty segment where routable, invalid characters, or malformed encoded ID | Rejected before Supabase/Drive access; expected `400` for a handler invocation |
| Excessively long ID | File ID beyond the route's accepted length | Rejected before Supabase/Drive access; expected `400` |
| Drive URL instead of ID | Supply a URL or path as the parameter | Rejected; no URL parsing or upstream URL request occurs |
| Unexpected query parameters | Add caller-supplied URL/Drive parameters | Ignored; the route never uses them to choose an upstream resource |

For an empty segment that Next.js cannot route to a dynamic segment, a framework
404 is acceptable; verify the handler itself rejects an empty value if invoked
directly in a unit test.

## Photo route cases

Run against `/api/image/{fileId}`.

| Case | Supabase/Drive fixture | Expected result and assertions |
| --- | --- | --- |
| Published JPEG | Exact published row with `image/jpeg`; Drive metadata and media response match | `200`; streamed body; `Content-Type: image/jpeg`; `X-Content-Type-Options: nosniff`; success cache headers |
| Published PNG, WebP, GIF | Repeat the published case for each allowed MIME type | `200`; exact MIME is preserved; body streams successfully |
| Unpublished photo | Exact row has `is_published = false` | `404`; Drive is not called; `Cache-Control: no-store` |
| Unregistered ID | No row matches the exact File ID | `404`; Drive is not called; `Cache-Control: no-store` |
| Invalid stored MIME | Published row contains a MIME outside the image allowlist | `415`; Drive is not called; response is not cached |
| Drive metadata MIME mismatch | Registered MIME is allowed, but Drive metadata has another MIME | Safe `502`; no media download; response is not cached |
| Drive metadata ID mismatch | Drive metadata returns an ID different from the registered row | Safe `502`; no media download; response is not cached |
| Media response MIME mismatch | Metadata matches but media response `Content-Type` differs or is unsupported | Safe `502`; upstream stream is destroyed; response is not cached |
| Drive file missing/inaccessible | `files.get` returns Drive 404 for the registered row | Safe `404`; no Drive error details reach the caller; response is not cached |
| Other Drive failure | Drive returns 403, 5xx, or a network error | Safe `502`; credentials and upstream details are not returned; response is not cached |
| Supabase error | Lookup returns an error or throws | Safe `500`; Drive is not called; response is not cached |

The database MIME constraint should reject invalid stored values. Exercise the
route's defensive invalid-MIME branch with a mocked Supabase result; do not
weaken the production constraint just to seed this test case.

## Research-paper route cases

Run against `/api/paper/{fileId}`.

| Case | Supabase/Drive fixture | Expected result and assertions |
| --- | --- | --- |
| Published approved PDF | Exact published row has `application/pdf`; owner approved public access; Drive metadata and media MIME match | `200`; streamed body; `Content-Type: application/pdf`; `X-Content-Type-Options: nosniff`; conservative success cache headers |
| Unpublished paper | Exact row has `is_published = false` | `404`; Drive is not called; `Cache-Control: no-store` |
| Unregistered ID | No row matches the exact File ID | `404`; Drive is not called; `Cache-Control: no-store` |
| Non-PDF stored MIME | Published row has a MIME other than `application/pdf` | `415`; Drive is not called; response is not cached |
| Drive metadata MIME mismatch | Drive metadata is not `application/pdf` | Safe `502`; media is not fetched; response is not cached |
| Media response MIME mismatch | Media response header is not `application/pdf` | Safe `502`; upstream stream is destroyed; response is not cached |
| Drive file missing/inaccessible | Drive returns 404 for the registered row | Safe `404`; no Drive error details reach the caller; response is not cached |
| Other Drive failure | Drive returns 403, 5xx, or a network error | Safe `502`; credentials and upstream details are not returned; response is not cached |
| Supabase error | Lookup returns an error or throws | Safe `500`; Drive is not called; response is not cached |
| Paper not approved for public access | Do not mark the record published | `404`; Drive is not called and no cached response is produced |

## Gatekeeper and authorization checks

These cases verify the essential ordering and lookup constraints for both
routes:

1. Assert Supabase lookup uses the route File ID as an exact equality filter on
   the correct table (`performances` for photos, `research_papers` for papers)
   and includes `is_published = true`.
2. Assert no Drive request occurs before a matching published row is returned.
3. Assert every Drive request uses `record.drive_file_id` from Supabase, not an
   arbitrary URL, folder ID, or unverified caller input.
4. Assert the public lookup uses the anon key and RLS, not a service-role key.
5. With real RLS enabled, verify anonymous and authenticated non-admin clients
   can see published rows only. Verify the route returns 404 for unpublished
   and absent rows for both identities.
6. Verify no route invokes `files.list`, searches a folder, or exposes folder
   contents.

## Streaming and response-header checks

- Use a sufficiently large private fixture and confirm the route passes a
  stream to the response rather than buffering the full file before sending.
- Verify response bytes match the test fixture and content length is forwarded
  only when it is a valid numeric value.
- Check successful responses have the expected `Content-Type`,
  `X-Content-Type-Options: nosniff`, and documented success-only cache policy.
- Check every non-success response uses `Cache-Control: no-store` and does not
  forward upstream headers or error messages.
- Confirm streamed upstream failures do not expose credentials or Google
  implementation details in the response.
- Verify `runtime` is `nodejs`; do not claim or test this as an Edge route.

## Cache and unpublish behavior

- Assert that cache headers are added only after a matching published row and
  successful upstream status/MIME verification.
- Verify missing, unpublished, malformed, database-error, and Drive-error
  responses are not cached.
- After unpublishing a record, a fresh cache miss must return `404`.
- Document that a previously cached public response can remain available until
  its browser/CDN cache expires or is purged. Test the configured TTL and any
  purge process before launch; do not promise immediate revocation.
- For papers, ensure owner approval precedes publication and therefore any
  cacheable response. Current schema has no independent rights-approval field.

## Release checks

Before considering Phase 3 complete:

- Run the automated route tests once a test framework is established.
- Run lint, TypeScript checking, and production build after the Phase 1 app
  foundation is complete.
- Run the real Drive smoke check for one approved image and one owner-approved
  PDF, using metadata first and streaming only the intended fixture.
- Run RLS tests with anonymous, authenticated non-admin, and trusted admin
  identities as applicable; proxy read requests must remain restricted to
  published rows.
- Confirm no service-role key is present in browser bundles or public
  environment configuration.
- Confirm no video route or generic arbitrary-file proxy exists.
