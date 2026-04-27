import api from './client'
import type { ProdutoBasico, ProdutoCompleto } from '../types'

export async function buscarProduto(codigo: string): Promise<ProdutoBasico | ProdutoCompleto> {
  const role = localStorage.getItem('role')
  const endpoint = role === 'supervisor' || role === 'admin'
    ? `/produtos/${codigo}/completo`
    : `/produtos/${codigo}`

  const response = await api.get(endpoint)
  return response.data
}