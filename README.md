# Price Checker Web

Sistema web para consulta de preços, gerenciamento de etiquetas e inventário.

## Tech Stack

- **React 19** + **TypeScript**
- **Vite** (build tool)
- **Tailwind CSS v4**
- **Axios** (HTTP client)
- **ZXing** (barcode scanner)

## Getting Started

### Prerequisites

- Node.js >= 18
- Backend API rodando (copie `.env.example` para `.env.local` e configure a URL)

### Local HTTPS

O servidor dev usa HTTPS. Gere certificados TLS e coloque-os na raiz do projeto ou remova a configuração `https` do `vite.config.ts` para usar HTTP.

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
│   ├── BarcodeList.tsx     # Lista genérica com input de código
│   ├── BarcodeScanner.tsx  # Leitor de código de barras
│   ├── ProductCard.tsx     # Card de produto reutilizável
│   └── ProtectedRoute.tsx  # Wrapper de rota protegida
├── hooks/
│   ├── useAuth.ts          # Auth state, login, logout, token expiry
│   ├── useProductSearch.ts # Lógica de busca de produtos
│   └── useSyncPolling.ts   # Polling para status de sync ETL
├── pages/
│   ├── Login.tsx
│   ├── Busca.tsx
│   └── admin/
│       ├── AdminSync.tsx
│       ├── AdminEtiquetas.tsx
│       └── AdminInventario.tsx
├── types/
│   ├── auth.ts             # AuthToken, JwtPayload, Role
│   ├── produto.ts          # ProdutoBasico, ProdutoCompleto
│   ├── admin.ts            # SyncJob, SyncHistory
│   └── api.ts              # ApiError type guard
├── utils/
│   ├── csv.ts              # gerarCSV, baixarCSV
│   ├── formatters.ts       # formatCurrency, formatDate
│   └── isApiError.ts       # Type guard para erros de API
├── App.tsx                 # Router + route definitions
├── main.tsx
└── index.css
```

## Roadmap

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
- [ ] Interceptor 401 redireciona via navigate (adiado para Phase 3)
- [x] Criar página `NotFound.tsx`

### Phase 3: Auth Hook

- [ ] Criar `hooks/useAuth.ts` com `isAuthenticated()`, `getRole()`, `login()`, `logout()`
- [ ] Adicionar validação de expiração do JWT (`isTokenExpired()`)
- [ ] Auto-logout se token expirado
- [ ] Substituir acessos diretos a `localStorage` pelos hooks
- [ ] Atualizar `api/produtos.ts` para usar role via hook

### Phase 4: Refatorar Código Duplicado

- [ ] Criar `components/ProductCard.tsx`
- [ ] Criar `components/BarcodeList.tsx` (genérico)
- [ ] Criar `hooks/useBarcodeList.ts`
- [ ] Refatorar `Etiquetas.tsx` para usar componentes compartilhados
- [ ] Refatorar `Inventario.tsx` para usar componentes compartilhados
- [ ] Mover páginas para `pages/admin/`

### Phase 5: Tipagem Strict e Acessibilidade

- [ ] Remover todos os `any` dos catch blocks
- [ ] Criar `types/api.ts` com interface `ApiError`
- [ ] Criar `utils/isApiError.ts` type guard
- [ ] Adicionar `aria-label` em inputs e botões
- [ ] Adicionar `<label>` visual aos inputs de busca
- [ ] Adicionar `role="alert"` em mensagens de erro
- [ ] Tipar retorno de `triggerSync`, `getSyncStatus`, `getSyncHistory`
- [ ] Corrigir polling do `Admin.tsx` com `AbortController`

## Future Improvements

- [ ] Testes com Vitest + React Testing Library
- [ ] Toast/Snackbar system para feedback
- [ ] PWA support (service worker, offline)
- [ ] Migrate token to httpOnly cookies (backend change)
- [ ] Skeleton loading states
- [ ] Error boundary
