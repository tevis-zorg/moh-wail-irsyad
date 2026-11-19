import Link from "next/link";
import type { ReactNode } from "react";

const navigationLinkClass =
  "flex min-h-11 items-center text-sm text-portfolio-muted transition-colors hover:text-portfolio-text focus-visible:rounded-sm";

const dropdownLinkClass =
  "block rounded-sm px-4 py-3 text-sm text-portfolio-muted transition-colors hover:bg-white/5 hover:text-portfolio-text focus-visible:text-portfolio-text";

export default function PublicLayout({ children }: { children: ReactNode }) {
  const currentYear = new Date().getFullYear();

  return (
    <div className="min-h-screen bg-portfolio-background text-portfolio-text">
      <a
        className="sr-only z-50 rounded-sm bg-portfolio-accent px-4 py-3 text-sm text-portfolio-background focus:not-sr-only focus:fixed focus:left-4 focus:top-4"
        href="#main-content"
      >
        Skip to content
      </a>

      <header className="border-b border-portfolio-border/70 bg-portfolio-header/95">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-6 px-5 py-5 sm:px-8">
          <Link
            aria-label="Moh. Wail Irsyad, home"
            className="font-serif text-lg tracking-wide text-portfolio-text sm:text-xl"
            href="/"
          >
            Moh. Wail Irsyad
          </Link>

          <nav aria-label="Main navigation" className="hidden items-center gap-8 md:flex">
            <Link className={navigationLinkClass} href="/">
              Home
            </Link>
            <Link className={navigationLinkClass} href="/#about">
              About Me
            </Link>
            <details className="group relative">
              <summary
              className={`${navigationLinkClass} cursor-pointer list-none`}
              >
                My Works
                <span aria-hidden="true" className="ml-2 text-xs text-portfolio-accent">
                  ▾
                </span>
              </summary>
              <ul className="absolute right-0 z-40 mt-4 min-w-48 border border-portfolio-border bg-portfolio-header p-1 shadow-xl">
                <li>
                  <Link className={dropdownLinkClass} href="/#photos">
                    Photos
                  </Link>
                </li>
                <li>
                  <Link className={dropdownLinkClass} href="/#research-papers">
                    Research Papers
                  </Link>
                </li>
              </ul>
            </details>
            <Link className={navigationLinkClass} href="/#contact">
              Contact
            </Link>
          </nav>

          <details className="group relative md:hidden">
            <summary className="flex min-h-11 cursor-pointer list-none items-center rounded-sm border border-portfolio-border px-4 py-2 text-xs tracking-[0.14em] text-portfolio-text focus-visible:outline-portfolio-accent">
              Menu
            </summary>
            <nav
              aria-label="Mobile navigation"
              className="absolute right-0 z-40 mt-3 w-64 border border-portfolio-border bg-portfolio-header p-4 shadow-xl"
            >
              <ul className="space-y-1">
                <li>
                  <Link className={dropdownLinkClass} href="/">
                    Home
                  </Link>
                </li>
                <li>
                  <Link className={dropdownLinkClass} href="/#about">
                    About Me
                  </Link>
                </li>
                <li>
                  <details>
                    <summary className="cursor-pointer list-none rounded-sm px-4 py-3 text-sm text-portfolio-muted hover:bg-white/5 hover:text-portfolio-text focus-visible:text-portfolio-text">
                      My Works
                    </summary>
                    <ul className="ml-3 border-l border-portfolio-border pl-2">
                      <li>
                        <Link className={dropdownLinkClass} href="/#photos">
                          Photos
                        </Link>
                      </li>
                      <li>
                        <Link className={dropdownLinkClass} href="/#research-papers">
                          Research Papers
                        </Link>
                      </li>
                    </ul>
                  </details>
                </li>
                <li>
                  <Link className={dropdownLinkClass} href="/#contact">
                    Contact
                  </Link>
                </li>
              </ul>
            </nav>
          </details>
        </div>
      </header>

      <main id="main-content">{children}</main>

      <footer className="border-t border-portfolio-border/70 bg-portfolio-surface/60">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 px-5 py-8 text-xs leading-6 text-portfolio-muted sm:px-8 sm:py-10 sm:text-sm md:flex-row md:items-center md:justify-between">
          <p>Terima kasih telah berkunjung.</p>
          <p>
            © {currentYear} Moh. Wail Irsyad. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
