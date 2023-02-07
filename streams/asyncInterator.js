import assert from "assert";
import { parse } from "csv-parse";
import * as fs from "node:fs";

//Stream

(async () => {
  // Initialise the parser by generating random records
  const stream = fs.createReadStream("./multipart/taskData.csv");
  const parser = stream.pipe(parse());

  // Intialise count
  let count = 0;
  // Report start
  process.stdout.write("start\n");
  // Iterate through each records
  for await (const record of parser) {
    // Report current line
    let recordSplit = record.toString().split(";");

    let recordData = recordSplit.reduce((target, key, index) => {
      const data = {
        task: recordSplit[index - 1],
        description: recordSplit[index],
      };
      return data;
    }, {});

    if (
      recordData.task !== "title" &&
      recordData.description !== "description"
    ) {
      console.log(recordData);

      fetch("http://localhost:3333/tasks", {
        method: "POST",
        body: JSON.stringify({
          title: recordData.task,
          description: recordData.description,
        }),
        duplex: "half",
      })
        .then((response) => {
          response.text();
        })
        .then((data) => {
          console.log(data);
        });
    }
    // process.stdout.write(`${count++} ${record.split(";")}\n`);
    // Fake asynchronous operation
    await new Promise((resolve) => setTimeout(resolve, 100));
  }
  // Report end
  process.stdout.write("...done\n");
  // Validation
  assert.strictEqual(count, count);
})();
