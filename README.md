<!-- # Moh. Wail Irsyad — Personal web

A dynamic, dark editorial portfolio website with a lightweight admin CMS.

## Technology
Next.js App Router, TypeScript, Tailwind CSS, Supabase PostgreSQL/Auth, Google Drive API (Service Account), and Vercel.

## Media architecture
Google Drive stores originals. Supabase stores metadata and publication state. The administrator manually registers File IDs. The website serves only registered and published images/PDFs through controlled server proxy routes.

## Scope note
This version manages photos and research papers only.

## Workflow
Follow the five phases in `PLAN.md`. Work one file/component at a time and wait for approval between tasks. Never commit `.env.local` or credentials. Publish only owner-approved information and assets. -->

<!-- # Moh. Wail Irsyad Portfolio — Codex Repair Prompt Pack

This pack breaks the repair work into focused phases to reduce unnecessary Codex usage and keep changes easy to review.

## Recommended order

1. `prompts/00-inspect-and-report.md` — inspect only; do not change code.
2. `prompts/01-fix-google-drive-images.md` — fix and verify the image delivery path.
3. `prompts/02-build-functional-admin-dashboard.md` — complete the dashboard using existing auth and CRUD.
4. `prompts/03-public-site-integration-check.md` — verify public pages and integration.
5. `prompts/04-final-quality-check.md` — run checks and summarize the finished work.

## How to use

- Open the existing repository in Codex on `dev-branch`.
- Paste only one phase prompt at a time.
- Start with Phase 00. Review its findings before asking Codex to implement anything.
- Commit or create a backup before each implementation phase.
- Do not proceed to the next phase until the current phase is verified.
- If Codex discovers a blocker requiring credentials or external configuration, ask it to report the exact blocker rather than inventing a workaround.

## Project constraints

- This is a repair/completion task, not a redevelopment.
- Preserve the existing stack, project structure, database schema, UI identity, and working behavior.
- Reuse existing dependencies and implementation patterns.
- Do not introduce new frameworks, databases, ORMs, storage providers, or unnecessary libraries.
- Keep Google Drive as the image and research-paper source.
- Keep Supabase as the existing metadata/authentication backend.
- Keep credentials server-side.
- Use Tailwind CSS for any necessary styling.
- Do not add video functionality, video tables, video routes, or video admin features.
- Do not invent biography details, credits, awards, research information, or contact details.
- Avoid unrelated refactoring and elaborate dashboard effects/charts.

## Scope priority

1. Google Drive images must render correctly.
2. Admin dashboard must exist and be usable.
3. Existing photo and research-paper management must work.
4. Existing public portfolio features must continue working.
5. Verify and report; do not claim tests passed unless actually run. -->

## Public Website Accessibility (A11y) Audit and Fix

You are working on my existing Moh. Wail Irsyad personal portfolio website.

I want you to perform a focused accessibility audit of the existing public-facing website and fix confirmed accessibility issues with minimal changes.

My remaining monthly AI coding allowance is limited. Be efficient: inspect first, avoid unnecessary code generation, and do not refactor working parts of the project.
1. Scope

Focus exclusively on the public-facing website:

    - Home page
 
    - Public navigation
 
   - About section
 
   - My Works / Photo Gallery
 
   - Research Papers section
 
   - Contact section
 
   - Social media links
 
   - Public footer
 
   - Shared public components

Do not work on the admin dashboard, admin authentication, or admin-specific components.

## 2. Project Constraints

    - Preserve the existing visual identity, layout, content, and overall design.
 
   - Do not redesign or rebuild the website.
 
   - Use the existing stack: Next.js App Router, TypeScript, and Tailwind CSS.
 
   - Do not install additional dependencies, libraries, frameworks, or testing tools.
 
   - Do not change the database schema, Supabase configuration, Google Drive integration, API routes, or backend architecture.
 
   - Do not introduce video features or video-related functionality.
 
   - Do not invent biography details, credits, research information, contact details, or social media URLs.
 
   - Keep all modifications limited to confirmed accessibility issues.

3. Accessibility Audit

