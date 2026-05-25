const metrics = [
  { value: '01', label: 'Next.js configurado' },
  { value: '02', label: 'Tailwind ativo' },
  { value: '03', label: 'base para evoluir' },
]

const features = [
  'Layout responsivo com foco em clareza',
  'Cabeçalho, destaque principal e cards de status',
  'Estilo limpo para servir de base ao produto real',
]

export default function HomePage() {
  return (
    <main className="min-h-screen bg-atmosphere px-5 py-8 text-slate-50 md:px-8 lg:px-10">
      <section className="mx-auto grid w-full max-w-6xl gap-6 rounded-[28px] border border-white/10 bg-panel p-6 shadow-glow backdrop-blur-xl lg:grid-cols-[1.4fr_0.8fr] lg:p-8">
        <div>
          <p className="mb-3 text-sm font-semibold uppercase tracking-[0.14em] text-blue-300">
            Fofoqueiro Front
          </p>
          <h1 className="max-w-[12ch] text-5xl font-semibold leading-[0.95] tracking-tight sm:text-6xl lg:text-7xl">
            Um frontend básico em Next.js, pronto para crescer.
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-7 text-slate-200/80 sm:text-lg">
            Essa base já vem com App Router, Tailwind e uma interface simples para você começar a montar suas telas.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-4">
            <a
              className="inline-flex min-h-12 items-center justify-center rounded-full bg-gradient-to-r from-blue-400 to-blue-500 px-5 font-semibold text-slate-950 shadow-[0_14px_30px_rgba(77,124,255,0.35)] transition-transform duration-200 hover:-translate-y-0.5"
              href="https://nextjs.org"
              target="_blank"
              rel="noreferrer"
            >
              Ver Next.js
            </a>
            <span className="text-sm text-slate-200/70">
              Edite <strong className="text-slate-50">app/page.jsx</strong> para personalizar o conteúdo.
            </span>
          </div>
        </div>

        <aside className="grid gap-3 content-start">
          {metrics.map((item) => (
            <article key={item.label} className="rounded-2xl border border-white/10 bg-white/5 p-5">
              <span className="block text-2xl font-extrabold text-blue-300">{item.value}</span>
              <p className="mt-2 text-sm text-slate-200/85">{item.label}</p>
            </article>
          ))}
        </aside>
      </section>

      <section className="mx-auto mt-6 grid w-full max-w-6xl gap-4 lg:grid-cols-3">
        {features.map((feature) => (
          <article
            key={feature}
            className="flex items-center gap-4 rounded-2xl border border-white/10 bg-white/5 px-5 py-4"
          >
            <div className="h-3 w-3 shrink-0 rounded-full bg-blue-400 shadow-[0_0_0_8px_rgba(116,163,255,0.12)]" />
            <p className="text-sm text-slate-100/85">{feature}</p>
          </article>
        ))}
      </section>
    </main>
  )
}
