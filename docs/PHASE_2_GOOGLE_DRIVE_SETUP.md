# Google Drive Service Account Setup

This guide configures the server to read selected portfolio files from Google
Drive. Original files remain in Drive. Keep them private; the Service Account
must be granted access explicitly. Public delivery, when implemented, must use
the database-gated Next.js proxy described in `DRIVE_PROXY.md`.

## 1. Select a Google Cloud project

Select an existing project or create one for this portfolio in the Google Cloud
Console. The project is used to enable the Drive API and create the Service
Account. Do not grant the Service Account broad project roles; Drive file
sharing controls which files it can read.

## 2. Enable the Google Drive API

In the selected project, open **APIs & Services → Library**, find **Google
Drive API**, and enable it. Enabling the API does not grant access to any Drive
files.

## 3. Create a Service Account

Open **IAM & Admin → Service Accounts**, select the project, and create a
Service Account. Record its email address, which ends in
`iam.gserviceaccount.com`. No project-wide role is needed for the Drive file
access in this setup.

## 4. Create and protect its JSON key

On the Service Account's **Keys** tab, choose **Add key → Create new key →
JSON**. Google downloads a JSON key containing the Service Account email and
private key. The downloaded private key is only available at creation time.

- Store the JSON file in a secure location outside the repository.
- Copy the `client_email` and `private_key` values into local/Vercel environment
  variables as described below.
- Never commit the JSON key, paste it into chat, add it to application source,
  or expose it to browser code.
- If a key is lost or exposed, revoke it in Google Cloud and create a new one.

If your organization blocks user-managed Service Account keys, ask its Google
Cloud administrator about the approved credential method before proceeding.

## 5. Share only the portfolio files

In Google Drive, share only the intended portfolio folder or individual image
and PDF files with the Service Account email. Grant **Viewer** access. A folder
permission is inherited by its contents. Keep the files' **General access** set
to **Restricted**; do not enable public or link access.

For a Shared Drive, grant the Service Account the least-privileged read role
allowed by that drive's sharing policy. If the organization's sharing rules
block the Service Account email, ask the Workspace administrator to allow the
specific account rather than making the files public.

## 6. Read-only access

The server client requests this OAuth scope:

```text
https://www.googleapis.com/auth/drive.readonly
```

This scope permits viewing and downloading. The Service Account still needs a
Drive permission on each file or its parent folder. The application does not
need a folder ID, folder listing, or automatic indexing.

## 7. Configure local environment variables

From the repository root, create the ignored local environment file:

```sh
cp .env.example .env.local
```

Set the Service Account email and private key in `.env.local`. The private key
must include its complete `BEGIN PRIVATE KEY` and `END PRIVATE KEY` lines. A
single-line value with literal `\n` sequences is supported by the server
client, for example:

```dotenv
GOOGLE_SERVICE_ACCOUNT_EMAIL=portfolio-reader@your-project.iam.gserviceaccount.com
GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nREPLACE_WITH_PRIVATE_KEY_CONTENT\n-----END PRIVATE KEY-----\n"
```

Replace the example values locally; do not commit `.env.local` or print its
contents. The repository `.gitignore` excludes it. Keep the Google variable
names server-only: do not prefix them with `NEXT_PUBLIC_`.

If your project is linked to Vercel and the Development variables are already
configured there, you can instead run `vercel env pull .env.local`. Do not
display the generated file contents.

## 8. Configure Vercel

In the Vercel project, open **Settings → Environment Variables** and add the
two variables below to each environment that needs Drive access (Development,
Preview, and/or Production). Store the private key as a sensitive server
variable. After changing environment variables, redeploy so the new deployment
receives them.

## 9. Verify one image and one PDF privately

Choose one known image File ID and one known PDF File ID from the shared folder.
Do not change their Drive sharing to public. After the `googleapis` dependency
is installed, run a server-side check using the Service Account and read-only
scope. For each File ID:

1. Call Drive `files.get` with `fields: "id,name,mimeType"` and verify the
   returned MIME type is an approved image type for the image, and
   `application/pdf` for the paper.
2. Call `files.get` again with `alt: "media"` and consume the returned stream.
   Confirm the request succeeds and reads a non-zero number of bytes.
3. Print only the file name, MIME type, and byte count. Never print an access
   token, private key, or full credential object.

These calls authenticate as the Service Account and do not change Drive
sharing. A permission error usually means the Drive API is disabled, the
Service Account email was not shared on that file/folder, or an organization
sharing rule blocks it. A not-found response can also mean the Service Account
cannot access the file.

## Environment variables

Required for Phase 2:

- `GOOGLE_SERVICE_ACCOUNT_EMAIL` — Service Account `client_email` value.
- `GOOGLE_PRIVATE_KEY` — complete PEM private key from the downloaded JSON.

The project-wide `.env.example` also contains `NEXT_PUBLIC_SUPABASE_URL`,
`NEXT_PUBLIC_SUPABASE_ANON_KEY`, and `NEXT_PUBLIC_APP_URL`. Those are not Google
Drive credentials. `SUPABASE_SERVICE_ROLE_KEY` is optional for a separately
justified trusted server-side operation and is not needed for Drive access.

## Official references

- [Create Service Accounts](https://docs.cloud.google.com/iam/docs/service-accounts-create?hl=en)
- [Create and delete Service Account keys](https://docs.cloud.google.com/iam/docs/keys-create-delete?hl=en)
- [Enable the Google Drive API](https://developers.google.com/workspace/drive/api/guides/enable-sdk)
- [Share Drive files and folders](https://developers.google.com/workspace/drive/api/guides/manage-sharing)
- [Choose Drive API scopes](https://developers.google.com/workspace/drive/api/guides/api-specific-auth)
- [Manage Vercel environment variables](https://vercel.com/docs/environment-variables/managing-environment-variables)
- [Pull Vercel environment variables locally](https://vercel.com/docs/cli/env)
