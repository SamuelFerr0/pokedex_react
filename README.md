# Pokédex — Atividade 04

## 🚧 Status do Projeto

Frontend React integrado à API Spring Boot e ao MongoDB.

## 📚 Índice

- [Links Úteis](#-links-úteis)
- [Sobre o Projeto](#-sobre-o-projeto)
- [Funcionalidades Principais](#-funcionalidades-principais)
- [Tecnologias Utilizadas](#-tecnologias-utilizadas)
- [Arquitetura](#-arquitetura)
- [Instalação e Execução](#-instalação-e-execução)
- [Estrutura de Pastas](#-estrutura-de-pastas)
- [Demonstração](#-demonstração)
- [Testes](#-testes)
- [Documentações utilizadas](#-documentações-utilizadas)
- [Autores](#-autores)
- [Licença](#-licença)

## 🔗 Links Úteis

- [Repositório da Pokédex](https://github.com/SamuelFerr0/pokedex_react)
- [Script de dados do professor](Script_Pokedex.sql)
- [Template de README do professor João Paulo Aramuni](https://github.com/joaopauloaramuni/desenvolvimento-e-integracao-de-aplicacoes-web/blob/main/TEMPLATES/template_README.md)

## 📝 Sobre o Projeto

Continuação da Pokédex React da Atividade 03, com API Spring Boot e MongoDB. A interface original foi mantida: pesquisa, filtros, ordenação, detalhes, sorteio, treinadores e tema escuro.

## ✨ Funcionalidades Principais

- Cadastro, edição e exclusão de Pokémon pela interface.
- Consulta por nome, filtro por tipo e visualização de atributos.
- Consulta a treinadores, favoritos opcionais e página Design.

## 🛠 Tecnologias Utilizadas

- Frontend: React 19, Vite 8, JavaScript, CSS e Lucide.
- Backend: Java 17, Spring Boot 4.0.2, Spring Web MVC, Validation e Spring Data MongoDB.
- Banco: MongoDB local ou MongoDB Atlas.
- Testes: JUnit Jupiter, Mockito e MockMvc.
- Favoritos: integração opcional existente com Supabase.

## 🏗 Arquitetura

O React consulta os controllers REST. Os services aplicam as regras do cadastro e os repositories acessam as coleções do MongoDB.

### Dados e modelo de documentos

`Script_Pokedex.sql` foi obtido do repositório da disciplina. Seus dados foram convertidos em documentos para as coleções `pokemons`, `types` e `trainers`:

- Pokémon guarda nome, atributos e os tipos incorporados ao documento.
- Treinador guarda nome, número de insígnias e IDs dos seus Pokémon.
- Tipos formam o catálogo usado para validar os formulários.

O arquivo [pokedex-data.json](backend/src/main/resources/data/pokedex-data.json) já contém os dados preparados para importação. Na primeira execução com a importação ativada, o Spring Boot lê esse arquivo e registra os documentos no MongoDB. As consultas da interface passam pela API REST.

Com `SEED_DATA=true`, o backend insere os IDs ausentes e registra `script-pokedex-v1` na coleção `importacoes`. Depois disso, reiniciar a aplicação preserva edições e exclusões. Use `SEED_DATA=false` para desativar a importação.

São 151 Pokémon, 18 tipos e 12 treinadores. O SQL não relaciona Mew a um tipo: foi mantido como `Typeless`. Relações repetidas de treinadores também foram preservadas conforme a fonte. Os números de insígnias seguem o script.

Exemplo de documento retornado pela API:

```json
{
  "id": 25,
  "name": "Pikachu",
  "stats": {"hp": 35, "attack": 55, "defense": 30, "specialAttack": 50, "specialDefense": 40, "speed": 90},
  "types": [{"id": 5, "name": "Electric"}]
}
```

No MongoDB, o identificador é persistido em `_id`; o Spring o expõe como `id` no JSON.

### API REST

| Método | Endereço | Operação |
| --- | --- | --- |
| GET | `/api/pokemons` | Lista; aceita `nome` e `tipo` opcionais |
| GET | `/api/pokemons/{id}` | Detalhes |
| POST | `/api/pokemons` | Cadastro |
| PUT | `/api/pokemons/{id}` | Edição |
| DELETE | `/api/pokemons/{id}` | Exclusão |
| GET | `/api/tipos` | Catálogo de tipos |
| GET | `/api/treinadores` | Treinadores e IDs dos Pokémon |

Corpo de cadastro ou edição:

```json
{
  "id": 152,
  "name": "Chikorita",
  "stats": {"hp": 45, "attack": 49, "defense": 65, "specialAttack": 49, "specialDefense": 65, "speed": 45},
  "typeIds": [4]
}
```

O ID deve ser positivo, único e até 99999; não pode mudar na edição. Nome é obrigatório e tem até 80 caracteres. Atributos variam de 1 a 255. Aceita um ou dois tipos distintos existentes; Typeless deve ser usado sozinho. Cadastro retorna 201, exclusão 204, dados inválidos 400, ausente 404, duplicado 409 e regras recusadas 422.

Ao excluir um Pokémon, sua referência histórica no treinador permanece, mas o time exibido omite IDs que não existem mais. A API é pública para fins da atividade; adicionar autenticação é uma melhoria para publicação com dados reais.

## 🔧 Instalação e Execução

### Pré-requisitos

JDK 17 ou superior com JAVA_HOME configurado, Node.js 22.12+ (recomendado 24), npm e MongoDB local ou um cluster Atlas. A primeira execução precisa de internet para baixar as dependências.

### MongoDB Atlas

1. Crie um projeto e um cluster no Atlas.
2. Em Database Access, crie um usuário do banco com permissão de leitura e escrita no banco `pokedex`.
3. Em Network Access, permita o IP da máquina que executará o backend. Em uma hospedagem, configure a saída correspondente.
4. Em Connect → Drivers, copie a URI de conexão e indique `pokedex` como banco.
5. Copie `backend/.env.example` para `backend/.env` e preencha:

```properties
MONGODB_URI=mongodb+srv://USUARIO:SENHA@SEU_CLUSTER/pokedex?retryWrites=true&w=majority
CORS_ORIGINS=http://localhost:5173
SEED_DATA=true
```

Use a senha do usuário do banco; caracteres especiais precisam ser codificados para URL na URI. Não publique credenciais no GitHub. O arquivo `.env` é lido ao iniciar o backend a partir da pasta `backend`.

Para MongoDB local, use `mongodb://localhost:27017/pokedex`. Essa é também a configuração padrão quando não há `.env`. Não é necessário instalar MySQL nem executar SQL em um servidor relacional.

### Como executar a aplicação

No primeiro terminal, dentro de `backend`:

```bash
./mvnw spring-boot:run
```

No Windows, também é possível usar `./mvnw.cmd spring-boot:run`. O backend inicia em `http://localhost:8080` e precisa conseguir conectar ao MongoDB.

No segundo terminal, dentro de `frontend`:

```bash
npm ci
npm run dev
```

Abra `http://localhost:5173`. O Vite encaminha `/api` para o backend. Não há fallback para o antigo JSON: se a API estiver indisponível, a tela informa o erro e permite tentar novamente.

### Frontend e favoritos

`frontend/.env.example` documenta `VITE_API_URL`, `VITE_SUPABASE_URL` e `VITE_SUPABASE_KEY`. Copie para `.env.local` somente se precisar configurá-las. Para execução local, `VITE_API_URL` fica vazio. Em outro domínio, informe o endereço público da API e ajuste `CORS_ORIGINS` no backend.

Favoritos mantêm a integração da atividade anterior com `frontend/supabase/favoritos.sql`. Execute esse SQL também se reutilizar um banco da Atividade 03: ele atualiza o campo de ID para aceitar até 99999, incluindo os Pokémon cadastrados nesta atividade. Sem Supabase, somente favoritos ficam desativados; pesquisa, CRUD, treinadores e detalhes continuam usando o MongoDB. Não coloque a chave `service_role` no frontend.

## 📂 Estrutura de Pastas

```text
pokedex/
├── frontend/               Interface da Atividade 03 integrada à API
├── backend/                Controller, Service, Repository, Model e testes
├── Script_Pokedex.sql      Fonte original fornecida pelo professor
└── README.md
```

## 🎥 Demonstração

Use `Cadastrar Pokémon` na lista. Abra os detalhes para editar ou excluir; a exclusão pede confirmação. Detalhes consultam o endpoint individual. Pesquisa e filtros da interface operam sobre a lista recebida da API, mantendo o comportamento da Atividade 03.

O botão `Design` abre a referência visual: tokens de cores com seus usos, tipografia, botões, campos, etiquetas, atributos e card de exemplo que funciona sem a API. O tema claro/escuro também funciona nessa página. O formulário usa diálogo nativo com foco contido, validações e indicação de salvamento.

As imagens continuam vindo do repositório público de sprites da PokeAPI pelo ID. Não são guardadas no MongoDB. Para IDs sem imagem, a interface apresenta um estado sem ilustração.

## 🧪 Testes

Dentro de `backend`:

```bash
./mvnw test
```

São 27 testes: 16 de serviço e 11 de controller. Seguem o padrão Mockito do AraCoffee: `MockitoExtension`, `@Mock`, `@InjectMocks`, `@Nested`, `when`, `verify`, captor e asserções. Os repositories são simulados; não é necessário iniciar MongoDB ou configurar Atlas para rodar essa suíte. MockMvc confere endpoints, validação e status HTTP.

No frontend:

```bash
npm run lint
npm run build
```

Para testar manualmente: busque Pikachu, filtre por tipo, confira os seis atributos, crie o ID 152 do exemplo, edite seu nome, tente duplicar o ID, exclua e reinicie o backend. A exclusão deve persistir. Confira treinadores, tema e página Design. Teste também a API desligada e a opção de tentar novamente.

## 🔗 Documentações utilizadas

- [Enunciado e script da disciplina](https://github.com/joaopauloaramuni/desenvolvimento-e-integracao-de-aplicacoes-web/tree/main/ATIVIDADES)
- [AraCoffee e projetos do professor](https://github.com/joaopauloaramuni/desenvolvimento-e-integracao-de-aplicacoes-web)
- [Spring Data MongoDB](https://spring.io/projects/spring-data-mongodb)
- [Mockito](https://site.mockito.org/)
- [Sprites PokeAPI](https://github.com/PokeAPI/sprites)

## 👥 Autores

- [Samuel Ferreira](https://github.com/SamuelFerr0)
- Crispim Bruno

A entrega no Canvas deve conter o link do repositório. Cada integrante envia o link da dupla.

## 📄 Licença

[MIT](LICENSE)
