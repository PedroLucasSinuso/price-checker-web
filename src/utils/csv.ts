export interface CsvRow {
  codigo: string
  tipo: string
  quantidade: number
}

export function gerarCSV(rows: CsvRow[]): string {
  return rows.map(r => `${r.codigo};${r.tipo};${r.quantidade}`).join('\n')
}

export function baixarCSV(conteudo: string, prefixo: string): void {
  const blob = new Blob([conteudo], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = `${prefixo}_${new Date().toISOString().slice(0, 10)}.csv`
  link.click()
  URL.revokeObjectURL(url)
}
