# Testing Session — Central de Manutenção 4.0

Complete E2E checklist covering every feature, role, API interaction, and UX state.  
Mark each item `[x]` as you test. Note any bug or improvement inline with `> ⚠️`.

---

## Setup

### Prerequisites
- [ ] Backend running (`dotnet run` or equivalent)
- [ ] Mobile running (`npx expo start` inside `mobile/`)
- [ ] Two test accounts available:
  - **Admin** — can log in with admin credentials
  - **Technician** — can log in with technician credentials
- [ ] At least one service order in `InProgress` status assigned to the Technician (required for tool withdrawal)

> ⚠️ Some sections (1.4, 1.5, 1A) require running against a **fresh database** to exercise first-time flows. To reset: `docker compose down -v && docker compose up --build` — EF Core re-creates the schema empty (no pre-seeded admin user).

### Test credentials
| Role | Email | Password |
|---|---|---|
| Admin (self-registered) | _(fill in after running section 1.4)_ | _(fill in)_ |
| Technician (invited, password set) | _(fill in after running section 1.5)_ | _(fill in)_ |
| Technician (invited, password NOT yet set) | _(fill in for testing 1.5)_ | _(none — must use first-access flow)_ |

---

## 1. Authentication

### 1.1 Login — Two-Step (Email → Password)
**Step 1 — Email**
- [ ] Open app cold — redirected to login screen with only the e-mail field visible (no password field)
- [ ] Title reads "Entre com seu e-mail para continuar"
- [ ] Submit button label is "Continuar" (NOT "Entrar")
- [ ] Submit with empty email → inline error "Informe o e-mail."
- [ ] Submit with an existing **Admin** email → form transitions to step 2 (password revealed, "Trocar e-mail" link appears)
- [ ] Submit with an existing **Technician** email (password already set) → form transitions to step 2
- [ ] Submit with an unknown email when admins exist → inline error "E-mail não encontrado. Verifique com o administrador."

**Step 2 — Password**
- [ ] Subtitle reads "Olá! Informe a senha de {email}"
- [ ] "Trocar e-mail" link at top — tapping returns to step 1, clears password and error
- [ ] Password field autofocuses
- [ ] Submit with empty password → inline error "Informe a senha."
- [ ] Submit with wrong password → API error message shown ("Usuário ou senha incorretos.")
- [ ] Submit with correct credentials as **Admin** → lands on Dashboard (or onboarding — see Section 1A)
- [ ] Submit with correct credentials as **Technician** → lands on Dashboard
- [ ] Password show/hide eye icon works

### 1.2 Session Persistence
- [ ] Login as Admin → close app entirely → reopen → already logged in (no login screen)
- [ ] Token auto-refresh: leave app idle, reopen → still authenticated

### 1.3 Logout
- [ ] Profile tab → tap "Sair da Conta" → user is logged out immediately and redirected to login (no confirmation dialog — this was removed)
- [ ] After logout, go back (hardware back) → cannot access protected routes
- [ ] After logout, the "Onboarding dismissed" flag is cleared (verifiable by repeating section 1A with the same admin on the same device)

### 1.4 First Admin Self-Register (fresh DB only)
> Requires: empty Users table (or no `Admin` role users in DB). See Setup note.

- [ ] Open app cold → login screen
- [ ] On mount, the login screen shows the link "**Primeira configuração? Criar conta de administrador**" below the "Continuar" button
- [ ] Enter any new email (e.g. `admin@example.com`) → tap "Continuar"
- [ ] App navigates to `/(auth)/register` with the email pre-filled
- [ ] Register screen header: "Configuração inicial"
- [ ] Info banner: "Este passo só está disponível quando ainda não existe nenhum administrador cadastrado."
- [ ] "Voltar" button returns to login screen
- [ ] Submit with empty name → "Informe seu nome."
- [ ] Submit with invalid email (no `@`) → "Informe um e-mail válido."
- [ ] Submit with password < 6 chars → "A senha deve ter no mínimo 6 caracteres."
- [ ] Submit with mismatched confirm → "As senhas não coincidem."
- [ ] Submit with all valid fields → admin is created, app auto-logs in, and routes to **Admin Onboarding Wizard step 1** (see Section 1A)
- [ ] After the first admin exists, attempting to register again (e.g., via direct route navigation to `/(auth)/register`) and submitting → API returns "Já existe um administrador cadastrado. Use o login normal." and shows it as an inline error
- [ ] After the first admin exists, the "Primeira configuração?" link **disappears** from the login screen

