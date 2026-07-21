/**
 * FUENTE ÚNICA DE VERDAD para descargas de productos Crono.
 * Centraliza: API keys, slugs, colores, mapeos producto ↔ release.
 */

export const API_BASE_URL = 'https://updates.crono.net'

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
  Crono: { releaseName: 'Crono', slug: 'crono', color: '#1B8AC7' },
  CronoAnalysis: { releaseName: 'CronoAnalysis', slug: 'crono-analysis', color: '#C85A47' },
  CronoAnalysis32: { releaseName: 'CronoAnalysis32', slug: 'crono-analysis-32', color: '#C85A47' },
  CronoAnalysisMSI: { releaseName: 'CronoAnalysisMSI', slug: 'crono-analysis-msi', color: '#C85A47' },
  CronoMetadata: { releaseName: 'CronoMetadata', slug: 'crono-metadata', color: '#5B2C7D' },
  CronoMetadata32: { releaseName: 'CronoMetadata32', slug: 'crono-metadata-32', color: '#5B2C7D' },
  CronoMetadataMSI: { releaseName: 'CronoMetadataMSI', slug: 'crono-metadata-msi', color: '#5B2C7D' },
  CronoETL: { releaseName: 'CronoETL', slug: 'crono-etl', color: '#1B8AC7' },
  CronoETL32: { releaseName: 'CronoETL32', slug: 'crono-etl-32', color: '#1B8AC7' },
  CronoServer: { releaseName: 'CronoServer', slug: 'crono-server', color: '#1B8AC7' },
  CronoJobs: { releaseName: 'CronoJobs', slug: 'crono-jobs', color: '#1B8AC7' },
  CronoJobs32: { releaseName: 'CronoJobs32', slug: 'crono-jobs-32', color: '#1B8AC7' },
  CronoAdministrator: { releaseName: 'CronoAdministrator', slug: 'crono-administrator', color: '#1B8AC7' },
  CronoAdministratorMSI: { releaseName: 'CronoAdministratorMSI', slug: 'crono-administrator-msi', color: '#1B8AC7' },
  CronoViewer: { releaseName: 'CronoViewer', slug: 'crono-viewer', color: '#C85A47' },
  CronoReporting: { releaseName: 'CronoReporting', slug: 'crono-reporting', color: '#C85A47' },
  CronoExcel: { releaseName: 'CronoExcel', slug: 'crono-excel', color: '#1E7B47' },
  CronoExcelMSI: { releaseName: 'CronoExcelMSI', slug: 'crono-excel', color: '#1E7B47' },
  CronoClassic: { releaseName: 'CronoClassic', slug: 'crono-classic', color: '#6B7280' },
  CronoClassicMSI: { releaseName: 'CronoClassicMSI', slug: 'crono-classic', color: '#6B7280' },
  CronoExcelClassic: { releaseName: 'CronoExcelClassic', slug: 'crono-excel-classic', color: '#1E7B47' },
  CronoExcelClassicMSI: { releaseName: 'CronoExcelClassicMSI', slug: 'crono-excel-classic', color: '#1E7B47' },
}

/** Grupos de releases usados por DownloadSummaryTable. */
export const RELEASE_SECTIONS: Record<string, string[]> = {
  StandardRelease: ['CronoAnalysis', 'CronoMetadata', 'CronoETL', 'CronoViewer', 'CronoExcelMSI', 'CronoReporting'],
  ServerRelease: ['Crono', 'CronoJobs', 'CronoAdministrator', 'CronoServer'],
  StandardReleaseX86: ['CronoAnalysis32', 'CronoMetadata32', 'CronoETL32', 'CronoJobs32'],
  MSIRelease: ['CronoAnalysisMSI', 'CronoMetadataMSI', 'CronoAdministratorMSI'],
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
