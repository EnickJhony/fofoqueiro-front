export const dynamic = 'force-dynamic'

const serverUrl = process.env.NEXT_PUBLIC_NEWS_API_URL || 'http://localhost:3333/'
const apiUrl = serverUrl.endsWith('/api/news') ? serverUrl : `${serverUrl.replace(/\/+$/, '')}/api/news`

function getParam(value) {
  if (Array.isArray(value)) return value[0] ?? ''
  return typeof value === 'string' ? value : ''
}

function formatDate(value) {
  if (!value) {
    return '-'
  }

  const date = new Date(value)

  if (Number.isNaN(date.getTime())) {
    return value
  }

  return new Intl.DateTimeFormat('pt-BR', {
    dateStyle: 'short',
    timeStyle: 'short',
  }).format(date)
}

async function getNews({ page, limit } = {}) {
  try {
    const url = new URL(apiUrl)

    if (page) url.searchParams.set('page', String(page))
    if (limit) url.searchParams.set('limit', String(limit))

    const response = await fetch(url.toString(), { cache: 'no-store' })

    if (!response.ok) {
      throw new Error(`Falha ao carregar notícias: ${response.status}`)
    }

    const data = await response.json()

    return {
      news: Array.isArray(data) ? data : Array.isArray(data?.data) ? data.data : [],
      pagination: Array.isArray(data) ? null : data?.pagination ?? null,
      error: null,
    }
  } catch (error) {
    return {
      news: [],
      pagination: null,
      error: error instanceof Error ? error.message : 'Falha ao carregar notícias.',
    }
  }
}

export default async function HomePage({ searchParams }) {
  const pageParam = parseInt(getParam(searchParams?.page) || '1', 10) || 1
  const limitParam = getParam(searchParams?.limit) || '20'

  const { news, pagination, error } = await getNews({ page: pageParam, limit: limitParam || undefined })

  return (
    <main className="min-h-screen bg-atmosphere px-5 py-8 text-slate-50 md:px-8 lg:px-10">
      <section className="mx-auto w-full max-w-7xl rounded-[28px] border border-white/10 bg-panel p-6 shadow-glow backdrop-blur-xl lg:p-8">
        <div className="flex flex-col gap-4 border-b border-white/10 pb-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="mb-3 text-sm font-semibold uppercase tracking-[0.14em] text-blue-300">
              Fofoqueiro Front
            </p>
            <h1 className="max-w-3xl text-4xl font-semibold leading-tight tracking-tight sm:text-5xl lg:text-6xl">
              Notícias coletadas dos portais da cidade
            </h1>
            <p className="mt-4 max-w-3xl text-base leading-7 text-slate-200/80 sm:text-lg">
              Esse frontend consome a rota <span className="font-semibold text-slate-50">{apiUrl}</span> e mostra a lista
              de notícias em uma tabela.
            </p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-slate-200/80">
            <span className="block text-xs uppercase tracking-[0.16em] text-blue-300">Status</span>
            <span className="mt-1 block font-medium">
              {error ? 'API indisponível' : `${news.length} notícia(s) carregada(s)`}
            </span>
          </div>
        </div>

        <div className="mt-6 overflow-hidden rounded-[24px] border border-white/10 bg-slate-950/40">
          <div className="overflow-x-auto">
            <table className="min-w-full table-fixed border-separate border-spacing-0 text-left">
              <colgroup>
                <col className="w-[24%]" />
                <col className="w-[56%]" />
                <col className="w-[20%]" />
              </colgroup>
              <thead className="bg-white/5 text-xs uppercase tracking-[0.16em] text-slate-200/70">
                <tr>
                  <th className="border-b border-white/10 px-4 py-4 font-semibold">Fonte</th>
                  <th className="border-b border-white/10 px-4 py-4 font-semibold">Título</th>
                  <th className="border-b border-white/10 px-4 py-4 font-semibold">Publicado em</th>
                </tr>
              </thead>
              <tbody>
                {error ? (
                  <tr>
                    <td className="px-4 py-8 text-sm text-rose-200" colSpan={3}>
                      Não foi possível carregar as notícias no momento. {error}
                    </td>
                  </tr>
                ) : news.length === 0 ? (
                  <tr>
                    <td className="px-4 py-8 text-sm text-slate-200/70" colSpan={3}>
                      Nenhuma notícia encontrada.
                    </td>
                  </tr>
                ) : (
                  news.map((item, index) => (
                    <tr key={item.id ?? `${item.title ?? 'news'}-${index}`} className="odd:bg-white/[0.03]">
                      <td className="border-b border-white/5 px-4 py-4 align-top">
                        <div className="min-w-0">
                          <p className="font-medium text-slate-50">{item.source_name ?? '-'}</p>
                        </div>
                      </td>
                      <td className="border-b border-white/5 px-4 py-4 align-top">
                        <div className="min-w-0">
                          <p className="break-words font-medium text-slate-50">{item.title ?? '-'}</p>
                          {item.link ? (
                            <a
                              className="mt-1 block truncate text-xs text-blue-300 transition hover:text-blue-200"
                              href={item.link}
                              target="_blank"
                              rel="noreferrer"
                            >
                              Abrir notícia
                            </a>
                          ) : null}
                        </div>
                      </td>
                      <td className="border-b border-white/5 px-4 py-4 align-top text-sm text-slate-200/80">
                        {formatDate(item.published_at)}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="mt-4 flex items-center justify-end gap-3">
          {pageParam > 1 ? (
            <a
              className="rounded-2xl border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold text-slate-100 transition hover:bg-white/10"
              href={`/?page=${pageParam - 1}${limitParam ? `&limit=${encodeURIComponent(limitParam)}` : ''}`}
            >
              ← Anterior
            </a>
          ) : (
            <span className="rounded-2xl border border-white/10 bg-white/3 px-4 py-2 text-sm font-semibold text-slate-400">← Anterior</span>
          )}

          {pagination?.hasNextPage ?? news.length > 0 ? (
            <a
              className="rounded-2xl bg-accent px-4 py-2 text-sm font-semibold text-slate-950 transition hover:bg-accentDeep"
              href={`/?page=${pageParam + 1}${limitParam ? `&limit=${encodeURIComponent(limitParam)}` : ''}`}
            >
              Próxima →
            </a>
          ) : (
            <span className="rounded-2xl border border-white/10 bg-white/3 px-4 py-2 text-sm font-semibold text-slate-400">Próxima →</span>
          )}
        </div>

        {pagination ? (
          <p className="mt-3 text-right text-xs text-slate-200/60">
            Página {pagination.page} de {pagination.totalPages} · {pagination.total} notícia(s)
          </p>
        ) : null}
      </section>
    </main>
  )
}