### 1.5 Technician First-Access (Set Password)
> Requires: a technician created by an admin (via section 6.4) who has not yet set a password.

- [ ] As Admin, create a technician (e.g., `tech-new@example.com`) — no password field on the form (covered in 6.4)
- [ ] Log out
- [ ] On login screen, enter the technician's email → tap "Continuar"
- [ ] App navigates to `/(auth)/set-password?email=tech-new@example.com`
- [ ] Header: "Bem-vindo!", subtitle includes the email
- [ ] "Voltar" button returns to login
- [ ] Submit with password < 6 chars → "A senha deve ter no mínimo 6 caracteres."
- [ ] Submit with mismatched confirm → "As senhas não coincidem."
- [ ] Submit valid password → user is auto-logged in, lands on technician Dashboard
- [ ] Repeat: log out, enter the same technician email → app routes to **step 2 (password)** directly, NOT to set-password (because `MustSetPassword` is now `false`)

### 1.6 Email-First Edge Cases
- [ ] Submit step-1 with email that has trailing whitespace or uppercase characters → server normalises (lowercased + trimmed); flow proceeds correctly
- [ ] Kill backend → enter email → tap "Continuar" → "Erro de conexão. Tente novamente." (or similar)
- [ ] On a fresh DB: enter any email → routed to register (not to "user not found" error), because `anyAdminExists` is `false`

---

## 1A. Admin Onboarding Wizard

Triggers automatically when an Admin is authenticated and `GET /api/Onboarding/status` returns `complete: false` (i.e. at least one of tools, stock items, or technicians is empty) AND the `@onboarding_dismissed` local flag is not set.

### 1A.1 Gate (entry behaviour)
- [ ] Fresh DB + brand-new admin (via 1.4) → after register, app routes directly to `/(app)/onboarding/admin/add-tool`, NOT to `/(app)/(tabs)`
- [ ] If only tools exist (no stock, no technicians) → gate routes to **add-stock** (skips add-tool)
- [ ] If only tools + stock exist (no technicians) → gate routes to **invite-technician**
- [ ] If all three exist → no redirect; admin lands on Dashboard normally
- [ ] As a **Technician** (any state), no onboarding gate fires — Tabs render immediately
- [ ] Gate shows a centered spinner while `GET /api/Onboarding/status` is loading

### 1A.2 Step 1 — Cadastre sua primeira ferramenta
- [ ] Step label "PASSO 1 DE 3"
- [ ] Title "Cadastre sua primeira ferramenta"
- [ ] Subtitle explains what tools are
- [ ] Fields: Código, Nome, Quantidade total (same validation as `/tools/create`)
- [ ] Submit empty → field-level errors on all 3
- [ ] Submit quantity 0 → "Deve ser um número inteiro positivo."
- [ ] "Cadastrar e continuar" with valid data → tool is created (verifiable in DB / Tools tab later) → navigates to `add-stock`
- [ ] "Pular esta etapa" (ghost button) → navigates to `add-stock` WITHOUT creating a tool
- [ ] API error (e.g. duplicate code) surfaces in red error box below the form

### 1A.3 Step 2 — Cadastre seu primeiro item de estoque
- [ ] Step label "PASSO 2 DE 3"
- [ ] Title "Cadastre seu primeiro item de estoque"
- [ ] Fields: Código, Nome, Quantidade inicial, Quantidade mínima (same validation as `/stock/create`)
- [ ] Submit empty → 4 field errors
- [ ] Submit valid → item created → navigates to `invite-technician`
- [ ] "Pular esta etapa" → skips to `invite-technician`

