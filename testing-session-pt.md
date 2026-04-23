# Sessão de Testes — Central de Manutenção 4.0

Checklist E2E completo cobrindo todas as funcionalidades, perfis, interações com a API e estados de UX.  
Marque cada item com `[x]` conforme for testando. Registre bugs ou melhorias com `> ⚠️`.

---

## Configuração

### Pré-requisitos
- [ ] Backend rodando (`dotnet run` ou equivalente)
- [ ] Mobile rodando (`npx expo start` dentro de `mobile/`)
- [ ] Duas contas de teste disponíveis:
  - **Admin** — credenciais de administrador
  - **Técnico** — credenciais de técnico
- [ ] Pelo menos uma ordem de serviço com status `EmAndamento` atribuída ao Técnico (necessário para retirada de ferramentas)

### Credenciais de teste
| Perfil | E-mail | Senha |
|---|---|---|
| Admin | _(preencher)_ | _(preencher)_ |
| Técnico | _(preencher)_ | _(preencher)_ |

---

## 1. Autenticação

### 1.1 Login
- [ ] Abrir o app do zero — redirecionado para a tela de login
- [ ] Enviar com e-mail vazio → erro de validação
- [ ] Enviar com senha vazia → erro de validação
- [ ] Enviar com credenciais erradas → mensagem de erro da API exibida
- [ ] Login como **Admin** → cai no Dashboard
- [ ] Login como **Técnico** → cai no Dashboard

### 1.2 Persistência de Sessão
- [ ] Login como Admin → fechar o app completamente → reabrir → já está logado (sem tela de login)
- [ ] Renovação automática do token: deixar o app ocioso, reabrir → ainda autenticado

### 1.3 Logout
- [ ] Aba Perfil → tocar em "Sair da Conta" → alerta de confirmação aparece
- [ ] Tocar em "Cancelar" → permanece no Perfil, ainda logado
- [ ] Tocar em "Sair" → redirecionado para a tela de login
- [ ] Após logout, voltar (botão voltar) → não consegue acessar rotas protegidas

---

## 2. Dashboard

### 2.1 Como Admin
- [ ] Saudação exibe o primeiro nome correto
- [ ] Card **Críticas** corresponde às ordens com `priority=Critical` e status ativo
- [ ] Card **Abertas** corresponde às ordens `Aberta + Reaberta`
- [ ] Card **Andamento** corresponde às ordens `EmAndamento`
- [ ] Card **Concluídas** corresponde às ordens `Concluída + Aprovada`
- [ ] Card **Ferram. em uso** visível (exclusivo do Admin)
- [ ] Card **Itens em baixa** visível (exclusivo do Admin)
- [ ] Card **Minhas ferram.** NÃO visível para Admin
- [ ] Ação rápida "Nova Ordem" visível → navega para Criar Ordem
- [ ] Ação rápida "Novo Usuário" visível → navega para Criar Usuário
- [ ] Lista de ordens recentes exibe até 5 ordens
- [ ] Tocar em uma ordem recente → navega para Detalhe da Ordem
- [ ] Link "Ver todas" → vai para a aba Ordens

### 2.2 Como Técnico
- [ ] Card **Ferram. em uso** NÃO visível
- [ ] Card **Itens em baixa** NÃO visível
- [ ] Card **Minhas ferram.** visível e com contagem correta
- [ ] Botões de ação rápida ("Nova Ordem", "Novo Usuário") NÃO visíveis
- [ ] Lista de ordens recentes e navegação funcionam normalmente

---

## 3. Ordens de Serviço

