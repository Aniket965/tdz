#!/usr/local/bin/node

const chalk = require("chalk");
const argv = require("yargs").argv;
const jsonfile = require("jsonfile");
const path = require("path");
const log = require("emojifylogs").log;
const fileExists = require("file-exists");
let filepath = path.join(process.cwd(), "todos.json");

/**
 *  Initializes the todolist in the Project
 */
const init = () => {
  let tasks = {
    tasks: [],
    lastindex: 0
  };

  fileExists(filepath, (err, exists) => {
    if (err) log.error(err);
    else {
      if (exists) {
        log.info(reinitText);
      } else {
        jsonfile.writeFile(filepath, tasks, { spaces: 2 }, err => {
          if (err) log.error(err);
          else {
            console.log(initText);
          }
        });
      }
    }
  });
};

const add = todo => {
  fileExists(filepath, (err, exists) => {
    if (err) log.error(err);
    else {
      if (exists) {
        let newtodos = [];
        let lastindex = 0;
        jsonfile.readFile(filepath, (err, todos) => {
          lastindex = todos.lastindex + 1;
          newtodos = todos.tasks;
          newtodos.push({ todo: todo, id: lastindex });
          let tasks = {
            tasks: newtodos,
            lastindex
          };
          jsonfile.writeFile(filepath, tasks, { spaces: 2 }, () => {
            log.info(
              `Added ${chalk.cyan(todo)} to todolist with id ${chalk.green(
                lastindex
              )}`
            );
          });
        });
      } else {
        log.error(todosNotfound)
      }
    }
  });
};

const rm = (id, a = false) => {
  fileExists(filepath, (err, exists) => {
    if (err) log.error(err);
    else {
      if (exists) {
        if (!a) {
          let newtodos = [];
          jsonfile.readFile(filepath, (err, todos) => {
            newtodos = todos.tasks;
            newtodos = newtodos.filter(todo => {
              if (todo.id === id) return false;
              else return true;
            });
            let tasks = {
              tasks: newtodos,
              lastindex: todos.lastindex
            };
            jsonfile.writeFile(filepath, tasks, { spaces: 2 }, () => {
              log.info(`removed todos with id ${chalk.red(id)} to todolist`);
            });
          });
        } else {
          let tasks = {
            tasks: [],
            lastindex: 0
          };
          jsonfile.writeFile(filepath, tasks, { spaces: 2 }, () => {
            log.info(`removed all tasks`);
          });
        }
      } else {
        log.error(todosNotfound)
      }
    }
  });
};

const show = () => {
  fileExists(filepath, (err, exists) => {
    if (err) log.error(err);
    else {
      if (exists) {
        jsonfile.readFile(filepath, (err, todos) => {
          todos.tasks.forEach(task => {
            log.info(` ${chalk.green(task.id)} -> ${chalk.cyan(task.todo)} `);
          });
        });
      } else {
        log.error(todosNotfound)
      }
    }
  });
};

const initText = `
Welcome to Todo list ☀️
Initialized todos.json at ${filepath} ✨
Inside this directory, you can run several commands:
  ${chalk.cyan("tdz")} -> shows all todos
    ${chalk.green("Example:")}
      tdz
  ${chalk.cyan("tdz add")} -> adds new task
    ${chalk.green("Example:")}
        tdz add "fix status bar"
  ${chalk.cyan("tdz rm")} -> removes the task with given id
    ${chalk.green("Example:")}
        tdz rm 2

We suggest that you begin by typing:
${chalk.cyan("tdz add")} "awesome task"
Cheers 👻
`;
const reinitText = `${chalk.cyan(
  "todos.json"
)} already exists if you want to clear task try:
${chalk.cyan("tdz")} rm -a
`;

const todosNotfound = `${chalk.cyan("todos.json")} not found try typing:
${chalk.cyan("tdz init")}
`

function main() {
  if (argv._.indexOf("init") === 0) {
    init();
  } else if (argv._.indexOf("add") === 0) {
    add(argv._[1]);
  } else if (argv._.indexOf("rm") === 0) {
    if (argv.a === true) rm("", true);
    else rm(argv._[1]);
  } else {
    show()
  }
}
main();
