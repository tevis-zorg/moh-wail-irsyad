import Image from 'next/image';
import { getPublishedPerformances } from "../../lib/portfolio/performances";
import type { PublishedPerformance } from "../../lib/portfolio/performances";
import { getPublishedResearchPapers } from "../../lib/portfolio/research-papers";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const [performancesResult, papersResult] = await Promise.all([
    getPublishedPerformances(),
    getPublishedResearchPapers(),
  ]);

  const photoGroups = new Map<string, PublishedPerformance[]>();
  for (const record of performancesResult.records) {
    const group = photoGroups.get(record.event_name) ?? [];
    group.push(record);
    photoGroups.set(record.event_name, group);
  }

  const performanceHighlights = performancesResult.records.slice(0, 4);

  return (
    <>
      <section
        aria-labelledby="home-title"
        className="mx-auto grid min-h-[calc(100svh-5rem)] max-w-7xl items-center gap-12 px-5 py-14 sm:px-8 sm:py-20 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16"
      >
        <div className="relative z-10 py-6">
          <p className="mb-7 text-xs font-medium tracking-[0.24em] text-portfolio-accent sm:text-sm">
            PORTFOLIO SENIMAN
          </p>

          <h1
            className="max-w-4xl font-serif text-[clamp(3.5rem,11vw,8rem)] leading-[0.9] tracking-[-0.065em] text-portfolio-text"
            id="home-title"
          >
            Moh. Wail
            <span className="mt-2 block text-portfolio-accent">Irsyad</span>
          </h1>

          <p className="mt-8 max-w-xl text-sm leading-7 text-portfolio-muted sm:text-base sm:leading-8">
            Aktor, akademisi, dan seniman kolaborator
          </p>

          <div className="mt-10 flex items-center gap-4" aria-hidden="true">
            <span className="h-px w-12 bg-portfolio-accent" />
            <span className="text-[0.65rem] tracking-[0.2em] text-portfolio-muted">
              MOH. WAIL IRSYAD
            </span>
          </div>
        </div>

        <div className="mx-auto w-full max-w-lg">
          <h2 className="mb-5 font-serif text-2xl font-normal tracking-[-0.03em] text-portfolio-text sm:text-3xl">
            Performance Highlights
          </h2>
          <div
            aria-label="Performance highlights"
            className="grid aspect-[4/5] grid-cols-2 gap-2 overflow-hidden border border-portfolio-border bg-portfolio-surface p-2"
          >
            {performanceHighlights.length > 0 ? (
              performanceHighlights.map((record, index) => (
                <a
                  aria-label={`Open ${record.title} from ${record.event_name}`}
                  className="relative min-h-0 overflow-hidden focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-portfolio-accent"
                  href={`/api/image/${encodeURIComponent(record.drive_file_id)}`}
                  key={record.id}
                  rel="noreferrer"
                  target="_blank"
                >
                  <Image
                    alt={`${record.title} — ${record.event_name}`}
                    className="object-cover"
                    fill
                    priority={index === 0}
                    sizes="(min-width: 1024px) 22vw, (min-width: 640px) 42vw, 45vw"
                    src={`/api/image/${encodeURIComponent(record.drive_file_id)}`}
                  />
                </a>
              ))
            ) : (
              <p className="col-span-2 flex items-center justify-center p-6 text-center text-sm leading-6 text-portfolio-muted">
                No published performance highlights are available yet.
              </p>
            )}
          </div>
        </div>
      </section>

      <section
        aria-labelledby="about-title"
        className="border-t border-portfolio-border/70 bg-[url('/assets/photo-about-me.jpg')] bg-cover bg-center bg-portfolio-surface/60"
        id="about"
      >
        <div className="mx-auto grid max-w-7xl gap-10 px-5 py-20 sm:px-8 sm:py-28 lg:grid-cols-[0.7fr_1.3fr] lg:gap-20">
          <div>
            <p className="mb-5 p-4 text-md text-center bg-portfolio-accent font-large text-slate-700 tracking-[0.22em]">
              MOH. WAIL IRSYAD
            </p>
            <h2
              className="font-serif text-4xl font-normal tracking-[-0.04em] text-portfolio-text sm:text-5xl"
              id="about-title"
            >
              About Me
            </h2>
             {/* <div
              className="bg-white object-cover"
              id="about-photos"
            >
            </div> */}
          </div>

          <div className="absolut inset-0 bg-white/60 max-w-3xl space-y-6 text-black blur-500 leading-8 sm:text-lg sm:leading-9">
            <p>
              Moh. Wail. Lahir di Sumenep, Madura, 30 Mei 1986. Ia merupakan
              aktor, akademisi, dan seniman kolaborator yang menempuh pendidikan
              Seni Teater jenjang S1 dan S2 di Institut Seni Budaya Indonesia
              (ISBI) Bandung. Saat ini, ia mengabdikan diri sebagai dosen di
              Jurusan Teater ISBI Bandung.
            </p>
            <p>
              Dalam perjalanan artistiknya, Wail bersama Dr. Tony Broer
              menginisiasi berdirinya LABORATORIUM TUBUH, sebuah ruang praktik
              dan pertukaran gagasan yang dikembangkan sebagai pusat amalan
              keseharian aktor, sekaligus laboratorium eksplorasi dan
              pengembangan metode pelatihan ketubuhan.
            </p>
            <p>
              Sebagai seniman, Wail aktif menjelajahi kemungkinan ekspresi
              teater tubuh dan vokal melalui berbagai praktik lintas disiplin.
              Ia pernah berkolaborasi dengan sejumlah komunitas dan kelompok
              seni, di antaranya Lembana serta R.A.T.S dalam eksplorasi tubuh dan
              teknologi robotik. Ia juga terlibat dalam berbagai kerja
              kolaboratif bersama seniman musik, tari, dan seni rupa.
            </p>
            <p>
              Hingga kini, Wail terus mengembangkan praktik artistiknya melalui
              penelitian, eksperimentasi, dan kolaborasi. Baginya, tubuh dan
              vokal bukan semata perangkat ekspresi pemeran, melainkan medan
              eksplorasi yang senantiasa membuka kemungkinan-kemungkinan baru
              dalam penciptaan seni pertunjukan.
            </p>
          </div>
        </div>
      </section>

      <section
        aria-labelledby="works-title"
        className="border-t border-portfolio-border/70 bg-portfolio-surface/60"
        id="works"
      >
        <div className="mx-auto max-w-7xl space-y-16 px-5 py-20 sm:px-8 sm:py-28">
          <header className="max-w-3xl">
            <p className="mb-5 text-xs font-medium tracking-[0.22em] text-portfolio-accent">
              SELECTED WORK
            </p>
            <h2
              className="font-serif text-4xl font-normal tracking-[-0.04em] text-portfolio-text sm:text-5xl"
              id="works-title"
            >
              My Works
            </h2>
            <p className="mt-5 text-sm leading-7 text-portfolio-muted sm:text-base sm:leading-8">
              Photos and research papers approved for public viewing.
            </p>
          </header>

          <section aria-labelledby="photos-title" className="space-y-8" id="photos">
            <div className="flex flex-wrap items-end justify-between gap-4 border-b border-portfolio-border pb-4">
              <div>
                <p className="mb-2 text-xs tracking-[0.18em] text-portfolio-accent">
                  PERFORMANCE ARCHIVE
                </p>
                <h3 className="font-serif text-3xl text-portfolio-text" id="photos-title">
                  Photos
                </h3>
              </div>
            </div>

            {performancesResult.error ? (
              <p className="border border-red-900/70 p-5 text-sm leading-7 text-red-200" role="alert">
                Photos are temporarily unavailable. Please try again later.
              </p>
            ) : performancesResult.records.length === 0 ? (
              <p className="text-sm leading-7 text-portfolio-muted" role="status">
                No published photos are available yet.
              </p>
            ) : (
              <div className="space-y-12">
                {Array.from(photoGroups, ([eventName, records]) => (
                  <section aria-label={`Photos from ${eventName}`} className="space-y-5" key={eventName}>
                    <h4 className="font-serif text-2xl text-portfolio-text">{eventName}</h4>
                    <div className="flex snap-x snap-mandatory gap-6 overflow-x-auto pb-4">
                      {records.map((record) => (
                        <article className="min-w-[82vw] snap-start sm:min-w-[46vw] lg:min-w-[31vw]" key={record.id}>
                          <a
                            aria-label={`Open ${record.title} from ${record.event_name}`}
                            className="block focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-portfolio-accent"
                            href={`/api/image/${encodeURIComponent(record.drive_file_id)}`}
                            rel="noreferrer"
                            target="_blank"
                          >
                            <div className="relative aspect-[4/3] overflow-hidden border border-portfolio-border bg-portfolio-background">
                              <Image
                                alt={`${record.title} — ${record.event_name}`}
                                className="object-cover"
                                fill
                                sizes="(min-width: 1024px) 31vw, (min-width: 640px) 46vw, 82vw"
                                src={`/api/image/${encodeURIComponent(record.drive_file_id)}`}
                              />
                            </div>
                          </a>
                          <div className="pt-4">
                            <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                              <h5 className="font-serif text-xl text-portfolio-text">{record.title}</h5>
                              {record.year ? (
                                <p className="text-xs tracking-wide text-portfolio-muted">{record.year}</p>
                              ) : null}
                            </div>
                            {record.description ? (
                              <p className="mt-2 text-sm leading-6 text-portfolio-muted">
                                {record.description}
                              </p>
                            ) : null}
                          </div>
                        </article>
                      ))}
                    </div>
                  </section>
                ))}
              </div>
            )}
          </section>

          <section
            aria-labelledby="research-title"
            className="space-y-8 border-t border-portfolio-border/70 pt-12"
            id="research-papers"
          >
            <div>
              <p className="mb-2 text-xs tracking-[0.18em] text-portfolio-accent">
                PUBLICATIONS
              </p>
              <h3 className="font-serif text-3xl text-portfolio-text" id="research-title">
                Research Papers
              </h3>
            </div>

            {papersResult.error ? (
              <p className="border border-red-900/70 p-5 text-sm leading-7 text-red-200" role="alert">
                Research papers are temporarily unavailable. Please try again later.
              </p>
            ) : papersResult.records.length === 0 ? (
              <p className="text-sm leading-7 text-portfolio-muted" role="status">
                No published research papers are available yet.
              </p>
            ) : (
              <div className="divide-y divide-portfolio-border/70 border-y border-portfolio-border/70">
                {papersResult.records.map((paper) => (
                  <article className="grid gap-5 py-6 sm:grid-cols-[1fr_auto] sm:items-center" key={paper.id}>
                    <div className="min-w-0">
                      <h4 className="font-serif text-xl leading-snug text-portfolio-text sm:text-2xl">
                        {paper.title}
                      </h4>
                      {paper.authors ? (
                        <p className="mt-2 text-sm leading-6 text-portfolio-muted">{paper.authors}</p>
                      ) : null}
                      {paper.publication_name || paper.year ? (
                        <p className="mt-1 text-sm leading-6 text-portfolio-muted">
                          {[paper.publication_name, paper.year].filter(Boolean).join(" · ")}
                        </p>
                      ) : null}
                      {paper.abstract ? (
                        <p className="mt-4 max-w-3xl text-sm leading-7 text-portfolio-muted">
                          {paper.abstract}
                        </p>
                      ) : null}
                    </div>
                    <a
                      className="inline-flex min-h-11 w-fit items-center border-b border-portfolio-accent px-1 text-sm text-portfolio-accent transition-colors hover:text-portfolio-text focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-portfolio-accent"
                      href={`/api/paper/${encodeURIComponent(paper.drive_file_id)}/preview`}
                      rel="noreferrer"
                      target="_blank"
                    >
                      Open document
                      <span className="sr-only">: {paper.title} (opens in a new tab)</span>
                    </a>
                  </article>
                ))}
              </div>
            )}
          </section>
        </div>
      </section>

      <section
        aria-labelledby="contact-title"
        className="border-t border-portfolio-border/70"
        id="contact"
      >
        <div className="mx-auto grid max-w-7xl gap-8 px-5 py-20 sm:px-8 sm:py-28 md:grid-cols-[0.7fr_1.3fr] md:gap-20">
          <div>
            <p className="mb-5 text-xs font-medium tracking-[0.22em] text-portfolio-accent">
              GET IN TOUCH
            </p>
            <h2
              className="font-serif text-4xl font-normal tracking-[-0.04em] text-portfolio-text sm:text-5xl"
              id="contact-title"
            >
              Contact
            </h2>
          </div>

          <div className="flex flex-col items-start gap-3 text-sm sm:text-base">
            <a
              className="text-portfolio-muted underline decoration-portfolio-accent/60 underline-offset-4 transition-colors hover:text-portfolio-text focus-visible:rounded-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-portfolio-accent"
              href="https://www.instagram.com/Muhammadwail/"
              rel="noreferrer"
              target="_blank"
            >
              Instagram: @Muhammadwail
              <span className="sr-only"> (opens in a new tab)</span>
            </a>

            <a className="text-portfolio-muted underline decoration-portfolio-accent/60 underline-offset-4 transition-colors hover:text-portfolio-text focus-visible:rounded-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-portfolio-accent"
               href="https://www.youtube.com/@mohwailirsyad9010"
            >
              Youtube: Moh Wail Irsyad
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