### 3.1 Lista de Ordens (ambos os perfis)
- [ ] Aba exibe contagem total correta no badge do cabeçalho
- [ ] Todos os chips de filtro visíveis: Todas, Aberta, Atribuída, Em Andamento, Pausada, Concluída, Aprovada, Rejeitada, Reaberta, Cancelada
- [ ] Filtro padrão é "Todas"
- [ ] Selecionar um filtro rebusca e exibe apenas ordens correspondentes
- [ ] Chip ativo destacado (fundo azul, texto branco)
- [ ] Tocar em "Todas" novamente exibe todas as ordens
- [ ] Ordens mostram nome do técnico (não o ID) ou "Não atribuído"
- [ ] Tocar em uma ordem → navega para Detalhe da Ordem
- [ ] Estado vazio: filtro sem resultados → ícone + "Nenhuma ordem encontrada"
- [ ] Estado de carregamento: spinner brevemente visível ao trocar filtro
- [ ] Estado de erro: simular API fora → banner vermelho + "Tentar novamente" → tocar recarrega

### 3.2 Exclusivo do Admin na Lista de Ordens
- [ ] Botão "+" visível no cabeçalho
- [ ] Tocar em "+" navega para Criar Ordem
- [ ] Como Técnico: botão "+" NÃO visível

### 3.3 Criar Ordem (apenas Admin)
- [ ] Como Técnico: navegar para criar ordem → tela "Acesso Restrito", botão Voltar funciona
- [ ] Como Admin: todos os 5 campos visíveis (Título, Descrição, Local, Prazo, Prioridade)
- [ ] Chips de prioridade: Baixa / Média / Alta / Crítica, Média pré-selecionada
- [ ] Tocar em um chip de prioridade seleciona visualmente
- [ ] Enviar com título vazio → erro no campo "Título é obrigatório."
- [ ] Enviar com descrição vazia → erro no campo "Descrição é obrigatória."
- [ ] Enviar sem local e sem prazo → sucesso
- [ ] Enviar com todos os campos preenchidos → estado de carregamento → alerta de sucesso → volta para lista
- [ ] Nova ordem aparece na lista após criação (atualização ao focar)
- [ ] Campo de data: digitar "15/06/2025" → aceito; verificar que a ordem foi salva com `2025-06-15`
- [ ] Erro da API → caixa de erro vermelha aparece abaixo do formulário

### 3.4 Detalhe da Ordem (ambos os perfis)
- [ ] Badge de prioridade e badge de status visíveis no topo
- [ ] Título, descrição e local exibidos corretamente
- [ ] Card de metadados mostra: data de criação, prazo, nome do técnico, criado por, atribuído por (se definido)
- [ ] "Local não informado" exibido quando local está vazio
- [ ] Card de observações de conclusão visível apenas quando `completionNotes` está preenchido
- [ ] Seção de histórico de status exibe "Nenhuma alteração registrada" (sem endpoint ainda — esperado)

### 3.5 Cancelar Ordem (apenas Admin)
- [ ] Botão "Cancelar Ordem" visível apenas para Admin
- [ ] Botão NÃO visível quando a ordem já está `Cancelada` ou `Aprovada`
- [ ] Tocar em "Cancelar Ordem" → alerta de confirmação
- [ ] Tocar em "Não" → alerta fecha, ordem inalterada
- [ ] Tocar em "Sim, cancelar" → estado de carregamento → status muda para Cancelada → alerta "Cancelado"
- [ ] Após cancelamento, botão "Cancelar Ordem" desaparece
- [ ] Como Técnico: botão nunca visível

### 3.6 Editar Ordem (apenas Admin)
- [ ] Botão "Editar Ordem" visível apenas para Admin
- [ ] Tocar exibe alerta "Em breve" (esperado — ainda não implementado)

---

## 4. Ferramentas

### 4.1 Lista de Ferramentas (aba exclusiva do Técnico)
- [ ] Aba NÃO visível para Admin na navegação inferior
- [ ] Como Técnico: aba visível, lista carrega da API
- [ ] Chips de filtro: Todas, Disponíveis, Em uso, Esgotadas
- [ ] "Todas" exibe todas as ferramentas
- [ ] "Disponíveis" exibe ferramentas onde `disponíveis === total`
- [ ] "Em uso" exibe ferramentas parcialmente em uso
- [ ] "Esgotadas" exibe ferramentas onde `disponíveis === 0`
- [ ] Chip "Minhas" exibe ferramentas retiradas pelo técnico atual
- [ ] Spinner de carregamento durante busca
- [ ] Estado de erro + tentar novamente funciona
- [ ] Estado vazio exibido quando filtro não tem resultados
- [ ] Tocar em ferramenta → navega para Detalhe da Ferramenta
- [ ] Ao retornar do detalhe/retirada → lista atualiza