Inspect and improve the following areas.
A. Semantic HTML

    - Use appropriate HTML landmarks and semantic elements.

    - Maintain a logical heading hierarchy.

    - Use <button> for actions and <a> for navigation.

    - Avoid unnecessary ARIA attributes when native HTML semantics are sufficient.

    - Ensure page structure is understandable to assistive technologies.

B. Keyboard Accessibility

    Ensure all interactive elements can be accessed using a keyboard.

    Provide visible focus indicators.

    Maintain a logical keyboard tab order.

    Ensure interactive menus and controls can be operated without a mouse.

    Ensure users can navigate away from interactive elements.

    Avoid hover-only interactions.

C. Screen Reader Accessibility

    Provide meaningful accessible names for buttons and links.

    Ensure navigation landmarks have appropriate labels when needed.

    Ensure decorative elements do not create unnecessary screen reader announcements.

    Ensure informative images have meaningful alternative text.

    Use empty alt text for purely decorative images.

    Never use image filenames as alternative text.

D. Color Contrast and Readability

    Check text and background color contrast.

    Ensure important information is not communicated through color alone.

    Maintain readable typography.

    Ensure text remains understandable when users increase browser zoom.

    Preserve the existing visual design while correcting accessibility problems.

E. Images and Media

    Review all public images for appropriate alt text.

    Distinguish informative images from decorative images.

    Ensure image elements have appropriate accessible descriptions.

    Avoid redundant or meaningless alternative text.

    Preserve the existing Google Drive image delivery functionality.

F. Interactive Elements

    Ensure buttons have meaningful labels.

    Ensure links describe their destination or purpose.

    Ensure interactive gallery elements are keyboard accessible.

    Ensure navigation controls provide understandable accessible names.

    Check that mobile navigation does not depend exclusively on hover.

    Ensure interactive elements provide visible focus feedback.

G. Motion and Animation

    Respect the user's prefers-reduced-motion preference.

    Avoid unnecessary animations that interfere with reading or navigation.

    Ensure essential information is not dependent on animation.

    Preserve the existing visual presentation wherever possible.

H. Forms, If Present

    Associate labels with their respective input fields.

    Provide understandable validation and error messages.

    Ensure form controls are keyboard accessible.

    Make required fields identifiable.

    Do not change existing form submission or backend behavior unless a minimal change is necessary to fix an accessibility issue.

4. Audit and Implementation Process

Follow this order to conserve coding resources:

Step 1 — Inspect

Review the existing public-facing components and identify accessibility problems.

Do not modify any files during this initial inspection.

Step 2 — Report

Provide a concise list of confirmed issues, categorized as:

    Critical

    High

    Medium

    Low

Include the affected file or component when possible.

Step 3 — Fix

Fix only confirmed accessibility issues.

Prioritize:

    Keyboard accessibility.

    Screen reader compatibility.

    Semantic HTML.

    Image alternative text.

    Color contrast.

    Interactive element accessibility.

    Reduced-motion support.

Keep modifications small and targeted.

Step 4 — Verify

Review the affected components after implementation.

Use existing project tools and testing capabilities only. Do not install new dependencies or testing frameworks.

If a particular accessibility check cannot be performed, explicitly state that it remains unverified.
5. Regression Protection

After implementing the fixes, ensure that:

    Public navigation still works.

    All public sections remain accessible.

    Photo gallery interactions still work.

    Research paper links still work.

    Contact links still work.

    Social media links still work.

    Google Drive images still render correctly.

    No public content has been removed or unintentionally changed.

    No backend or database behavior has been modified.

Do not introduce unrelated improvements or refactor existing functionality.
6. Final Report

When finished, provide:

    Accessibility issues discovered.

    Files modified.

    Accessibility improvements implemented.

    Keyboard accessibility checks performed.

    Screen reader-related checks performed.

    Color contrast checks performed.

    Commands executed and their actual results.

    Remaining issues or checks that could not be verified.

Do not claim full WCAG compliance based only on code inspection or visual testing.

Keep the implementation minimal and focused exclusively on public website accessibility.