### 1A.4 Step 3 — Convide seu primeiro técnico
- [ ] Step label "PASSO 3 DE 3"
- [ ] Title "Convide seu primeiro técnico"
- [ ] Subtitle clarifies the tech will set their own password
- [ ] Fields: Nome, E-mail, Especialidade chips — **NO password field**
- [ ] Submit empty → field errors on Nome and E-mail
- [ ] Submit invalid email → "E-mail inválido."
- [ ] "Convidar e finalizar" with valid data → user created → navigates to `completed`
- [ ] The created tech has `MustSetPassword = true` in DB (verify by attempting normal login → "Usuário deve definir uma senha…")
- [ ] "Pular esta etapa" → skips to `completed`

### 1A.5 Step 4 — Tudo pronto! (Celebration)
- [ ] Large green/orange check icon
- [ ] Title "Tudo pronto!"
- [ ] Sets `@onboarding_dismissed = 'true'` in AsyncStorage on mount
- [ ] Auto-redirects to `/(app)/(tabs)` after ~2.5 seconds
- [ ] "Ir para o painel" button immediately redirects
- [ ] After landing on tabs, opening the app again does NOT route back into the wizard (the dismissed flag holds)

### 1A.6 Skip-Through Loop (re-trap prevention)
- [ ] Fresh DB, register admin, skip ALL three steps → land on completed → tabs
- [ ] Close and reopen app (still authenticated) → no wizard, lands on tabs (because `@onboarding_dismissed` is set)
- [ ] Log out → `@onboarding_dismissed` is cleared
- [ ] Log back in as the same admin → wizard fires again (because status is still incomplete and the flag was cleared). This is the documented behaviour — see plan file Verification §6.

### 1A.7 Completion Path (non-skip)
- [ ] Fresh DB, register admin, fill EACH step → status reaches `complete: true`
- [ ] Subsequent logins skip onboarding entirely (status.complete = true short-circuits the gate)

---

## 2. Dashboard

### 2.1 As Admin
- [ ] Greeting shows correct first name
- [ ] **Críticas** card count matches orders with `priority=Critical` and active status
- [ ] **Abertas** card count matches `Open + Reopened` orders
- [ ] **Andamento** card count matches `InProgress` orders
- [ ] **Concluídas** card count matches `Completed + Approved` orders
- [ ] **Ferram. em uso** card is visible (Admin-only stat)
- [ ] **Itens em baixa** card is visible (Admin-only stat)
- [ ] **Minhas ferram.** card is NOT visible for Admin
- [ ] Quick action "Nova Ordem" button is visible → tapping navigates to Create Order
- [ ] Quick action "Novo Usuário" button is visible → tapping navigates to Create User
- [ ] Recent orders list shows up to 5 orders
- [ ] Tapping a recent order → navigates to Order Detail
- [ ] "Ver todas" link → switches to Orders tab

### 2.2 As Technician
- [ ] **Ferram. em uso** card is NOT visible
- [ ] **Itens em baixa** card is NOT visible
- [ ] **Minhas ferram.** card is visible and count is correct
- [ ] Quick action buttons ("Nova Ordem", "Novo Usuário") are NOT visible
- [ ] Recent orders list and navigation work the same

---

## 3. Orders

### 3.1 Orders List (both roles)
- [ ] Tab shows correct total count in header badge
- [ ] All filter chips are visible: Todas, Aberta, Atribuída, Em Andamento, Pausada, Concluída, Aprovada, Rejeitada, Reaberta, Cancelada
- [ ] Default filter is "Todas"
- [ ] Selecting a filter refetches and shows only matching orders
- [ ] Active filter chip is highlighted (blue bg, white text)
- [ ] Tapping "Todas" again shows all orders
- [ ] Orders show technician name (not ID) or "Não atribuído"
- [ ] Tapping an order → navigates to Order Detail
- [ ] Empty state: filter with no matching orders → icon + "Nenhuma ordem encontrada"
- [ ] Loading state: spinner visible briefly on filter change
- [ ] Error state: simulate API down → red banner + "Tentar novamente" → tap retries

