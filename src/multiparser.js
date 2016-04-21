var ramlParser = require('raml-parser');
var SwaggerParser = require('swagger-parser');
var fs = require('fs');

var MultiParser = module.exports = function(verbose) {
    this.verbose = verbose;
}

MultiParser.prototype.parse = function(source) {
  var that = this;
  return new Promise(function(fullfill, reject) {
    var lang = fs.readFileSync(source).toString().split('\n')[0];
    console.log(lang);
    if(lang.substring(0,7)==="swagger") {
      inputFormat = "SWAGGER";
    } else if (lang.substring(0,6)==="#%RAML") {
      inputFormat = "RAML";
    } else {
      console.log("The file format wasn't recognized. It must be Swagger or RAML");
      return;
    }
    if (inputFormat==="RAML") {  
      parseFunction = that.parseRAML
    } else {
      
      parseFunction = that.parseSwagger
    }
    parseFunction(source).then(fullfill, reject);
  });  
}

MultiParser.prototype.parseRAML = function(source) {
  
  var that = this;
  return new Promise(function(fullfill, reject){
      ramlParser.loadFile(source).then(function(api) {
        
        MultiParser.prototype.convertRAMLToResources(api).then(fullfill, reject);
      }, reject);
  });
}

MultiParser.prototype.parseSwagger = function(source) {
  var that = this;
  return new Promise(function(fullfill, reject){
    SwaggerParser.parse(source).then(function(api) {
      MultiParser.prototype.convertSwaggerToResources(api).then(fullfill, reject);
    }, reject);
  });
}

MultiParser.prototype.convertRAMLToResources = function(api) {
  
  return new Promise(function(fullfill, reject) {
    try {
      var result = {}
      result.resources = [];
      api.resources.forEach(function(apiResource) {
        var newResource = {};
        newResource.relativeUriPathSegments = apiResource.relativeUriPathSegments;
        newResource.methods = [];
        apiResource.methods.forEach(function(resourceMethod) {
          var newMethod = {};
          newMethod.method = resourceMethod.method;
          newResource.methods.push(newMethod);
        });
        result.resources.push(newResource);
        fullfill(result);
      });
    } catch(e) {
      reject(e)
    } 
    
  });
}

MultiParser.prototype.convertSwaggerToResources = function(api) {
  return new Promise(function(fullfill, reject){
    try {
      var result = {}
      result.resources = [];
      var allowedVerbs = ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'HEAD', 'TRACE', 'CONNECT', 'PATCH'];
      for (var apiResource in api.paths) {
        var newResource = {};
        newResource.relativeUriPathSegments = [];
        newResource.relativeUriPathSegments.push(apiResource.replace('/',''));
        newResource.methods = [];
        
        for (var method in api.paths[apiResource]) {
          if (allowedVerbs.indexOf(method.toUpperCase()) >= 0) {
            var newMethod = {}
            newMethod.method = method;
            newResource.methods.push(newMethod);
          }
        }
        result.resources.push(newResource);
      }
      
      
      fullfill(result);
    } catch(e) {
      reject(e);
    }
  });
}