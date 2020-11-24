/**
 * @typedef {import("@emvicify/base/src/plugins/plugin")} Plugin
 * @typedef {import("@emvicify/base/src/plugins/plugin-type")} PluginType
 * @typedef {import("commander")} Program
 */

const { plugins } = require("@emvicify/base")
const fs = require("fs");
const path = require("path");

/** @type {Plugin} */
const Plugin = plugins.Plugin;

/** @type {PluginType} */
const PluginType = plugins.PluginType;

class MongoosePlugin extends Plugin {
    constructor() {
        super();

        this.settings = {};
        this.mongoose = null;

        this.on("configureAppBeforeServe", args => this.configure(args));
        this.on("install", args => this.install(args));
        this.on("uninstall", args => this.uninstall(args));
        this.on("commands", (program, tools) => this.commands(program, tools));
    }

    get pluginId() {
        return "com.emvicify.mongoose";
    }

    get pluginName() {
        return "@emvicify/mongoose";
    }

    get pluginType() {
        return PluginType.MongoExtension;
    }

    get defaults() {
        return {
            url: "mongodb://localhost:27017",
            useNewUrlParser: true
        };
    }

    configure({ modules }) {
        this.settings = Object.assign(this.defaults, modules.settings.mongoose);
        this.mongoose = require("mongoose");
        this.mongoose.connect(this.settings.url, {
            useNewUrlParser: this.settings.useNewUrlParser,
            useUnifiedTopology: this.settings.useUnifiedTopology
        });
    }

    install({ baseDirectory }) {
        this._getAndEditSettings(baseDirectory, currentSettings => {
            if (!currentSettings.mongoose) {
                currentSettings.mongoose = this.defaults;
                return currentSettings;
            }
            else {
                return null;
            }
        });
    }

    uninstall({ baseDirectory, deleteSettings = false }) {
        if (deleteSettings) {
            this._getAndEditSettings(baseDirectory, currentSettings => {
                if (!currentSettings.mongoose) {
                    currentSettings.mongoose = this.defaults;
                    return currentSettings;
                }
                else {
                    return null;
                }
            });
        }
    }

    /**
     * @param {Program} program Program
     * @param {*} tools Tools
     */
    commands(program, tools) {
        const { version, addModel } = require("./commands/commands");
        const { consoleLog, inquirer, classes, methods } = tools;

        program
            .command("mongoose:version")
            .alias("mongoose:v")
            .description("Plugin version")
            .action(() => version(consoleLog));

        program.command("mongoose:add:model <name>")
            .alias("mongoose:am")
            .description("Adds a mongoose model")
            .option("-e, --empty", "Cancels the prompt for filling the schema definitions.")
            .action((name, cmdObj) => addModel(name, cmdObj, consoleLog, inquirer, classes, methods));
    }

    /**
     * @param {string} baseDirectory Base directory
     * @param {Function} action Function that receives the current settings (Object) and returns a new object if has changed, or null if it hasn't changed
     */
    _getAndEditSettings(baseDirectory, action) {
        const settingsPath = path.join(baseDirectory, "settings.json");
        let currentSettings = JSON.parse(fs.readFileSync(settingsPath, "utf-8"));

        let newContent = action(currentSettings);

        if (newContent) {
            const content = JSON.stringify(newContent, null, 2);
            fs.writeFileSync(settingsPath, content, "utf-8");
        }
    }
}

module.exports = MongoosePlugin;
