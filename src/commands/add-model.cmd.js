const fs = require("fs");
const path = require("path");

const SchemaTypes = require("./schema-types");

module.exports = function (name, { empty = false }, consoleLog, inquirer, { FileCommand }, { present, goodbye }) {
    class AddModelCommand extends FileCommand {
        get currentDir() {
            return __dirname;
        }

        get templateFolder() {
            return "model";
        }

        get templateName() {
            return "model";
        }

        get outDirFolderName() {
            return "models";
        }

        async run(name) {
            present("Add Mongoose Model " + name);

            const outDir = this.getOutDir(name);
            const fileName = this.toSnakeCase(name);
            const className = this.toCamelCase(name, true);

            const finalPath = path.join(outDir, fileName + ".model.js");

            this.template.setData("className", className);

            let definitions;

            if (!empty) {
                definitions = await this._getDefinitions();
                if (definitions) {
                    if (definitions.length > 0) {
                        present("Adding model...");
                    }
                    else {
                        present("Adding empty model...");
                    }
                }
                else {
                    consoleLog.error("Cancelled");
                    return;
                }
            }
            else {
                definitions = [];
            }

            let content = this.template.render(true);

            if (definitions.length > 0) {
                let defContent = "";

                let i = 0;
                definitions.forEach(m => {
                    const { name, type } = m;
                    if (i++ > 0) {
                        defContent += ",\n";
                    }
                    defContent += `  ${name}: ${type}`
                });

                content = content.replace("  //  __@Definitions__", defContent);
            }
            else {
                content = content.replace("__@Definitions__", "Model schema")
            }

            fs.writeFileSync(finalPath, content, "utf-8");

            goodbye("Mongoose Model " + className + " created");
        }

        async _getDefinitions() {
            let definitions = [];
            let exit = false;

            do {
                const { mainAnswer } = await inquirer.prompt({
                    type: "list",
                    name: "mainAnswer",
                    message: "Main Menu",
                    choices: [
                        { name: "Add a property", value: 1 },
                        { name: "Save and exit", value: 10 },
                        { name: "Cancel", value: 11 }
                    ]
                });

                if (mainAnswer >= 10) {
                    if (mainAnswer === 11) {
                        definitions = null;
                    }

                    exit = true;
                }
                else if (mainAnswer === 1) {
                    await this._addNewProperty(definitions);
                }
            }
            while (!exit);

            return definitions;
        }

        async _addNewProperty(definitions) {
            const questions = [
                {
                    type: "input",
                    name: "name",
                    message: "Property name",
                    validate: value => {
                        const pass = value.match(/^([_a-zA-Z][_a-zA-Z0-9]+$)/i);
                        if (pass) {
                            return true;
                        }

                        return "Invalid model name. Build it using letters, numbers, and underscores. Example: \"MyEntity\"."
                    }
                }, {
                    type: "list",
                    name: "type",
                    message: "Property type",
                    choices: Object.keys(SchemaTypes)
                }
            ];

            const answer = await inquirer.prompt(questions);
            definitions.push(answer);
        }
    }

    (new AddModelCommand()).run(name);
};
