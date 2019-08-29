/**
 * @typedef {import("@emvicify/base/src/plugins/plugin")} Plugin
 * @typedef {import("@emvicify/base/src/plugins/plugin-type")} PluginType
 * @typedef {import("commander")} Program
 */

const { plugins } = require("@emvicify/base")

/** @type {Plugin} */
const Plugin = plugins.Plugin;

/** @type {PluginType} */
const PluginType = plugins.PluginType;

class MongoosePlugin extends Plugin {
    constructor() {
        super();

        this.on("configureAppBeforeServe", args => this.configure(args));
        this.on("install", args => this.install(args));
        this.on("uninstall", args => this.uninstall(args));
        this.on("commands", args => this.commands(args));
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

    configure({ app, http, modules }) {
    }

    install() {
    }

    uninstall() {
    }

    /**
     * @param {Program} program Program
     */
    commands(program) {
        program
            .command("mongoose:version")
            .alias("mongoose:v")
            .action(() => require("./package.json").name + " " + require("./package.json").version);
    }
}

module.exports = MongoosePlugin;