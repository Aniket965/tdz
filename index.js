const chalk = require("chalk");
const argv = require("yargs").argv;
const jsonfile = require("jsonfile");
const path = require("path");
const log = require("emojifylogs").log;
const fileExists = require("file-exists");
let filepath = path.join(__dirname, "todos.json");

// TODO: init
// TODO: show
// TODO: add
// TODO: remove
// TODO: drop

/**
 *  Initializes the todolist in the Project
 */
const init = () => {
  let tasks = {
    tasks: [],
    lastindex:0
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
    if (err) log.error(err)
    else {
      if (exists) {
        let newtodos = []
        let lastindex = 0
        jsonfile.readFile(filepath,(err,todos)=>{
          lastindex = todos.lastindex + 1
          newtodos = todos.tasks
          newtodos.push({todo:todo,id:lastindex})
          let tasks = {
            tasks: newtodos,
            lastindex
          };
          jsonfile.writeFile(filepath, tasks,{spaces:2},()=>{
            log.info(`Added ${chalk.cyan(todo)} to todolist`)
          })
        })

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
function main() {
  if (argv._.indexOf("init") === 0) {
    init();
  } else if (argv._.indexOf("add") === 0) {
    add(argv._[1])
  } else {
  }
}
main()