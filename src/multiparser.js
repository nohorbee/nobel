var ramlParser = require('raml-parser');

var MultiParser = module.exports = function(verbose) {
    this.verbose = verbose;
}

MultiParser.prototype.parse = function(source) {
  var that = this;
  return new Promise(function(fullfill, reject) {
    that.parseRAML(source).then(fullfill, reject);
  });  
}

MultiParser.prototype.parseRAML = function(source) {
  return new Promise(function(fullfill, reject){
      ramlParser.loadFile(source).then(fullfill, reject);
  });
}