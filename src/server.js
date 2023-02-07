// Métodos HTTP = GET, POST, PUT, PATCH, DELETE;

// GET => Buscar um recurso no back-end
// POST => Criar um recurso no back-end
// PUT => Atualizar um recurso no back-end
// PATCH => Atualizar uma informação única ou especifica de um recurso no back-end
// DELETE => Deletar um recurso no back-end

// Tipos de parâmetros:
// Query Params: req.query
// Route Params: req.params
// Body: req.body
// Headers: req.headers

// Stateful = Algum tipo de informação sendo guardada em memória
// Stateless = Os dados / informação e guardado em arquivos externos (Ex: banco de dados)

// JSON = Estrutura de dados para transição de dados front-end para back-end ou back-end para back-end
// Consegue representar array, objetos, etc... dentro de uma string

// Cabeçalhos (Requisição/respostas) => Metadados

// HTTP Status Codes:
// 100 - 199: informativos
// 200 - 299: sucesso
// 300 - 399: Redirecionamento
// 400 - 499: Erro por parte do cliente (front-end)
// 500 - 599: Erro no servidor

// Query Parameters: parâmetros nomeados enviados na rota após o corpo da requisição
// (URL Stateful => filtros, ordenação, paginação)

// Route Parameters: Identificação e recurso
// Request Body: Envio de informações de um formulário (HTTPs)

// http://localhost:3333/users?userId=1&name=Diego

// GET http://localhost:3333/users/1
// DELETE http://localhost:3333/users/1

// Edição e remoção de usuários

import http from "node:http";
import { json } from "./middlewares/json.js";
import { routes } from "./middlewares/routes.js";
import { extractQueryParams } from "./utils/extract-query-params.js";

const server = http.createServer(async (req, res) => {
  const { method, url } = req;

  await json(req, res);

  const route = routes.find((route) => {
    return route.method === method && route.path.test(url);
  });

  if (route) {
    const routeParams = req.url.match(route.path);

    // console.log(extractQueryParams(routeParams.groups.query));

    const { query, ...params } = routeParams.groups;

    req.params = params;
    req.query = query ? extractQueryParams(query) : {};

    req.params = { ...routeParams.groups };

    return route.handler(req, res);
  }

  return res.writeHead(404).end();
});

server.listen(3333);