### 3.2 Admin-only in Orders List
- [ ] "+" add button is visible in header
- [ ] Tapping "+" navigates to Create Order
- [ ] As Technician: "+" button is NOT visible

### 3.3 Create Order (Admin only)
- [ ] As Technician: navigating to create order → "Acesso Restrito" screen, back button works
- [ ] As Admin: all 5 fields visible (Título, Descrição, Local, Prazo, Prioridade)
- [ ] Priority chips: Low / Medium / High / Critical, Medium is pre-selected
- [ ] Tapping a priority chip selects it visually
- [ ] Submit with empty title → field-level error "Título é obrigatório."
- [ ] Submit with empty description → field-level error "Descrição é obrigatória."
- [ ] Submit with only required fields (no location, no date) → succeeds
- [ ] Submit with all fields filled → loading state on button → success alert → goes back to list
- [ ] New order appears in list after creation (focus refresh)
- [ ] Date field: enter "15/06/2025" → accepted; verify order is stored with `2025-06-15`
- [ ] API error → red error box appears below form

### 3.4 Order Detail (both roles)
- [ ] Priority badge and status badge visible at top
- [ ] Title, description, location displayed correctly
- [ ] Metadata card shows: created date, due date, technician name, created by, assigned by (if set)
- [ ] "Local não informado" shown when location is empty
- [ ] Completion notes card visible only when `completionNotes` is set
- [ ] Status history section shows "Nenhuma alteração registrada" (no endpoint yet — expected)

### 3.5 Cancel Order (Admin only)
- [ ] "Cancelar Ordem" button visible only for Admin
- [ ] Button NOT visible when order is already `Canceled` or `Approved`
- [ ] Tap "Cancelar Ordem" → confirmation alert
- [ ] Tap "Não" → alert dismisses, order unchanged
- [ ] Tap "Sim, cancelar" → loading state → order status changes to Canceled → alert "Cancelado"
- [ ] After cancel, "Cancelar Ordem" button disappears
- [ ] As Technician: cancel button is never visible

### 3.6 Edit Order (Admin only)
- [ ] "Editar Ordem" button visible only for Admin
- [ ] Tapping it shows "Em breve" alert (expected — not yet implemented)

---

## 4. Tools

### 4.1 Tools List (Technician only tab)
- [ ] Tab NOT visible to Admin in bottom navigation
- [ ] As Technician: tab visible, list loads from API
- [ ] Filter chips: Todas, Disponíveis, Em uso, Esgotadas
- [ ] "Todas" shows all tools
- [ ] "Disponíveis" shows tools where `availableQuantity === totalQuantity`
- [ ] "Em uso" shows tools partially in use
- [ ] "Esgotadas" shows tools where `availableQuantity === 0`
- [ ] "Minhas" chip shows tools currently withdrawn by current technician
- [ ] Loading spinner during fetch
- [ ] Error state + retry works
- [ ] Empty state shown when filter matches nothing
- [ ] Tapping a tool → navigates to Tool Detail
- [ ] Focus return from detail/withdraw → list refreshes

### 4.2 Tool Detail (both roles — via deep link or list)
- [ ] Tool code, name, icon displayed in header
- [ ] Availability bar fills proportionally (green = full, yellow = partial, red = zero)
- [ ] Metadata card: code, total quantity, available quantity, registered date
- [ ] Active usages list shows all current withdrawals (technician name, order ID, withdrawal time)
- [ ] "Você" badge shows on usage row belonging to current user
- [ ] No active usages → "Nenhum uso ativo no momento."

### 4.3 Tool Withdrawal (Technician only)
- [ ] As Admin: "Retirar ferramenta" button is NOT visible
- [ ] As Technician with no in-progress order: button shows "Sem ordem em andamento", disabled + hint text
- [ ] As Technician with in-progress order + tool available: button enabled "Retirar ferramenta"
- [ ] Tap button → navigates to Withdraw screen
- [ ] Withdraw screen: tool card shows correct info
- [ ] Withdraw screen: in-progress orders listed, first pre-selected
- [ ] Select different order → selection updates
- [ ] Confirm withdrawal → loading → success alert → back to Tool Detail
- [ ] Available quantity decreases by 1 after withdrawal (refresh confirms)
- [ ] New active usage appears in the usages list
- [ ] Tool completely depleted: button shows "Indisponível", disabled

