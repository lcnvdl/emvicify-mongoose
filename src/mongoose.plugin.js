/**
 * @typedef {import("@emvicify/base/src/plugins/plugin")} Plugin
 * @typedef {import("@emvicify/base/src/plugins/plugin-type")} PluginType
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
}

module.exports = MongoosePlugin;