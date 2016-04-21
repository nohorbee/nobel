var expect = require("chai").expect;
var MultiParser = require("../src/multiparser")
var multiparser = new MultiParser();

var resources = {"resources":[{"relativeUriPathSegments":["servo"],"methods":[{"method":"post"},{"method":"put"},{"method":"get"}]}]};
var parsedSwagger = {"swagger":"2.0","info":{"version":"0.0.1","title":"NobelTestingAPI"},"paths":{"/servo":{"post":{"description":"Moves the servo to the specified angle.\n","parameters":[{"name":"angle","in":"body","description":"angle object","required":true,"schema":{"$ref":"#/definitions/Angle"}}],"responses":{"200":{"description":"Successful response","schema":{"$ref":"#/definitions/Angle"}}}},"put":{"description":"Moves the servo buy Adding the specified angle (could be negative)\n","parameters":[{"name":"angle","in":"body","description":"angle object","required":true,"schema":{"$ref":"#/definitions/Angle"}}],"responses":{"200":{"description":"Successful response","schema":{"$ref":"#/definitions/Angle"}}}},"get":{"description":"Returns the current servo angle\n","responses":{"200":{"description":"Successful response","schema":{"$ref":"#/definitions/Angle"}}}}}},"definitions":{"Angle":{"description":"Task object","properties":{"angle":{"type":"integer","description":"task object name"}},"required":["angle"]}}};
var parsedRAML = {"title":"NobelTestingAPI","resources":[{"relativeUri":"/servo","methods":[{"description":"Moves the servo to the specified angle.\n","body":{"application/json":{"example":"{\"angle\": 71}\n"}},"method":"post"},{"description":"Moves the servo buy Adding the specified angle (could be negative)\n","body":{"application/json":{"example":"{\"angle\": -10}\n"}},"method":"put"},{"description":"Returns the current servo angle\n","responses":{"200":{"body":{"application/json":{"example":"{ \"angle\": 71 }\n"}}}},"method":"get"}],"relativeUriPathSegments":["servo"]}]};
describe("App MultiParser Test", function() {
  
  // describe("Parsing RAML Test", function() {
  //   it("parses the RAML file", function(done) {
  //     var expected = parsedRAML;
  //     var actual;
  //     
  //     multiparser.parseRAML('./test/comparing-files/api.raml').then(
  //       function (result) {
  //           try {
  //               expect(result).to.deep.equal(expected);
  //               done();
  //           } catch (e) {
  //             done(e);
  //           }
  //       },
  //       function (err) {
  //          done(err);
  //       }
  //   );
  //     
  //     
  //   });
  // });
  
  
  describe("Parsing RAML Test for Nobel", function() {
    it("verifies that the values used by Nobel are correct", function(done) {
      var expected = resources;
      var actual;
      
      multiparser.parseRAML('./test/comparing-files/api.raml').then(
        function (result) {
            try {
                expect(result.resources).to.have.lengthOf(1);
                expect(result.resources[0].relativeUriPathSegments).to.have.lengthOf(1);
                expect(result.resources[0].relativeUriPathSegments).to.deep.equal(["servo"]);
                expect(result.resources[0].methods).to.have.lengthOf(3);
                methods = [];
                result.resources[0].methods.forEach(function(val) {methods.push(val.method)})
                expect(methods).to.have.members(['post', 'put', 'get']);
                done();
            } catch (e) {
              done(e);
            }
        },
        function (err) {
           done(err);
        }
    );
      
      
    });
  });
  
  // describe("Parsing Swagger Test", function() {
  //   it("parses the Swagger file", function(done) {
  //     var expected = parsedSwagger;
  //     var actual;
  //     
  //     multiparser.parseSwagger('./test/comparing-files/api.yaml').then(
  //       function (result) {
  //           try {
  //               expect(result).to.deep.equal(expected);
  //               done();
  //           } catch (e) {
  //             done(e);
  //           }
  //       },
  //       function (err) {
  //          done(err);
  //       }
  //   );
  //     
  //     
  //   });
  // });
  // 
  describe("Parsing Swagger Test for Nobel", function() {
    it("verifies that the values used by Nobel are correct", function(done) {
      var expected = resources;
      var actual;
      
      multiparser.parseSwagger('./test/comparing-files/api.yaml').then(
        function (result) {
            try {
              expect(result.resources).to.have.lengthOf(1);
              expect(result.resources[0].relativeUriPathSegments).to.have.lengthOf(1);
              expect(result.resources[0].relativeUriPathSegments).to.deep.equal(["servo"]);
              expect(result.resources[0].methods).to.have.lengthOf(3);
              methods = [];
              result.resources[0].methods.forEach(function(val) {methods.push(val.method)})
              expect(methods).to.have.members(['post', 'put', 'get']);
              done();
            } catch (e) {
              done(e);
            }
        },
        function (err) {
           done(err);
        }
    );
      
      
    });
  });
  

});