### 4.4 Tool Return (Technician only)
- [ ] "Devolver" button visible only on rows where `isMine = true`
- [ ] Other technician's rows: no Devolver button
- [ ] Tap "Devolver" → confirmation alert with tool name
- [ ] Tap "Cancelar" → nothing changes
- [ ] Tap "Devolver" in alert → loading → success alert → usage row disappears → quantity restored
- [ ] After return, tool's available quantity increases by 1

### 4.5 Create Tool (Admin only)
- [ ] As Technician: navigating to create tool → "Acesso Restrito"
- [ ] All 3 fields visible: Código, Nome, Quantidade total
- [ ] Code field auto-capitalizes
- [ ] Submit empty form → errors on all required fields
- [ ] Quantity "0" → error "Deve ser um número inteiro positivo."
- [ ] Quantity negative → error
- [ ] Valid form → loading → success alert → back → new tool appears in inventory
- [ ] API error → red box with message

### 4.6 Edit Tool (Admin only)
- [ ] "Editar Ferramenta" button visible for Admin in Tool Detail
- [ ] Tap → "Em breve" alert (expected)

---

## 5. Stock

### 5.1 Inventory Screen — Stock Segment (Admin only tab)
- [ ] Tab NOT visible to Technician
- [ ] As Admin: switch to "Estoque" segment
- [ ] "Todos" filter shows all items
- [ ] "Em baixa" filter shows only items where `isLow = true`
- [ ] Items with low stock show red icon + "Em baixa" badge in card
- [ ] Loading spinner during fetch
- [ ] Error state + retry works
- [ ] Tapping item → navigates to Stock Detail

### 5.2 Stock Detail (Admin only)
- [ ] As Technician navigating directly → "Acesso Restrito" screen
- [ ] Item code and name in header
- [ ] Low stock: header icon turns red, "Estoque abaixo do mínimo" alert shown
- [ ] Quantity card: current quantity (red if low) and minimum quantity
- [ ] Metadata card: code, name, registered date
- [ ] "Reabastecer" button → navigates to Replenish screen
- [ ] "Ver movimentações" button → navigates to Movements screen
- [ ] "Editar item" → "Em breve" alert
- [ ] Loading state on initial load
- [ ] Not found state for invalid ID

### 5.3 Create Stock Item (Admin only)
- [ ] As Technician → "Acesso Restrito"
- [ ] All 4 fields: Código, Nome, Quantidade inicial, Quantidade mínima
- [ ] Submit empty → all field errors
- [ ] Negative quantity → error
- [ ] Valid form → loading → success alert → back → item appears in inventory
- [ ] API error → alert with message

### 5.4 Replenish Stock (Admin only)
- [ ] As Technician → "Acesso Restrito"
- [ ] Item summary card shows code, name, current qty, minimum qty
- [ ] Loading state while item loads
- [ ] Quantity field required
- [ ] Quantity ≤ 0 → error "Deve ser um inteiro positivo."
- [ ] Observation field optional (note)
- [ ] Valid form → loading → success alert showing new total quantity → back
- [ ] Stock Detail quantity updates after replenish (focus refresh)
- [ ] API error → alert with message

### 5.5 Stock Movements (Admin only)
- [ ] As Technician → "Acesso Restrito"
- [ ] Loading state while data loads
- [ ] Header shows item code, name, and movement count
- [ ] Each movement row: type icon (green arrow down = In, red arrow up = Out), type label, quantity with +/− sign, date/time, note (if any), order ID (if any)
- [ ] Empty state: history icon + "Nenhuma movimentação registrada"
- [ ] Replenishing stock creates a new "In" movement (verify by replenishing then checking movements)

---

## 6. Users

