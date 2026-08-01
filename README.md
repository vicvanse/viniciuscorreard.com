# Vinicius Correard · Nutricionista

Landing page em Next.js para **Vinicius Correard**, nutricionista (CRN-10/14710P), com foco em nutrição esportiva e atendimento clínico amplo.

Identidade visual monocromática escura: fundo preto com os cinzas da landing do Vekon (`#0a0a0a` / `#141414`) e a marca circular animada , anéis orbitais em rotação contínua com wordmark pontilhado.

## Desenvolvimento

```bash
npm install
npm run dev
```

Abra [http://localhost:3000](http://localhost:3000).

## Configuração

No `.env.local` (não versionado):

```bash
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NEXT_PUBLIC_WHATSAPP_URL=https://wa.me/5512997776689
ADMIN_PASSWORD=sua-senha-forte
ADMIN_SESSION_SECRET=segredo-longo-aleatorio
```

## Estrutura

| Caminho | Papel |
| --- | --- |
| `app/page.tsx` | Home: hero, situações, sobre, atendimento, FAQ, CTA, rodapé |
| `app/globals.css` | Tokens da paleta escura, `.atmosphere` e a animação da marca circular |
| `components/landing/circle-mark.tsx` | Marca circular animada (anéis + wordmark pontilhado) |
| `lib/site-content.ts` | Tipos, textos padrão e sanitização do conteúdo |
| `app/admin` | Painel de edição protegido por senha |

## Administração

No rodapé, o botão circular discreto leva para `/admin`.

1. Defina no `.env.local`:
   ```bash
   ADMIN_PASSWORD=sua-senha-forte
   ADMIN_SESSION_SECRET=segredo-longo-aleatorio
   ```
2. Entre com a senha.
3. Edite textos, dados de contato, layout do hero e envie a **foto** do quadro Sobre mim.
4. Textos vão para `data/editable-content.json`; fotos para `public/brand/uploads/`.

Enquanto nenhuma foto for enviada, o quadro Sobre mim exibe a marca circular animada no lugar do retrato.

A sessão usa cookie `httpOnly` (8h), com limite de tentativas de login. Em hospedagem serverless (Vercel), configure um **Blob Store** (`Storage → Create → Blob → Connect to Project`) para que as alterações do admin persistam entre deploys.
