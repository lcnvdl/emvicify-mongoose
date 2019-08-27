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

        this.on("configureAppBeforeServe", args => this.install(args));
    }

    get pluginName() {
        return "@emvicify/mongoose";
    }

    get pluginType() {
        return PluginType.MongoExtension;
    }

    install({ app, http, modules }) {
        
    }
}

module.exports = MongoosePlugin;