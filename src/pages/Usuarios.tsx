import { useState, useEffect } from 'react'
import AdminHeader from '../components/AdminHeader'
import { useNavigate } from 'react-router-dom'
import {
  listarUsuarios,
  criarUsuario,
  atualizarUsuario,
  excluirUsuario,
  type Usuario,
} from '../api/usuarios'
import { useAuth } from '../hooks/useAuth'
import type { Role } from '../types'

const ROLES: Role[] = ['operador', 'supervisor', 'admin']

const roleBadgeClass: Record<Role, string> = {
  operador: 'bg-gray-100 text-gray-600',
  supervisor: 'bg-blue-100 text-blue-700',
  admin: 'bg-purple-100 text-purple-700',
}

interface ModalEdicao {
  usuario: Usuario
  password: string
  role: Role
  loading: boolean
  erro: string
}

export default function Usuarios() {
  const { getRole, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }
  const [usuarios, setUsuarios] = useState<Usuario[]>([])
  const [carregando, setCarregando] = useState(true)
  const [erroGeral, setErroGeral] = useState('')

  // Formulário de criação
  const [novoUsername, setNovoUsername] = useState('')
  const [novoNome, setNovoNome] = useState('')
  const [novoPassword, setNovoPassword] = useState('')
  const [novoRole, setNovoRole] = useState<Role>('operador')
  const [criando, setCriando] = useState(false)
  const [erroCriacao, setErroCriacao] = useState('')

  // Modal de edição
  const [modal, setModal] = useState<ModalEdicao | null>(null)

  const meuRole = getRole()
  const meuUsername = (() => {
    try {
      const token = localStorage.getItem('token')
      if (!token) return null
      const payload = JSON.parse(atob(token.split('.')[1]))
      return payload.sub as string
    } catch { return null }
  })()

  async function carregar() {
    setCarregando(true)
    try {
      setUsuarios(await listarUsuarios())
    } catch {
      setErroGeral('Erro ao carregar usuários.')
    } finally {
      setCarregando(false)
    }
  }

  useEffect(() => { carregar() }, [])

  async function handleCriar() {
    setErroCriacao('')
    if (!novoUsername.trim() || !novoNome.trim() || !novoPassword.trim()) {
      setErroCriacao('Preencha todos os campos.')
      return
    }
    setCriando(true)
    try {
      await criarUsuario({
        username: novoUsername.trim(),
        nome_exibicao: novoNome.trim(),
        password: novoPassword.trim(),
        role: novoRole,
      })
      setNovoUsername('')
      setNovoNome('')
      setNovoPassword('')
      setNovoRole('operador')
      await carregar()
    } catch (e: any) {
      if (e.response?.status === 409) setErroCriacao('Username já existe.')
      else setErroCriacao('Erro ao criar usuário.')
    } finally {
      setCriando(false)
    }
  }

  async function handleAtualizar() {
    if (!modal) return
    const dados: { password?: string; role?: Role } = {}
    if (modal.password.trim()) dados.password = modal.password.trim()
    if (modal.role !== modal.usuario.role) dados.role = modal.role
    if (!dados.password && !dados.role) {
      setModal(m => m ? { ...m, erro: 'Nenhuma alteração fornecida.' } : null)
      return
    }
    setModal(m => m ? { ...m, loading: true, erro: '' } : null)
    try {
      await atualizarUsuario(modal.usuario.id, dados)
      setModal(null)
      await carregar()
    } catch {
      setModal(m => m ? { ...m, loading: false, erro: 'Erro ao atualizar.' } : null)
    }
  }

  async function handleExcluir(usuario: Usuario) {
    if (!confirm(`Excluir o usuário "${usuario.nome_exibicao}"?`)) return
    try {
      await excluirUsuario(usuario.id)
      await carregar()
    } catch {
      setErroGeral('Erro ao excluir usuário.')
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center px-4 py-10">

      {/* Modal de edição */}
      {modal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-sm flex flex-col gap-4">
            <div>
              <p className="text-sm font-semibold text-gray-700">Editar usuário</p>
              <p className="text-xs text-gray-400 mt-1">{modal.usuario.nome_exibicao} ({modal.usuario.username})</p>
            </div>

            <div className="flex flex-col gap-3">
              <div>
                <label className="text-xs text-gray-500 mb-1 block">Nova senha (opcional)</label>
                <input
                  type="password"
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Deixe em branco para não alterar"
                  value={modal.password}
                  onChange={(e) => setModal(m => m ? { ...m, password: e.target.value } : null)}
                />
              </div>
              <div>
                <label className="text-xs text-gray-500 mb-1 block">Role</label>
                <select
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={modal.role}
                  onChange={(e) => setModal(m => m ? { ...m, role: e.target.value as Role } : null)}
                >
                  {ROLES.map(r => <option key={r} value={r}>{r}</option>)}
                </select>
              </div>
            </div>

            {modal.erro && <p className="text-red-500 text-sm">{modal.erro}</p>}

            <div className="flex gap-2">
              <button
                onClick={() => setModal(null)}
                className="flex-1 border border-gray-300 text-gray-600 font-semibold py-2 rounded-lg hover:bg-gray-50 transition"
              >
                Cancelar
              </button>
              <button
                onClick={handleAtualizar}
                disabled={modal.loading}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg transition disabled:opacity-50"
              >
                {modal.loading ? 'Salvando...' : 'Salvar'}
              </button>
            </div>
          </div>
        </div>
      )}

      <AdminHeader titulo="Usuários" paginaAtual="usuarios" onLogout={handleLogout} />

      <div className="w-full max-w-2xl flex flex-col gap-6">

        {/* Formulário de criação */}
        <div className="bg-white rounded-2xl shadow-md p-6">
          <h2 className="text-base font-semibold text-gray-700 mb-4">Novo usuário</h2>
          <div className="flex flex-col gap-3">
            <div className="flex gap-3">
              <input
                className="flex-1 border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Username"
                value={novoUsername}
                onChange={(e) => setNovoUsername(e.target.value)}
              />
              <input
                className="flex-1 border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Nome de exibição"
                value={novoNome}
                onChange={(e) => setNovoNome(e.target.value)}
              />
            </div>
            <div className="flex gap-3">
              <input
                type="password"
                className="flex-1 border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Senha"
                value={novoPassword}
                onChange={(e) => setNovoPassword(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleCriar()}
              />
              <select
                className="border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={novoRole}
                onChange={(e) => setNovoRole(e.target.value as Role)}
              >
                {ROLES.map(r => <option key={r} value={r}>{r}</option>)}
              </select>
              <button
                onClick={handleCriar}
                disabled={criando}
                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2 rounded-lg transition disabled:opacity-50 whitespace-nowrap"
              >
                {criando ? '...' : 'Criar'}
              </button>
            </div>
            {erroCriacao && <p className="text-red-500 text-sm">{erroCriacao}</p>}
          </div>
        </div>

        {/* Lista de usuários */}
        <div className="bg-white rounded-2xl shadow-md p-6">
          <h2 className="text-base font-semibold text-gray-700 mb-4">
            Usuários
            {!carregando && (
              <span className="text-gray-400 font-normal text-sm ml-2">({usuarios.length})</span>
            )}
          </h2>

          {erroGeral && <p className="text-red-500 text-sm mb-3">{erroGeral}</p>}
          {carregando && <p className="text-sm text-gray-400">Carregando...</p>}

          {!carregando && (
            <div className="flex flex-col gap-2">
              {usuarios.map(usuario => (
                <div key={usuario.id} className="flex justify-between items-center border rounded-lg px-4 py-3">
                  <div className="flex items-center gap-3">
                    <div>
                      <p className="text-sm font-semibold text-gray-700">{usuario.nome_exibicao}</p>
                      <p className="text-xs text-gray-400">{usuario.username}</p>
                    </div>
                    <span className={`text-xs font-semibold px-2 py-1 rounded-full ${roleBadgeClass[usuario.role]}`}>
                      {usuario.role}
                    </span>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setModal({
                        usuario,
                        password: '',
                        role: usuario.role,
                        loading: false,
                        erro: '',
                      })}
                      className="text-sm text-gray-500 hover:text-blue-600 transition"
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => handleExcluir(usuario)}
                      disabled={usuario.username === meuUsername}
                      className="text-sm text-gray-300 hover:text-red-500 transition disabled:opacity-30 disabled:cursor-not-allowed"
                    >
                      Excluir
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}