### 4.2 Detalhe da Ferramenta (ambos os perfis)
- [ ] Código, nome e ícone da ferramenta no cabeçalho
- [ ] Barra de disponibilidade preenche proporcionalmente (verde = cheio, amarelo = parcial, vermelho = zero)
- [ ] Card de metadados: código, quantidade total, disponíveis, data de cadastro
- [ ] Lista de usos ativos mostra todas as retiradas atuais (nome do técnico, ID da OS, horário de retirada)
- [ ] Badge "Você" na linha de uso do usuário atual
- [ ] Sem usos ativos → "Nenhum uso ativo no momento."

### 4.3 Retirada de Ferramenta (apenas Técnico)
- [ ] Como Admin: botão "Retirar ferramenta" NÃO visível
- [ ] Como Técnico sem ordem em andamento: botão mostra "Sem ordem em andamento", desabilitado + texto de dica
- [ ] Como Técnico com ordem em andamento e ferramenta disponível: botão habilitado "Retirar ferramenta"
- [ ] Tocar no botão → navega para tela de Retirada
- [ ] Tela de Retirada: card da ferramenta exibe informações corretas
- [ ] Tela de Retirada: ordens em andamento listadas, primeira pré-selecionada
- [ ] Selecionar outra ordem → seleção atualiza
- [ ] Confirmar retirada → carregando → alerta de sucesso → volta para Detalhe da Ferramenta
- [ ] Quantidade disponível diminui em 1 após retirada (confirmado ao atualizar)
- [ ] Novo uso ativo aparece na lista de usos
- [ ] Ferramenta completamente esgotada: botão mostra "Indisponível", desabilitado

### 4.4 Devolução de Ferramenta (apenas Técnico)
- [ ] Botão "Devolver" visível apenas nas linhas onde `souEu = true`
- [ ] Linhas de outros técnicos: sem botão Devolver
- [ ] Tocar em "Devolver" → alerta de confirmação com nome da ferramenta
- [ ] Tocar em "Cancelar" → nada muda
- [ ] Tocar em "Devolver" no alerta → carregando → alerta de sucesso → linha de uso desaparece → quantidade restaurada
- [ ] Após devolução, quantidade disponível da ferramenta aumenta em 1

### 4.5 Cadastrar Ferramenta (apenas Admin)
- [ ] Como Técnico: navegar para cadastrar ferramenta → "Acesso Restrito"
- [ ] 3 campos visíveis: Código, Nome, Quantidade total
- [ ] Campo de código converte automaticamente para maiúsculas
- [ ] Enviar formulário vazio → erros em todos os campos obrigatórios
- [ ] Quantidade "0" → erro "Deve ser um número inteiro positivo."
- [ ] Quantidade negativa → erro
- [ ] Formulário válido → carregando → alerta de sucesso → voltar → nova ferramenta aparece no inventário
- [ ] Erro da API → caixa vermelha com mensagem

### 4.6 Editar Ferramenta (apenas Admin)
- [ ] Botão "Editar Ferramenta" visível para Admin no Detalhe da Ferramenta
- [ ] Tocar → alerta "Em breve" (esperado)

---

## 5. Estoque

### 5.1 Tela de Inventário — Segmento Estoque (aba exclusiva do Admin)
- [ ] Aba NÃO visível para Técnico
- [ ] Como Admin: alternar para o segmento "Estoque"
- [ ] Filtro "Todos" exibe todos os itens
- [ ] Filtro "Em baixa" exibe apenas itens onde `isLow = true`
- [ ] Itens com estoque baixo mostram ícone vermelho + badge "Em baixa" no card
- [ ] Spinner de carregamento durante busca
- [ ] Estado de erro + tentar novamente funciona
- [ ] Tocar em item → navega para Detalhe do Item

