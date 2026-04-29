# Price Checker Web

Sistema web para consulta de preços, gerenciamento de etiquetas e inventário.

## Tech Stack

- **React 19** + **TypeScript**
- **Vite** (build tool)
- **Tailwind CSS v4**
- **Axios** (HTTP client)
- **ZXing** (barcode scanner)
- **React Router DOM** (client-side routing)

## Getting Started

### Prerequisites

- Node.js >= 18
- Backend API rodando (copie `.env.example` para `.env.local` e configure a URL)

### Local HTTPS

O servidor dev usa HTTPS. Gere certificados TLS e coloque-os na raiz do projeto ou remova a configuração `https` do `vite.config.ts` para usar HTTP.

### Development

```bash
npm run dev
```

### Build

```bash
npm run build
npm run preview
```

### Lint

```bash
npm run lint
```

## Project Structure

```
src/
├── api/                    # API clients + endpoints
│   ├── client.ts           # Axios instance + interceptors
│   ├── auth.ts             # Auth endpoints
│   ├── produtos.ts         # Produto endpoints
│   └── admin.ts            # Admin endpoints
├── components/
│   ├── ui/                 # Componentes genéricos (Button, Input)
│   ├── AdminHeader.tsx     # Header de navegação admin
│   ├── LeitorCodigo.tsx    # Leitor de código de barras
│   └── ProtectedRoute.tsx  # Wrapper de rota protegida
├── hooks/
│   └── useAuth.ts          # Auth state, login, logout, token expiry
├── pages/
│   ├── Login.tsx
│   ├── Busca.tsx
│   ├── Admin.tsx
│   ├── Etiquetas.tsx
│   ├── Inventario.tsx
│   └── NotFound.tsx
├── types/
│   ├── auth.ts             # AuthToken, JwtPayload, Role
│   ├── produto.ts          # ProdutoBasico, ProdutoCompleto
│   ├── admin.ts            # SyncJob, SyncHistory
│   └── index.ts            # Barrel exports
├── utils/
│   ├── csv.ts              # gerarCSV, baixarCSV
│   └── formatters.ts       # formatCurrency, formatDate
├── App.tsx                 # Router + route definitions
├── main.tsx
└── index.css
```

## Routes

| Rota | Componente | Acesso |
|---|---|---|
| `/login` | Login | Público |
| `/` | Busca | Autenticado (qualquer role) |
| `/admin` | AdminSync | `admin` |
| `/admin/etiquetas` | Etiquetas | `admin` |
| `/admin/inventario` | Inventario | `admin` |
| `*` | NotFound | — |

## Completed Improvements

### Phase 1: Organização de Código

- [x] Centralizar todos os tipos em `types/` (auth, produto, admin)
- [x] Criar `utils/formatters.ts` com `formatCurrency()` e `formatDate()`
- [x] Criar `utils/csv.ts` com `gerarCSV()` e `baixarCSV()` parametrizados
- [x] Mover `JwtPayload` de `Login.tsx` para `types/auth.ts`
- [x] Mover `SyncJob`/`SyncHistory` de `Admin.tsx` para `types/admin.ts`
- [x] Corrigir `lang="pt-BR"` no `index.html`

### Phase 2: React Router

- [x] Instalar `react-router-dom`
- [x] Criar `components/ProtectedRoute.tsx`
- [x] Criar componentes `ui/Button.tsx` e `ui/Input.tsx`
- [x] Configurar `<BrowserRouter>` em `App.tsx`
- [x] Definir rotas: `/login`, `/`, `/admin`, `/admin/etiquetas`, `/admin/inventario`
- [x] Substituir `window.location.href` por `useNavigate()`
- [x] Logout via `navigate()` sem reload
- [x] Criar página `NotFound.tsx`

### Phase 3: Auth Hook

- [x] Criar `hooks/useAuth.ts` com `isAuthenticated()`, `getRole()`, `login()`, `logout()`
- [x] Adicionar validação de expiração do JWT (`isTokenExpired()`)
- [x] Auto-logout se token expirado
- [x] Substituir acessos diretos a `localStorage` pelos hooks
- [x] Atualizar `api/produtos.ts` para usar role via função centralizada

### Phase 4: Refatorar Código Duplicado

- [x] Parametrizar `utils/csv.ts` (reutilizado em Etiquetas e Inventario)
- [x] Centralizar `AdminHeader.tsx` com `onLogout` prop

### Phase 5: Tipagem Strict e Acessibilidade

- [x] Remover todos os `any` dos catch blocks
- [x] Tipar retorno de `triggerSync`, `getSyncStatus`, `getSyncHistory`
- [x] Corrigir polling do `Admin.tsx` com `AbortController`
- [x] Adicionar `aria-label` em inputs e botões
- [x] Adicionar `role="alert"` em mensagens de erro
- [x] Corrigir warning de useEffect em `LeitorCodigo.tsx`

## Future Improvements

- [ ] Testes com Vitest + React Testing Library
- [ ] Toast/Snackbar system para feedback
- [ ] PWA support (service worker, offline)
- [ ] Migrate token to httpOnly cookies (backend change)
- [ ] Skeleton loading states
- [ ] Error boundary
- [ ] Extrair `BarcodeList` e `ProductCard` como componentes reutilizáveis
- [ ] Criar hooks `useProductSearch` e `useSyncPolling`
- [ ] Mover páginas admin para `pages/admin/`
