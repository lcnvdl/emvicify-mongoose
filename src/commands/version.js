module.exports = function() {
    let package = require("../../package.json");
    console.log(`${package.name} ${package.version}`);
};