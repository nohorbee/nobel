var expect = require("chai").expect;
var Scaffolder = require("../src/scaffolder.js");
var scaffolder = new Scaffolder();
var fs = require('fs');

var resources = [{"relativeUri":"/servo","methods":[{"description":"Moves the servo to the specified angle.\n","body":{"application/json":{"example":"{\"angle\": 71}\n"}},"method":"post"},{"description":"Moves the servo buy Adding the specified angle (could be negative)\n","body":{"application/json":{"example":"{\"angle\": -10}\n"}},"method":"put"},{"description":"Returns the current servo angle\n","responses":{"200":{"body":{"application/json":{"example":"{ \"angle\": 71 }\n"}}}},"method":"get"}],"relativeUriPathSegments":["servo"]}]


describe("App Scaffolder Test", function() {

  describe("Main file generator", function() {
    it("generates the arduino_rest_api.ino file content (main file)", function() {
      var generated = scaffolder.generateFile('arduino_rest_api.ino', resources);
      var expected = fs.readFileSync("./test/results/arduino_rest_api.ino", 'UTF-8');
      expect(generated).to.equal(expected);
    });
  });

  describe("Functions file Generator", function() {
    it("generates the A_functions.ino file content", function() {
      var generated = scaffolder.generateFile('A_functions.ino', resources);
      var expected = fs.readFileSync("./test/results/A_functions.ino", 'UTF-8');
      expect(generated).to.equal(expected);
    });
  });

  describe("Definitions file Generator", function() {
    it("generates the B_definitions.ino file content", function() {
      var generated = scaffolder.generateFile('B_definitions.ino', resources);
      var expected = fs.readFileSync("./test/results/B_definitions.ino", 'UTF-8');
      expect(generated).to.equal(expected);
    });
  });

  describe("Handlers file Generator", function() {
    it("generates the C_handlers.ino file content", function() {
      var generated = scaffolder.generateFile('C_handlers.ino', resources);
      var expected = fs.readFileSync("./test/results/C_handlers.ino", 'UTF-8');
      expect(generated).to.equal(expected);
    });
  });
  
  describe("Initialization file Generator", function() {
    it("generates the D_initialization.ino file content", function() {
      var generated = scaffolder.generateFile('D_initialization.ino', resources);
      var expected = fs.readFileSync("./test/results/D_initialization.ino", 'UTF-8');
      expect(generated).to.equal(expected);
    });
  });


});
