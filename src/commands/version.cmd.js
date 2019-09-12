module.exports = function(consoleLog) {
    let package = require("../../package.json");
    consoleLog.info(`${package.name} ${package.version}`);
};