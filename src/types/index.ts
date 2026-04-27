export type Role = 'operador' | 'supervisor' | 'admin'

export interface AuthToken {
  access_token: string
  token_type: string
}

export interface ProdutoBasico {
  codigo_chamada: string
  codigo_buscado: string | null
  nome: string
  preco_venda: number
  estoque: number
  grupo: string
  familia: string
}

export interface ProdutoCompleto extends ProdutoBasico {
  preco_custo: number
  markup: number
  margem: number
}