### 5.2 Detalhe do Item de Estoque (apenas Admin)
- [ ] Como Técnico navegando diretamente → tela "Acesso Restrito"
- [ ] Código e nome do item no cabeçalho
- [ ] Estoque baixo: ícone do cabeçalho fica vermelho, alerta "Estoque abaixo do mínimo" exibido
- [ ] Card de quantidade: quantidade atual (vermelho se baixo) e quantidade mínima
- [ ] Card de metadados: código, nome, data de cadastro
- [ ] Botão "Reabastecer" → navega para tela de Reabastecimento
- [ ] Botão "Ver movimentações" → navega para tela de Movimentações
- [ ] Botão "Editar item" → alerta "Em breve"
- [ ] Estado de carregamento no carregamento inicial
- [ ] Estado não encontrado para ID inválido

### 5.3 Cadastrar Item de Estoque (apenas Admin)
- [ ] Como Técnico → "Acesso Restrito"
- [ ] 4 campos visíveis: Código, Nome, Quantidade inicial, Quantidade mínima
- [ ] Enviar vazio → erros em todos os campos
- [ ] Quantidade negativa → erro
- [ ] Formulário válido → carregando → alerta de sucesso → voltar → item aparece no inventário
- [ ] Erro da API → alerta com mensagem

### 5.4 Reabastecer Estoque (apenas Admin)
- [ ] Como Técnico → "Acesso Restrito"
- [ ] Card resumo do item mostra código, nome, qtd atual, qtd mínima
- [ ] Estado de carregamento enquanto item é buscado
- [ ] Campo de quantidade obrigatório
- [ ] Quantidade ≤ 0 → erro "Deve ser um inteiro positivo."
- [ ] Campo de observação opcional (nota)
- [ ] Formulário válido → carregando → alerta de sucesso com nova quantidade total → voltar
- [ ] Quantidade no Detalhe do Item atualiza após reabastecimento (atualização ao focar)
- [ ] Erro da API → alerta com mensagem

### 5.5 Movimentações de Estoque (apenas Admin)
- [ ] Como Técnico → "Acesso Restrito"
- [ ] Estado de carregamento enquanto dados são buscados
- [ ] Cabeçalho mostra código, nome e contagem de movimentações
- [ ] Cada linha de movimentação: ícone de tipo (seta verde para baixo = Entrada, seta vermelha para cima = Saída), rótulo do tipo, quantidade com sinal +/−, data/hora, observação (se houver), ID da OS (se houver)
- [ ] Estado vazio: ícone de histórico + "Nenhuma movimentação registrada"
- [ ] Reabastecer o estoque cria uma nova movimentação "Entrada" (verificar ao reabastecer e consultar movimentações)

---

## 6. Usuários

### 6.1 Lista de Usuários (aba exclusiva do Admin)
- [ ] Aba NÃO visível para Técnico
- [ ] Como Admin: lista carrega da API
- [ ] Badge de contagem de ativos no cabeçalho está correto
- [ ] Chips de filtro: Todos, Administradores, Técnicos, Ativos, Inativos
- [ ] Filtros funcionam corretamente
- [ ] Cada card exibe: iniciais do avatar, nome, e-mail, badge de perfil, badge de especialidade (se não for Geral), badge "Inativo" (se inativo)
- [ ] Card desabilitado (Técnico vendo perfil de outro usuário) aparece com opacidade reduzida
- [ ] Estado de carregamento durante busca
- [ ] Estado de erro + tentar novamente
- [ ] Técnico tocando no próprio card → navega para Detalhe do Usuário
- [ ] Admin tocando em qualquer usuário → navega para Detalhe do Usuário

