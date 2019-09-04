const { expect } = require("chai");
const MongoosePlugin = require("../src/mongoose.plugin");

describe("Plugin", () => {
    it("constructor should work fine", () => {
        const instance = new MongoosePlugin();
        expect(instance).to.be.ok;
    });
});