### 6.1 Users List (Admin only tab)
- [ ] Tab NOT visible to Technician
- [ ] As Admin: list loads from API
- [ ] Active count badge in header is accurate
- [ ] Filter chips: Todos, Administradores, Técnicos, Ativos, Inativos
- [ ] Filters work correctly (API or client-side)
- [ ] Each user card shows: avatar initials, name, email, role badge, specialty badge (if not General), "Inativo" badge (if inactive)
- [ ] Disabled card (non-admin viewing non-self) appears with reduced opacity
- [ ] Loading state during fetch
- [ ] Error state + retry
- [ ] Tapping own card → navigates to User Detail
- [ ] Tapping any user as Admin → navigates to User Detail

### 6.2 User Detail
- [ ] As Technician navigating to another user's profile → "Acesso negado"
- [ ] As Technician viewing own profile → full profile visible
- [ ] Loading state while user loads
- [ ] Not found state for invalid ID
- [ ] Avatar with initials, name, role badge, specialty badge (if applicable)
- [ ] Active/Inactive status dot and text
- [ ] Info card: email, ID (ellipsized in middle)
- [ ] Assigned orders section visible only for Technician users with orders
- [ ] No "Criado em" row (field not in API type — expected)

### 6.3 Toggle Active (Admin only)
- [ ] "Desativar Usuário" button visible for Admin
- [ ] Tap → confirmation alert with user name
- [ ] Tap "Cancelar" → nothing changes
- [ ] Tap "Confirmar" → loading state on button → success alert → user status updates
- [ ] After deactivation: status dot turns grey, "Inativo" text, button label changes to "Ativar Usuário"
- [ ] Ativate again → status dot turns green, "Ativo" text
- [ ] Deactivated user still visible in Users list with "Inativo" badge
- [ ] "Inativos" filter in list shows deactivated user

