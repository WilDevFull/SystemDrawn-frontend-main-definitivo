# SystemDrawn Frontend

Site do projeto **SystemDrawn**, desenvolvido em **React + Vite + TypeScript**, responsável pela interface web e pela integração com a API Backend para gerenciamento de agendamentos de **tatuagem** e **piercing**.

> O projeto começou como aplicativo mobile (React Native + Expo) e foi migrado para web. O app nativo e a configuração do Expo foram removidos.

## Integrantes da Equipe

| Nome | RA |
|------|----|
| Alyson Rafael Reis Arruda de Lima | 00000853753 | **
| Helleson Allan Borges de Sant'Ana | 00000855659 | **
| João Victor Oliveira da Silva | 00000855670 |
| Matheus Soares de Lima | 00000855273 |
| Saíra Aguiar Rocha | 00000851069 |
| Thiago Carvalho de Castro | 00000014830 |
| Wilson Pereira de Lima | 00000855225 | **

> **Observação:** Alyson, Helleson e Wilson não partipam da disciplina de AOS, mas contribuiram com o projeto.

---

# Tecnologias Utilizadas

- React 19
- Vite
- TypeScript
- React Router
- Zustand (estado global e sessão)
- Axios
- Lucide React (ícones)
- React Native Web (renderiza as telas de agendamento, perfil e notificações no navegador)

---

# Áreas do Site

| Área | Rotas | Acesso |
|------|-------|--------|
| Pública | `/` | Livre |
| Autenticação | `/login`, `/cadastro`, `/admin-login` | Livre (usuário já logado é redirecionado) |
| Cliente | `/home`, `/piercings`, `/historico`, `/joias`, `/artes`, `/meus-agendamentos`, `/notificacoes`, `/perfil`, `/configuracoes`, `/agendamento-piercing/*`, `/agendamento-tatuagem/*` | Requer login |
| Administrador | `/admin`, `/admin/agenda` | Requer login de administrador |

O login de administrador fica no menu **Login** do cabeçalho ("Sou cliente" / "Sou administrador").

---

# Funcionalidades Implementadas

## Autenticação

- Cadastro de usuário
- Login com CPF
- Persistência da sessão (`localStorage`)
- Logout

## Agendamento de Tatuagem

- Escolha do local, tamanho, estilo, data e horário
- Resumo do agendamento

> A API de tatuagem ainda não existe: o resumo não grava o agendamento no backend.

## Agendamento de Piercing

- Escolha do tipo de piercing, joia, data e horário
- Confirmação do agendamento via API

## Meus Agendamentos

- Listagem dos agendamentos
- Reagendamento
- Cancelamento (com confirmação)

## Notificações

- Listagem, marcar como lida (uma ou todas), remover e contador

## Perfil

- Visualização dos dados do usuário e configurações da conta

## Administrador

- Painel de aprovações e agenda do dia

> As telas de administrador usam dados fixos e o login de administrador ainda não é validado pelo backend.

---

# Estrutura do Projeto

```text
SYSTEMDRAWN-FRONTEND
├── src
│   ├── assets            # imagens e fontes
│   ├── components        # componentes compartilhados (header, rodapé, ícones, calendário)
│   ├── layouts           # PublicLayout, AuthLayout, UserLayout, AdminLayout
│   ├── lib               # navegação e alertas do navegador
│   ├── pages
│   │   ├── public        # home
│   │   ├── auth          # login, cadastro, splash
│   │   ├── user          # telas do cliente e fluxos de agendamento
│   │   └── admin         # login, aprovações e agenda
│   ├── routes            # rotas, guards de acesso e carregamento lazy das telas
│   ├── services          # chamadas à API (axios)
│   ├── store             # stores Zustand
│   ├── styles            # CSS global
│   ├── utils             # utilitários (datas civis)
│   ├── App.tsx
│   └── main.tsx
├── index.html
├── vite.config.ts
├── tsconfig.json
├── package.json
├── sonar-project.properties
├── LICENSE
└── README.md
```

---

# Execução Local

## Pré-requisitos

- Node.js 20.19 ou superior (exigência do Vite 7)
- npm

## Instalar dependências

```bash
npm install
```

## Configurar a URL da API

No arquivo:

```text
src/services/api.ts
```

Altere o `baseURL` para o endereço do backend. Exemplo para backend local:

```ts
baseURL: 'http://localhost:3000'
```

## Comandos

| Comando | Descrição |
|---------|-----------|
| `npm run web` (ou `npm run dev`) | Inicia o servidor de desenvolvimento em `http://localhost:5173` |
| `npm run typecheck` | Verifica os tipos com o TypeScript |
| `npm run build` (ou `npm run build:web`) | Verifica os tipos e gera a versão de produção em `dist/` |
| `npm run preview` (ou `npm run preview:web`) | Serve a build de `dist/` para conferência (rode `npm run build` antes) |

O servidor de desenvolvimento escuta em `0.0.0.0`, então também pode ser acessado por outros dispositivos da mesma rede ou pela porta encaminhada do Codespaces.

## Publicação

A pasta `dist/`, gerada por `npm run build`, contém arquivos estáticos que podem ser publicados em qualquer hospedagem. Como o site usa rotas no navegador (React Router), configure a hospedagem para devolver o `index.html` em qualquer rota.

---

# Observações Técnicas

- Datas de agendamento são tratadas como datas civis (`YYYY-MM-DD`) em `src/utils/civilDate.ts`, sem conversão de fuso horário.
- A sessão (usuário, token e perfil) é guardada no `localStorage` na chave `systemdrawn-auth`. Respostas `401` da API encerram a sessão.
- A proteção das rotas de administrador existe apenas na interface; o backend precisa validar o perfil.
- As telas de agendamento ainda usam componentes do React Native Web. A conversão para HTML/CSS puro é uma etapa futura.
- A anamnese ainda não existe.

---

# Status do Projeto

🚧 Em desenvolvimento.

---

# Licença

ISC
