var expect = require("chai").expect;
var Scaffolder = require("../src/scaffolder.js");
var scaffolder = new Scaffolder();
var fs = require('fs');

var resources = [{"relativeUriPathSegments":["servo"],"methods":[{"method":"post"},{"method":"put"},{"method":"get"}]}];


describe("App Scaffolder Test", function() {

  describe("Main file generator", function() {
    it("generates the arduino_rest_api.ino file content (main file)", function() {
      var generated = scaffolder.generateFile('arduino_rest_api.ino', resources);
      var expected = fs.readFileSync("./test/comparing-files/arduino_rest_api.ino", 'UTF-8');
      expect(generated).to.equal(expected);
    });
  });

  describe("Functions file Generator", function() {
    it("generates the A_functions.ino file content", function() {
      var generated = scaffolder.generateFile('A_functions.ino', resources);
      var expected = fs.readFileSync("./test/comparing-files/A_functions.ino", 'UTF-8');
      expect(generated).to.equal(expected);
    });
  });

  describe("Definitions file Generator", function() {
    it("generates the B_definitions.ino file content", function() {
      var generated = scaffolder.generateFile('B_definitions.ino', resources);
      var expected = fs.readFileSync("./test/comparing-files/B_definitions.ino", 'UTF-8');
      expect(generated).to.equal(expected);
    });
  });

  describe("Handlers file Generator", function() {
    it("generates the C_handlers.ino file content", function() {
      var generated = scaffolder.generateFile('C_handlers.ino', resources);
      var expected = fs.readFileSync("./test/comparing-files/C_handlers.ino", 'UTF-8');
      expect(generated).to.equal(expected);
    });
  });
  
  describe("Initialization file Generator", function() {
    it("generates the D_initialization.ino file content", function() {
      var generated = scaffolder.generateFile('D_initialization.ino', resources);
      var expected = fs.readFileSync("./test/comparing-files/D_initialization.ino", 'UTF-8');
      expect(generated).to.equal(expected);
    });
  });


});
