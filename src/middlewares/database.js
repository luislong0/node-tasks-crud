import fs from "node:fs/promises";

const databasePath = new URL("../../db.json", import.meta.url);

export class Database {
  #database = {};

  #persist() {
    fs.writeFile(databasePath, JSON.stringify(this.#database));
  }

  constructor() {
    fs.readFile(databasePath, "utf-8")
      .then((data) => {
        this.#database = JSON.parse(data);
      })
      .catch(() => {
        this.#persist();
      });
  }

  select(table, search) {
    let data = this.#database[table] ?? [];

    if (search) {
      data = data.filter((row) => {
        return Object.entries(search).some(([key, value]) => {
          return row[key].includes(value);
        });
      });
    }

    return data;
  }

  insert(table, data) {
    if (Array.isArray(this.#database[table])) {
      this.#database[table].push(data);
    } else {
      this.#database[table] = [data];
    }

    this.#persist();

    return data;
  }

  update(table, id, data) {
    const { title, description } = data;
    const rowIndex = this.#database[table].findIndex((row) => row.id === id);

    if (rowIndex <= -1) {
      return "Registro não encontrado";
    }

    if (rowIndex > -1) {
      let { created_at, completed_at } = this.#database[table][rowIndex];
      this.#database[table][rowIndex] = {
        id,
        title,
        description,
        completed_at,
        created_at,
        updated_at: new Date(),
      };
      this.#persist();
    }
  }

  delete(table, id) {
    const rowIndex = this.#database[table].findIndex((row) => row.id === id);

    if (rowIndex <= -1) {
      return "Registro não encontrado";
    }

    if (rowIndex > -1) {
      this.#database[table].splice(rowIndex, 1);
      this.#persist();
    }
  }

  updateUnique(table, id) {
    const rowIndex = this.#database[table].findIndex((row) => row.id === id);

    if (rowIndex <= -1) {
      return "Registro não encontrado";
    }

    if (rowIndex > -1) {
      let { title, description, created_at } = this.#database[table][rowIndex];
      this.#database[table][rowIndex] = {
        id,
        title,
        description,
        completed_at: new Date(),
        created_at,
        updated_at: new Date(),
      };
      this.#persist();
    }
  }
}