### 6.4 Create User (Admin only) — Invite-only flow
- [ ] As Technician → "Acesso Restrito"
- [ ] Role info chip shows "Função: Técnico" (new users always created as Technician)
- [ ] Fields: Nome Completo, E-mail, Especialidade chips — **NO password field**
- [ ] Below the e-mail field, an invite banner reads: "O técnico receberá um convite e definirá a senha no primeiro acesso."
- [ ] Specialty chips: Eletricista, Mecânico, Eletromecânico, Geral — one selectable at a time
- [ ] Submit with empty name → error "Nome é obrigatório."
- [ ] Submit with empty email → error "E-mail é obrigatório."
- [ ] Submit with invalid email (no @) → error "E-mail inválido."
- [ ] Valid form → loading → success alert "Convite enviado" / "O técnico definirá a senha no primeiro acesso usando este e-mail." → back
- [ ] New user appears in Users list with `Inativo`-ish state? — In DB the user has `Active = true` and `MustSetPassword = true`. (The Users list currently doesn't surface MustSetPassword; this is fine.)
- [ ] New user CANNOT log in via the legacy email+password path (server returns "Usuário deve definir uma senha…")
- [ ] New user CAN complete first-access via section 1.5 → afterwards logs in normally
- [ ] API error (e.g. duplicate email) → alert with message "Já existe um usuário com este email."

### 6.5 Edit User (Admin only)
- [ ] "Editar Usuário" button visible for Admin
- [ ] Tap → "Em breve" alert (expected)

---

## 7. Profile

- [ ] Avatar shows correct initials
- [ ] Name, role badge, specialty badge (if applicable) displayed
- [ ] Email, ID, role shown in info card
- [ ] "Ordens criadas" count is accurate
- [ ] "Atribuídas a mim" count is accurate
- [ ] Logout flow covered in section 1.3

---

## 8. Role-Based Access — Deep Link / Direct Navigation

Test that role gates work even when navigating directly, not via the UI.

- [ ] Technician navigates to `/stock/create` → "Acesso Restrito"
- [ ] Technician navigates to `/stock/[id]` → "Acesso Restrito"
- [ ] Technician navigates to `/stock/replenish?id=X` → "Acesso Restrito"
- [ ] Technician navigates to `/stock/movements?id=X` → "Acesso Restrito"
- [ ] Technician navigates to `/orders/create` → "Acesso Restrito"
- [ ] Technician navigates to `/tools/create` → "Acesso Restrito"
- [ ] Technician navigates to `/users/create` → "Acesso Restrito"
- [ ] Admin navigates to `/tools/withdraw` → "Acesso Restrito" (Technician-only)
- [ ] Unauthenticated user navigates to any protected route → redirected to Login

---

## 9. Cross-Domain Interactions

These test flows that span multiple features.

### 9.1 Full Order → Tool → Stock cycle
- [ ] Admin creates a new order (title: "Teste E2E", priority: High)
- [ ] Admin assigns order to Technician (if assignment endpoint exists) or verify it appears as "InProgress"
- [ ] Technician withdraws a tool on that order
- [ ] Tool's available quantity decreases
- [ ] Dashboard "Ferram. em uso" count increases (Admin)
- [ ] Dashboard "Minhas ferram." count increases (Technician)
- [ ] Technician returns the tool
- [ ] Quantity restored, usage disappears from Tool Detail
- [ ] Admin replenishes a low-stock item
- [ ] Dashboard "Itens em baixa" count decreases if item was the only low one

### 9.2 User lifecycle (with first-access)
- [ ] Admin creates a new Technician user (no password field — see 6.4)
- [ ] New user appears in Users list
- [ ] Log out, log back in on the tech's email → routed to set-password (see 1.5)
- [ ] After tech sets password, they can log in normally on subsequent attempts
- [ ] Admin deactivates the user
- [ ] Deactivated user shows "Inativo" in list
- [ ] Admin reactivates the user
- [ ] User status restored to "Ativo"

### 9.3 Focus refresh after mutations
- [ ] Create order → go back → new order appears in list (no manual refresh)
- [ ] Replenish stock → go back to Stock Detail → quantity updated
- [ ] Withdraw tool → go back to Tool Detail → available quantity decreased, usage visible
- [ ] Return tool → Tool Detail updates immediately after alert dismissal

---

## 10. UX & Edge Cases

### 10.1 Network / API errors
- [ ] Kill backend while on Orders list → "Erro ao carregar ordens" banner appears
- [ ] Restart backend → tap "Tentar novamente" → data loads
- [ ] Submit Create Order while backend is down → error box shown, form not reset

### 10.2 Empty states
- [ ] New database with no orders → Orders list shows empty state icon + message
- [ ] Tool with no active usages → "Nenhum uso ativo no momento."
- [ ] Stock item with no movements → "Nenhuma movimentação registrada"
- [ ] Users list filter for "Inativos" with no inactive users → empty state

### 10.3 Loading states
- [ ] Every list screen shows ActivityIndicator on first load
- [ ] Every detail screen shows ActivityIndicator while fetching
- [ ] Submit buttons show loading spinner during mutation

### 10.4 Navigation
- [ ] Hardware back button / gesture works on all screens
- [ ] Back from Create → list is still there (no re-auth)
- [ ] Deep navigate: Dashboard order card → detail → back → still on Dashboard
- [ ] Tab switching preserves scroll position on list screens

### 10.5 Keyboard behavior
- [ ] Create Order: keyboard doesn't cover submit button (iOS padding behavior)
- [ ] Create Tool / Stock / User: same
- [ ] Scrolling with keyboard open works (keyboardShouldPersistTaps="handled")

---

## 11. Known Gaps (Expected — Not Bugs)

These are intentional placeholders — document if they regressed.

- [ ] Order status history: "Nenhuma alteração registrada" (no log endpoint yet)
- [ ] Edit Order: "Em breve" alert
- [ ] Edit Tool: "Em breve" alert
- [ ] Edit Stock Item: "Em breve" alert
- [ ] Edit User: "Em breve" alert
- [ ] Dashboard stats still read from mock data (not yet integrated) — counts may differ from API

---

## Bug / Improvement Log

Use this section to note findings during the session.

| # | Screen | Type | Description | Severity |
|---|---|---|---|---|
| 1 | | | | |
| 2 | | | | |
| 3 | | | | |

**Severity:** `critical` / `bug` / `ux` / `improvement`
