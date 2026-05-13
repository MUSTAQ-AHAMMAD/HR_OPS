/**
 * Data export utilities for CSV and Excel formats
 */

import * as XLSX from 'xlsx'
import Papa from 'papaparse'

export type ExportFormat = 'csv' | 'xlsx' | 'json'

/**
 * Convert data to CSV format
 */
export function exportToCSV<T extends Record<string, unknown>>(
  data: T[],
  filename: string = 'export.csv'
): { content: string; filename: string; mimeType: string } {
  const csv = Papa.unparse(data)

  return {
    content: csv,
    filename,
    mimeType: 'text/csv',
  }
}

/**
 * Convert data to Excel format
 */
export function exportToExcel<T extends Record<string, unknown>>(
  data: T[],
  sheetName: string = 'Sheet1',
  filename: string = 'export.xlsx'
): { content: Buffer; filename: string; mimeType: string } {
  // Create workbook
  const workbook = XLSX.utils.book_new()

  // Convert data to worksheet
  const worksheet = XLSX.utils.json_to_sheet(data)

  // Add worksheet to workbook
  XLSX.utils.book_append_sheet(workbook, worksheet, sheetName)

  // Generate buffer
  const buffer = XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' })

  return {
    content: Buffer.from(buffer),
    filename,
    mimeType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  }
}

/**
 * Convert data to JSON format
 */
export function exportToJSON<T extends Record<string, unknown>>(
  data: T[],
  filename: string = 'export.json'
): { content: string; filename: string; mimeType: string } {
  const json = JSON.stringify(data, null, 2)

  return {
    content: json,
    filename,
    mimeType: 'application/json',
  }
}

/**
 * Export data in the specified format
 */
export function exportData<T extends Record<string, unknown>>(
  data: T[],
  format: ExportFormat,
  filename?: string
): { content: string | Buffer; filename: string; mimeType: string } {
  switch (format) {
    case 'csv':
      return exportToCSV(data, filename)
    case 'xlsx':
      return exportToExcel(data, 'Data', filename)
    case 'json':
      return exportToJSON(data, filename)
    default:
      throw new Error(`Unsupported export format: ${format}`)
  }
}

/**
 * Flatten nested objects for export
 */
export function flattenObject(
  obj: Record<string, unknown>,
  prefix: string = ''
): Record<string, unknown> {
  const flattened: Record<string, unknown> = {}

  Object.keys(obj).forEach((key) => {
    const value = obj[key]
    const newKey = prefix ? `${prefix}.${key}` : key

    if (value && typeof value === 'object' && !Array.isArray(value) && !(value instanceof Date)) {
      Object.assign(flattened, flattenObject(value as Record<string, unknown>, newKey))
    } else if (Array.isArray(value)) {
      flattened[newKey] = JSON.stringify(value)
    } else {
      flattened[newKey] = value
    }
  })

  return flattened
}

/**
 * Prepare data for export by flattening nested objects
 */
export function prepareDataForExport<T extends Record<string, unknown>>(
  data: T[],
  excludeFields: string[] = []
): Record<string, unknown>[] {
  return data.map((item) => {
    const flattened = flattenObject(item)

    // Remove excluded fields
    excludeFields.forEach((field) => {
      delete flattened[field]
    })

    return flattened
  })
}

/**
 * Create a Response object for file download
 */
export function createDownloadResponse(
  content: string | Buffer,
  filename: string,
  mimeType: string
): Response {
  const headers = new Headers()
  headers.set('Content-Type', mimeType)
  headers.set('Content-Disposition', `attachment; filename="${filename}"`)

  // Convert Buffer to Uint8Array for Next.js Response compatibility
  const body = typeof content === 'string' ? content : new Uint8Array(content)

  return new Response(body, {
    status: 200,
    headers,
  })
}
