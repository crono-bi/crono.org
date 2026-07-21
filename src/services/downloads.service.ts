/**
 * Servicio compartido de descargas.
 * Hace fetch client-side a updates.crono.net con cache en memoria
 * y deduplica requests en vuelo.
 */

import { API_BASE_URL, RELEASE_SECTIONS, type DownloadItem } from '../config/downloads'

type CacheEntry<T> = {
  data: T
  expiresAt: number
}

const cache = new Map<string, CacheEntry<any>>()
const inFlight = new Map<string, Promise<any>>()
const CACHE_TTL_MS = 5 * 60 * 1000 // 5 minutos

function getCache<T>(key: string): T | undefined {
  const entry = cache.get(key)
  if (!entry) return undefined
  if (Date.now() > entry.expiresAt) {
    cache.delete(key)
    return undefined
  }
  return entry.data as T
}

function setCache<T>(key: string, data: T): void {
  cache.set(key, { data, expiresAt: Date.now() + CACHE_TTL_MS })
}

function withCache<T>(key: string, factory: () => Promise<T>): Promise<T> {
  const cached = getCache<T>(key)
  if (cached) return Promise.resolve(cached)

  const existing = inFlight.get(key)
  if (existing) return existing as Promise<T>

  const promise = factory().then((data) => {
    setCache(key, data)
    return data
  }).finally(() => {
    inFlight.delete(key)
  })

  inFlight.set(key, promise)
  return promise
}

function stripBom(text: string): string {
  return text.replace(/^\uFEFF/, '')
}

async function fetchJson<T>(url: string): Promise<T> {
  const response = await fetch(url, {
    headers: { Accept: 'application/json' },
  })
  if (!response.ok) {
    throw new Error(`HTTP ${response.status}: ${response.statusText}`)
  }
  const text = stripBom(await response.text())
  return JSON.parse(text) as T
}

/**
 * Devuelve el historial completo de un producto.
 * Ordenado por fecha descendente.
 */
export function fetchHistory(productReleaseName: string): Promise<DownloadItem[]> {
  const cacheKey = `history:${productReleaseName}`
  return withCache(cacheKey, async () => {
    const items = await fetchJson<DownloadItem[]>(`${API_BASE_URL}/${productReleaseName}/history.json`)
    items.sort((a, b) => new Date(b.Date).getTime() - new Date(a.Date).getTime())
    return items
  })
}

/**
 * Devuelve el último release de cada producto.
 */
export function fetchLastReleases(): Promise<DownloadItem[]> {
  return withCache('last', () => fetchJson<DownloadItem[]>(`${API_BASE_URL}/last.json`))
}

/**
 * Devuelve los últimos releases de una sección (StandardRelease, ServerRelease, etc.).
 */
export async function fetchSectionReleases(section: string): Promise<DownloadItem[]> {
  const releaseNames = RELEASE_SECTIONS[section] ?? []
  if (releaseNames.length === 0) return []

  const all = await fetchLastReleases()
  return releaseNames
    .map(name => all.find(item => item.ReleaseName === name))
    .filter((item): item is DownloadItem => item !== undefined)
}
