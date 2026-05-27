"use client"

import { useRouter } from 'next/navigation'

export default function NewsFilters({ limitParam, dateParam, sourceParam, titleParam, portals, clearHref }) {
  const router = useRouter()

  function handleSubmit(event) {
    event.preventDefault()

    const formData = new FormData(event.currentTarget)
    const params = new URLSearchParams()

    for (const [key, value] of formData.entries()) {
      const normalizedValue = typeof value === 'string' ? value.trim() : ''

      if (normalizedValue) {
        params.set(key, normalizedValue)
      }
    }

    params.set('page', '1')

    router.push(`/news?${params.toString()}`)
  }

  return (
    <form onSubmit={handleSubmit} className="flex w-full flex-col gap-2 text-left">
      <div className="flex w-full flex-col gap-2 sm:flex-row sm:items-center sm:justify-start">
        <input type="hidden" name="page" value="1" />
        <input type="hidden" name="limit" value={limitParam} />
        <select
          name="source_name"
          defaultValue={sourceParam}
          className="w-full rounded-xl border border-white/10 bg-slate-900/80 px-3 py-2 text-sm text-slate-100 outline-none transition focus:border-blue-300/70 focus:ring-2 focus:ring-blue-400/30 sm:w-[24%] sm:flex-none"
        >
          <option value="">Filtrar por fonte</option>
          {portals.map((portal) => (
            <option key={portal} value={portal}>
              {portal}
            </option>
          ))}
        </select>
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

        <div className="flex justify-start gap-2 sm:ml-auto">
          <button
            type="submit"
            className="rounded-xl bg-accent p-2 text-sm font-semibold text-slate-950 transition hover:bg-accentDeep"
          >
            Filtrar
          </button>

          {dateParam || sourceParam || titleParam ? (
            <a
              href={clearHref}
              className="rounded-xl border border-white/10 bg-white/5 p-2 text-sm font-semibold text-slate-100 transition hover:bg-white/10"
            >
              Limpar
            </a>
          ) : null}
        </div>
      </div>
    </form>
  )
}