### 6.2 Detalhe do Usuário
- [ ] Como Técnico navegando para perfil de outro usuário → "Acesso negado"
- [ ] Como Técnico visualizando o próprio perfil → perfil completo visível
- [ ] Estado de carregamento enquanto usuário é buscado
- [ ] Estado não encontrado para ID inválido
- [ ] Avatar com iniciais, nome, badge de perfil, badge de especialidade (se aplicável)
- [ ] Ponto e texto de status Ativo/Inativo
- [ ] Card de informações: e-mail, ID (truncado no meio)
- [ ] Seção de ordens atribuídas visível apenas para Técnicos com ordens
- [ ] Sem linha "Criado em" (campo não existe no tipo da API — esperado)

### 6.3 Ativar / Desativar Usuário (apenas Admin)
- [ ] Botão "Desativar Usuário" visível para Admin
- [ ] Tocar → alerta de confirmação com nome do usuário
- [ ] Tocar em "Cancelar" → nada muda
- [ ] Tocar em "Confirmar" → estado de carregamento no botão → alerta de sucesso → status atualiza
- [ ] Após desativação: ponto fica cinza, texto "Inativo", rótulo do botão muda para "Ativar Usuário"
- [ ] Ativar novamente → ponto fica verde, texto "Ativo"
- [ ] Usuário desativado ainda visível na lista com badge "Inativo"
- [ ] Filtro "Inativos" na lista exibe o usuário desativado

### 6.4 Cadastrar Usuário (apenas Admin)
- [ ] Como Técnico → "Acesso Restrito"
- [ ] Chip de perfil mostra "Função: Técnico" (novos usuários sempre criados como Técnico)
- [ ] Campos: Nome Completo, E-mail, Senha, chips de Especialidade
- [ ] Campo de senha: toggle mostrar/ocultar funciona
- [ ] Chips de especialidade: Eletricista, Mecânico, Eletromecânico, Geral — apenas um selecionável por vez
- [ ] Enviar com nome vazio → erro
- [ ] Enviar com e-mail vazio → erro
- [ ] Enviar com e-mail inválido (sem @) → erro
- [ ] Enviar com senha curta (< 6 caracteres) → erro
- [ ] Formulário válido → carregando → alerta de sucesso → voltar
- [ ] Novo usuário aparece na lista de Usuários
- [ ] Novo usuário consegue fazer login com as credenciais criadas
- [ ] Erro da API → alerta com mensagem

### 6.5 Editar Usuário (apenas Admin)
- [ ] Botão "Editar Usuário" visível para Admin
- [ ] Tocar → alerta "Em breve" (esperado)

---

## 7. Perfil

- [ ] Avatar exibe iniciais corretas
- [ ] Nome, badge de perfil, badge de especialidade (se aplicável) exibidos
- [ ] E-mail, ID, perfil exibidos no card de informações
- [ ] Contagem de "Ordens criadas" está correta
- [ ] Contagem de "Atribuídas a mim" está correta
- [ ] Fluxo de logout coberto na seção 1.3

---

## 8. Controle de Acesso por Perfil — Navegação Direta

Testar que as restrições de perfil funcionam mesmo navegando diretamente, sem usar a interface.

- [ ] Técnico navega para `/stock/create` → "Acesso Restrito"
- [ ] Técnico navega para `/stock/[id]` → "Acesso Restrito"
- [ ] Técnico navega para `/stock/replenish?id=X` → "Acesso Restrito"
- [ ] Técnico navega para `/stock/movements?id=X` → "Acesso Restrito"
- [ ] Técnico navega para `/orders/create` → "Acesso Restrito"
- [ ] Técnico navega para `/tools/create` → "Acesso Restrito"
- [ ] Técnico navega para `/users/create` → "Acesso Restrito"
- [ ] Admin navega para `/tools/withdraw` → "Acesso Restrito" (exclusivo do Técnico)
- [ ] Usuário não autenticado navega para qualquer rota protegida → redirecionado para Login

---

## 9. Interações entre Domínios

Fluxos que envolvem múltiplas funcionalidades.

