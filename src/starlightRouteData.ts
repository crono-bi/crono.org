import { defineRouteMiddleware } from '@astrojs/starlight/route-data'
import { DOWNLOAD_PAGES } from './config/download-pages'
import { getLangFromPath, useT } from './i18n/ui'

/**
 * Inyecta en el TOC ("En esta página") las secciones que renderiza
 * ProductDownloadPage, ya que sus headings viven en el componente
 * y Starlight no los recoge del markdown.
 */
export const onRequest = defineRouteMiddleware((context) => {
	const { starlightRoute } = context.locals
	const path = context.url.pathname.replace(/^\/en(?=\/|$)/, '')
	const match = path.match(/^\/downloads\/([^/]+)\/?$/)
	if (!match || !starlightRoute.toc) return

	const page = DOWNLOAD_PAGES[match[1]]
	if (!page) return

	const lang = getLangFromPath(context.url.pathname)
	const t = useT(lang)
	const items = starlightRoute.toc.items

	if (page.requirements) {
		items.push({
			depth: 2,
			slug: lang === 'en' ? 'requirements' : 'requisitos',
			text: t('downloadPage.requirements'),
			children: [],
		})
	}
	if (page.cliPackage) {
		items.push({ depth: 2, slug: 'cli', text: t('downloadPage.cli.title'), children: [] })
	}
	items.push({
		depth: 2,
		slug: lang === 'en' ? 'version-history' : 'historial-de-versiones',
		text: t('downloadPage.history'),
		children: [],
	})
})
