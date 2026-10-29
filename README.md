# Sálvia — gestão para clínicas e salões

Protótipo SaaS (projeto acadêmico: redução do consumo de papel na Clínica Pallie Concept).
Site estático: HTML, CSS e JavaScript puros. Não precisa de build, banco de dados nem servidor próprio.

## Estrutura
```
index.html          → site de apresentação (landing page)
app.html            → sistema (login, painel e todos os módulos)
assets/salvia.css   → identidade visual
assets/app.js       → lógica do sistema
assets/data.js      → catálogo base e dados de demonstração (fictícios)
assets/favicon.svg
.htaccess           → usado só na Hostinger (força HTTPS)
.nojekyll           → usado só no GitHub Pages
```

## Links úteis (depois do deploy)
- Site: `https://SEU-DOMINIO/`
- Sistema: `https://SEU-DOMINIO/app.html`
- Agendamento online do cliente: `https://SEU-DOMINIO/app.html#/agendar/u1`

## Deploy no GitHub Pages (grátis)
1. Crie um repositório público (ex.: `salvia`).
2. **Add file → Upload files**: arraste o **conteúdo** desta pasta (não a pasta em si) e faça o commit.
   - Arquivos que começam com ponto (`.nojekyll`, `.htaccess`) podem ficar ocultos no seu computador; não são obrigatórios no GitHub.
3. **Settings → Pages → Deploy from a branch → `main` / `(root)` → Save**.
4. Em 1–2 minutos: `https://SEU-USUARIO.github.io/salvia/`.

## Deploy na Hostinger
1. hPanel → **Sites → Gerenciar → Gerenciador de arquivos** → abra `public_html`.
2. Envie o `.zip`, clique com o botão direito → **Extrair**, e mova o conteúdo para dentro de `public_html` (o `index.html` precisa ficar direto em `public_html`).
3. Ative o SSL gratuito em **Segurança → SSL**. O `.htaccess` redireciona para HTTPS.

## Módulos
Agenda (dia/semana, por profissional, conflitos) · Agendamento online público · Clientes e prontuário (evoluções, fotos antes/depois, histórico) · Anamnese digital personalizável com assinatura · Termos e contratos com assinatura na tela ou por link, hash SHA-256 e PDF · Serviços, pacotes e insumos · Estoque com baixa automática · Financeiro (lançamentos, fluxo de caixa, comissões) · Marketing (confirmações, aniversariantes, inativos, campanhas por WhatsApp) · Relatórios com indicador de papel evitado · Equipe, usuários e perfis de acesso · Multiunidade com painel da rede · Configurações e backup.

## Limitações desta versão (importante)
- **Os dados ficam no navegador** (localStorage) de cada dispositivo. Outro computador ou celular começa com os dados de exemplo.
- Por isso, o **link de assinatura** e o **agendamento online** só registram no mesmo navegador. Para funcionar entre aparelhos, é preciso um backend.
- Login sem senha real; os perfis de acesso controlam só o que aparece na tela.
- Assinatura na tela = assinatura eletrônica simples (Lei 14.063/2020). Modelos de termo são ilustrativos: revisar com assessoria jurídica.
- WhatsApp: abre a conversa com a mensagem pronta; disparo automático exige a API oficial do WhatsApp Business.
- Todos os clientes, valores e preços dos planos são fictícios/de referência.

## Próximo passo para produção
Ligar a um backend (ex.: Supabase/Firebase, ou PHP + MySQL na própria Hostinger) com autenticação, banco por organização/unidade (multi-tenant), armazenamento de fotos, backups automáticos e trilha de auditoria (LGPD).
