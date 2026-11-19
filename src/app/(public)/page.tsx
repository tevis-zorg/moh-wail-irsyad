export default function HomePage() {
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

        <div
          aria-label="Portrait or performance image placeholder"
          className="relative mx-auto aspect-[4/5] w-full max-w-lg overflow-hidden border border-portfolio-border bg-portfolio-surface"
          role="img"
        >
          <div
            aria-hidden="true"
            className="absolute inset-4 border border-portfolio-border/70 sm:inset-6"
          />
          <div
            aria-hidden="true"
            className="absolute inset-x-0 top-1/2 h-px bg-portfolio-border/60"
          />
          <div
            aria-hidden="true"
            className="absolute inset-y-0 left-1/2 w-px bg-portfolio-border/60"
          />
          <div
            aria-hidden="true"
            className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_42%,rgba(199,173,134,0.08),transparent_58%)]"
          />
        </div>
      </section>

      <section
        aria-labelledby="about-title"
        className="border-t border-portfolio-border/70 bg-portfolio-surface/60"
        id="about"
      >
        <div className="mx-auto grid max-w-7xl gap-10 px-5 py-20 sm:px-8 sm:py-28 lg:grid-cols-[0.7fr_1.3fr] lg:gap-20">
          <div>
            <p className="mb-5 text-xs font-medium tracking-[0.22em] text-portfolio-accent">
              MOH. WAIL IRSYAD
            </p>
            <h2
              className="font-serif text-4xl font-normal tracking-[-0.04em] text-portfolio-text sm:text-5xl"
              id="about-title"
            >
              About Me
            </h2>
          </div>

          <div className="max-w-3xl space-y-6 text-base leading-8 text-portfolio-muted sm:text-lg sm:leading-9">
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
          </div>
        </div>
      </section>
    </>
  );
}
