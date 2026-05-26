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

  try {
    return new Intl.DateTimeFormat('pt-BR', {
      dateStyle: 'short',
      timeStyle: 'short',
      timeZone: 'America/Manaus',
    }).format(date)
  } catch (e) {
    return new Intl.DateTimeFormat('pt-BR', {
      dateStyle: 'short',
      timeStyle: 'short',
    }).format(date)
  }
}

async function getNews({ page, limit, date, title } = {}) {
  try {
    const url = new URL(apiUrl)

    if (page) url.searchParams.set('page', String(page))
    if (limit) url.searchParams.set('limit', String(limit))
    if (date) url.searchParams.set('date', String(date))
    if (title) url.searchParams.set('title', String(title))

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

export default async function NewsPage({ searchParams }) {
  const pageParam = parseInt(getParam(searchParams?.page) || '1', 10) || 1
  const limitParam = getParam(searchParams?.limit) || '20'
  const dateParam = getParam(searchParams?.date)
  const titleParam = getParam(searchParams?.title)

  const { news, pagination, error } = await getNews({
    page: pageParam,
    limit: limitParam || undefined,
    date: dateParam || undefined,
    title: titleParam || undefined,
  })

  const buildNewsHref = (targetPage, nextDate = dateParam, nextTitle = titleParam) => {
    const params = new URLSearchParams()

    params.set('page', String(targetPage))

    if (limitParam) {
      params.set('limit', limitParam)
    }

    if (nextDate) {
      params.set('date', nextDate)
    }

    if (nextTitle) {
      params.set('title', nextTitle)
    }

    return `/news?${params.toString()}`
  }

  return (
    <main className="min-h-screen bg-atmosphere px-5 py-8 text-slate-50 md:px-8 lg:px-10">
      <section className="mx-auto w-full max-w-7xl rounded-[28px] border border-white/10 bg-panel p-6 shadow-glow backdrop-blur-xl lg:p-8">
        <div className="flex flex-col gap-4 border-b border-white/10 pb-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="mb-3 text-sm font-semibold uppercase tracking-[0.14em] text-blue-300">
              Fofoqueiro Amazonas
            </p>
            <h1 className="max-w-3xl text-4xl font-semibold leading-tight tracking-tight sm:text-5xl lg:text-6xl">
              Notícias coletadas dos portais da cidade
            </h1>
            <p className="mt-4 max-w-3xl text-base leading-7 text-slate-200/80 sm:text-lg">
              Essa aplicação mostra as noticias dos seguintes portais: 
              <strong> Amazonas Atual</strong>, <strong>Amazonas 1</strong>, <strong>D24AM</strong>, <strong>G1</strong>, <strong>G1 - Amazonas</strong>, <strong>Manaus Alerta</strong>, <strong>Portal do Holanda</strong> e <strong>Portal em Tempo</strong>.
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
          <div className="border-b border-white/10 px-4 py-4 md:px-6">
            <form action="/news" method="get" className="ml-auto flex w-full max-w-md flex-col items-end gap-2 text-right">
              <div className="flex w-full flex-col gap-2 sm:flex-row sm:items-center sm:justify-end">
                <input type="hidden" name="page" value="1" />
                <input type="hidden" name="limit" value={limitParam} />
                <input
                  type="text"
                  name="title"
                  defaultValue={titleParam}
                  placeholder="Filtrar por título"
                  className="w-full rounded-xl border border-white/10 bg-slate-900/80 px-3 py-2 text-sm text-slate-100 outline-none transition placeholder:text-slate-400 focus:border-blue-300/70 focus:ring-2 focus:ring-blue-400/30 sm:min-w-0 sm:flex-1"
                />
                <input
                  type="date"
                  name="date"
                  defaultValue={dateParam}
                  className="w-full rounded-xl border border-white/10 bg-slate-900/80 px-3 py-2 text-sm text-slate-100 outline-none transition placeholder:text-slate-400 focus:border-blue-300/70 focus:ring-2 focus:ring-blue-400/30 sm:w-40"
                />

                <div className="flex justify-end gap-2">
                  <button
                    type="submit"
                    className="rounded-xl bg-accent px-3 py-2 text-sm font-semibold text-slate-950 transition hover:bg-accentDeep"
                  >
                    Filtrar
                  </button>

                  {dateParam || titleParam ? (
                    <a
                      href={buildNewsHref(1, '', '')}
                      className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm font-semibold text-slate-100 transition hover:bg-white/10"
                    >
                      Limpar
                    </a>
                  ) : null}
                </div>
              </div>
            </form>
          </div>

          <div className="md:hidden">
            {error ? (
              <div className="px-4 py-6 text-sm text-rose-200">
                Não foi possível carregar as notícias no momento. {error}
              </div>
            ) : news.length === 0 ? (
              <div className="px-4 py-6 text-sm text-slate-200/70">Nenhuma notícia encontrada.</div>
            ) : (
              <div className="divide-y divide-white/10">
                {news.map((item, index) => (
                  <article key={item.id ?? `${item.title ?? 'news'}-${index}`} className="px-4 py-4 odd:bg-white/[0.03]">
                    <div className="mb-3 flex items-start justify-between gap-3">
                      <p className="max-w-[62%] text-sm font-semibold uppercase tracking-[0.08em] text-blue-200">
                        {item.source_name ?? '-'}
                      </p>
                      <p className="shrink-0 text-right text-xs leading-5 text-slate-300/80">
                        {formatDate(item.published_at)}
                      </p>
                    </div>

                    <p className="text-xl font-semibold leading-8 text-slate-50">{item.title ?? '-'}</p>

                    {item.link ? (
                      <a
                        className="mt-3 inline-flex rounded-xl border border-blue-300/40 bg-blue-400/10 px-3 py-2 text-sm font-medium text-blue-200 transition hover:bg-blue-400/20"
                        href={item.link}
                        target="_blank"
                        rel="noreferrer"
                      >
                        Abrir notícia
                      </a>
                    ) : null}
                  </article>
                ))}
              </div>
            )}
          </div>

          <div className="hidden overflow-x-auto md:block">
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
              href={buildNewsHref(pageParam - 1)}
            >
              ← Anterior
            </a>
          ) : (
            <span className="rounded-2xl border border-white/10 bg-white/3 px-4 py-2 text-sm font-semibold text-slate-400">
              ← Anterior
            </span>
          )}

          {pagination?.hasNextPage ?? news.length > 0 ? (
            <a
              className="rounded-2xl bg-accent px-4 py-2 text-sm font-semibold text-slate-950 transition hover:bg-accentDeep"
              href={buildNewsHref(pageParam + 1)}
            >
              Próxima →
            </a>
          ) : (
            <span className="rounded-2xl border border-white/10 bg-white/3 px-4 py-2 text-sm font-semibold text-slate-400">
              Próxima →
            </span>
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