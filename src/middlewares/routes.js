import { Database } from "./database.js";
import { randomUUID } from "node:crypto";
import { buildRoutePath } from "../utils/build-route-path.js";

const database = new Database();

export const routes = [
  {
    method: "GET",
    path: buildRoutePath("/tasks"),
    handler: (req, res) => {
      const { search } = req.query;

      console.log(search);

      const tasks = database.select(
        "tasks",
        search && {
          title: search,
          description: search,
        }
      );

      return res.end(JSON.stringify(tasks));
    },
  },
  {
    method: "POST",
    path: buildRoutePath("/tasks"),
    handler: (req, res) => {
      const { title, description } = req.body;

      if (!title || !description) {
        return res.writeHead(400).end(
          JSON.stringify({
            error: "Erro ao receber os dados no corpo da requisição.",
          })
        );
      }

      const task = {
        id: randomUUID(),
        title: title,
        description: description,
        completed_at: null,
        created_at: new Date(),
        updated_at: new Date(),
      };

      database.insert("tasks", task);

      return res.writeHead(201).end();
    },
  },
  {
    method: "PUT",
    path: buildRoutePath("/tasks/:id"),
    handler: (req, res) => {
      const { title, description } = req.body;

      if (!title || !description) {
        return res.writeHead(400).end(
          JSON.stringify({
            error: "Erro ao receber os dados no corpo da requisição.",
          })
        );
      }

      const { id } = req.params;

      const response = database.update("tasks", id, {
        title: title,
        description: description,
      });

      if (response) {
        return res.writeHead(400).end(
          JSON.stringify({
            error: response,
          })
        );
      }

      return res.writeHead(204).end();
    },
  },
  {
    method: "DELETE",
    path: buildRoutePath("/tasks/:id"),
    handler: (req, res) => {
      const { id } = req.params;

      const response = database.delete("tasks", id);

      if (response) {
        return res.writeHead(400).end(
          JSON.stringify({
            error: response,
          })
        );
      }

      return res.writeHead(204).end();
    },
  },
  {
    method: "PATCH",
    path: buildRoutePath("/tasks/:id/complete"),
    handler: (req, res) => {
      const { id } = req.params;

      console.log(id);

      const response = database.updateUnique("tasks", id);

      if (response) {
        return res.writeHead(400).end(
          JSON.stringify({
            error: response,
          })
        );
      }

      return res.writeHead(204).end();
    },
  },
];