### 9.1 Ciclo completo Ordem → Ferramenta → Estoque
- [ ] Admin cria uma nova ordem (título: "Teste E2E", prioridade: Alta)
- [ ] Verificar que a ordem aparece no Dashboard e na lista de ordens
- [ ] Técnico retira uma ferramenta nessa ordem
- [ ] Quantidade disponível da ferramenta diminui
- [ ] Dashboard "Ferram. em uso" aumenta (Admin)
- [ ] Dashboard "Minhas ferram." aumenta (Técnico)
- [ ] Técnico devolve a ferramenta
- [ ] Quantidade restaurada, uso desaparece do Detalhe da Ferramenta
- [ ] Admin reabastece um item com estoque baixo
- [ ] Dashboard "Itens em baixa" diminui se era o único item baixo

### 9.2 Ciclo de vida do usuário
- [ ] Admin cria um novo usuário Técnico
- [ ] Novo usuário aparece na lista de Usuários
- [ ] Admin desativa o usuário
- [ ] Usuário desativado mostra "Inativo" na lista
- [ ] Admin reativa o usuário
- [ ] Status restaurado para "Ativo"

### 9.3 Atualização ao focar após mutações
- [ ] Criar ordem → voltar → nova ordem aparece na lista (sem atualização manual)
- [ ] Reabastecer estoque → voltar para Detalhe do Item → quantidade atualizada
- [ ] Retirar ferramenta → voltar para Detalhe da Ferramenta → quantidade disponível diminuiu, uso visível
- [ ] Devolver ferramenta → Detalhe da Ferramenta atualiza imediatamente após fechar o alerta

---

## 10. UX e Casos de Borda

### 10.1 Erros de rede / API
- [ ] Derrubar o backend enquanto está na lista de Ordens → banner "Erro ao carregar ordens" aparece
- [ ] Reiniciar o backend → tocar em "Tentar novamente" → dados carregam
- [ ] Enviar Criar Ordem com backend fora → caixa de erro exibida, formulário não é resetado

### 10.2 Estados vazios
- [ ] Banco de dados novo sem ordens → lista de ordens exibe estado vazio com ícone + mensagem
- [ ] Ferramenta sem usos ativos → "Nenhum uso ativo no momento."
- [ ] Item de estoque sem movimentações → "Nenhuma movimentação registrada"
- [ ] Filtro "Inativos" na lista de usuários sem inativos → estado vazio

### 10.3 Estados de carregamento
- [ ] Todas as telas de lista exibem ActivityIndicator no primeiro carregamento
- [ ] Todas as telas de detalhe exibem ActivityIndicator durante a busca
- [ ] Botões de envio exibem spinner de carregamento durante a mutação

### 10.4 Navegação
- [ ] Botão voltar do hardware / gesto funciona em todas as telas
- [ ] Voltar de Criar → lista ainda está lá (sem re-autenticação)
- [ ] Navegar fundo: card de ordem no Dashboard → detalhe → voltar → ainda no Dashboard
- [ ] Trocar de aba preserva posição de rolagem nas telas de lista

### 10.5 Comportamento do teclado
- [ ] Criar Ordem: teclado não cobre o botão de envio (padding iOS)
- [ ] Criar Ferramenta / Estoque / Usuário: mesmo comportamento
- [ ] Rolar com teclado aberto funciona (`keyboardShouldPersistTaps="handled"`)

---

## 11. Lacunas Conhecidas (Esperadas — Não São Bugs)

Placeholders intencionais — documentar se houver regressão.

- [ ] Histórico de status da ordem: "Nenhuma alteração registrada" (sem endpoint de log ainda)
- [ ] Editar Ordem: alerta "Em breve"
- [ ] Editar Ferramenta: alerta "Em breve"
- [ ] Editar Item de Estoque: alerta "Em breve"
- [ ] Editar Usuário: alerta "Em breve"
- [ ] Estatísticas do Dashboard ainda leem dados mock (ainda não integradas) — contagens podem diferir da API

---

## Registro de Bugs e Melhorias

Use esta seção para anotar descobertas durante a sessão.

| # | Tela | Tipo | Descrição | Severidade |
|---|---|---|---|---|
| 1 | | | | |
| 2 | | | | |
| 3 | | | | |

**Severidade:** `crítico` / `bug` / `ux` / `melhoria`
