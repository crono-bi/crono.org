/**
 * FUENTE ÚNICA DE VERDAD para descargas de productos Crono.
 * Centraliza: API keys, slugs, colores, mapeos producto ↔ release.
 */

export const API_BASE_URL = 'https://updates.crono.net'

const DOWNLOAD_BASE_URL = 'https://downloads.crono.org'

const S3_UPDATES_PREFIX = 'https://s3.eu-west-1.amazonaws.com/downloads.crono.net/updates/'

/**
 * Reescribe una URI del API (S3) a la URL pública de downloads.crono.org.
 * Descarta cualquier URI que no sea https (evita `javascript:` u otros esquemas en href).
 */
export function toDownloadUrl(uri: string | null): string | null {
  if (!uri?.startsWith('https://')) return null
  if (uri.startsWith(S3_UPDATES_PREFIX)) {
    return DOWNLOAD_BASE_URL + uri.slice(S3_UPDATES_PREFIX.length - 1)
  }
  return uri
}

export interface DownloadProductDefinition {
  /** ReleaseName usado en la API (ej: CronoExcelMSI). */
  releaseName: string
  /** Slug de la página de descargas (ej: crono-excel). */
  slug: string
  /** Color de marca para UI. */
  color: string
}

export interface DownloadItem {
  IdRelease: number
  ReleaseName: string
  ProductDescription: string
  ReleaseDescription: string
  Version: string
  MajorVersion: number
  MinorVersion: number
  Date: string
  StartDate: string
  ExpirationDate: string | null
  ReleaseMode: string
  SetupName: string | null
  SetupUri: string | null
  UpdateLocation: string | null
  Hash: string | null
  FileName: string | null
  Length: number | null
  EmergencyStop: boolean
}

/** Productos con su releaseName oficial de la API. */
export const DOWNLOAD_PRODUCTS: Record<string, DownloadProductDefinition> = {
  CronoAPI: { releaseName: 'CronoAPI', slug: 'crono-api', color: '#1B8AC7' },
  CronoAnalysis: { releaseName: 'CronoAnalysis', slug: 'crono-analysis', color: '#C85A47' },
  CronoAnalysis32: { releaseName: 'CronoAnalysis32', slug: 'crono-analysis-32', color: '#C85A47' },
  CronoAnalysisMSI: { releaseName: 'CronoAnalysisMSI', slug: 'crono-analysis-msi', color: '#C85A47' },
  CronoMetadata: { releaseName: 'CronoMetadata', slug: 'crono-metadata', color: '#5B2C7D' },
  CronoMetadata32: { releaseName: 'CronoMetadata32', slug: 'crono-metadata-32', color: '#5B2C7D' },
  CronoMetadataMSI: { releaseName: 'CronoMetadataMSI', slug: 'crono-metadata-msi', color: '#5B2C7D' },
  CronoETL: { releaseName: 'CronoETL', slug: 'crono-etl', color: '#1B8AC7' },
  CronoETL32: { releaseName: 'CronoETL32', slug: 'crono-etl-32', color: '#1B8AC7' },
  CronoAnalysisCLI: { releaseName: 'crono-analysis', slug: 'crono-analysis-cli', color: '#C85A47' },
  CronoETLCLI: { releaseName: 'crono-etl', slug: 'crono-etl-cli', color: '#1B8AC7' },
  CronoServer: { releaseName: 'CronoServer', slug: 'crono-server', color: '#1B8AC7' },
  CronoAdministrator: { releaseName: 'CronoAdministrator', slug: 'crono-administrator', color: '#1B8AC7' },
  CronoAdministratorMSI: { releaseName: 'CronoAdministratorMSI', slug: 'crono-administrator-msi', color: '#1B8AC7' },
  CronoViewer: { releaseName: 'CronoViewer', slug: 'crono-viewer', color: '#C85A47' },
  CronoReporting: { releaseName: 'CronoReporting', slug: 'crono-reporting', color: '#10B981' },
  CronoExcel: { releaseName: 'CronoExcel', slug: 'crono-excel', color: '#1E7B47' },
  CronoExcelMSI: { releaseName: 'CronoExcelMSI', slug: 'crono-excel', color: '#1E7B47' },
  CronoClassic: { releaseName: 'CronoClassic', slug: 'crono-classic', color: '#6B7280' },
  CronoClassicMSI: { releaseName: 'CronoClassicMSI', slug: 'crono-classic', color: '#6B7280' },
  CronoExcelClassic: { releaseName: 'CronoExcelClassic', slug: 'crono-excel-classic', color: '#1E7B47' },
  CronoExcelClassicMSI: { releaseName: 'CronoExcelClassicMSI', slug: 'crono-excel-classic', color: '#1E7B47' },
}

/** Grupos de releases usados por DownloadSummaryTable. */
export type ReleaseSection =
  | 'StandardRelease'
  | 'ServerRelease'
  | 'StandardReleaseX86'
  | 'MSIRelease'
  | 'CliRelease'
  | 'CronoClassic'

export const RELEASE_SECTIONS: Record<ReleaseSection, string[]> = {
  StandardRelease: ['CronoAnalysis', 'CronoMetadata', 'CronoETL', 'CronoViewer', 'CronoExcelMSI', 'CronoReporting'],
  ServerRelease: ['CronoAdministrator', 'CronoAPI', 'CronoServer'],
  StandardReleaseX86: ['CronoAnalysis32', 'CronoMetadata32', 'CronoETL32'],
  MSIRelease: ['CronoAnalysisMSI', 'CronoMetadataMSI', 'CronoAdministratorMSI'],
  CliRelease: ['crono-analysis', 'crono-etl'],
  CronoClassic: ['CronoClassicMSI', 'CronoExcelClassicMSI'],
}

export function getDownloadProduct(releaseName: string): DownloadProductDefinition | undefined {
  return Object.values(DOWNLOAD_PRODUCTS).find(p => p.releaseName === releaseName)
}

export function getSlugByReleaseName(releaseName: string): string {
  return getDownloadProduct(releaseName)?.slug ?? releaseName.toLowerCase()
}

export function getColorByReleaseName(releaseName: string): string {
  return getDownloadProduct(releaseName)?.color ?? '#6B7280'
}
