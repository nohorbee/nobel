var swig = require('swig');
var path = require('path');
var fs = require('fs');
var MultiParser = require('./multiparser');



var Scaffolder = module.exports = function(verbose) {
    this.verbose = verbose;
}

function saveFile(target, content) {
    fs.writeFile(target, content, function(err) {
        if(err) {
            console.log(err);
        } else {
            console.log("The file was saved!");
        }
    });
    console.log
}


Scaffolder.prototype.generateFile = function(templateFileName, resources) {
  var fileContent = swig.renderFile(path.join(__dirname, 'templates',templateFileName),
      {
          resources: resources
      }
  )
  return fileContent;
}

Scaffolder.prototype.generate = function(options) {
    if (this.verbose) {
        console.log("Generating API with this parameters:");
        console.dir(options);
    }
    var resources;
    var that = this;
    var multiParser = new MultiParser();
    
    multiParser.parse(options.source).then(function(data) {
      resources = data.resources;

      if(that.verbose) {
        console.log("\nresources:\n");
        console.log(JSON.stringify(resources));
      }

      var arduino_rest_api = Scaffolder.prototype.generateFile('arduino_rest_api.ino', resources);
      saveFile(path.join(options.target, options.name + ".ino"), arduino_rest_api);

      var renderedA_functions = Scaffolder.prototype.generateFile('A_functions.ino', resources);
      saveFile(path.join(options.target, "A_functions.ino"), renderedA_functions);

      var renderedB_definitions = Scaffolder.prototype.generateFile('B_definitions.ino', resources);
      saveFile(path.join(options.target, "B_definitions.ino"), renderedB_definitions);

      var renderedC_handlers = Scaffolder.prototype.generateFile('C_handlers.ino', resources);
      saveFile(path.join(options.target, "C_handlers.ino"), renderedC_handlers);

      var renderedD_initialization = Scaffolder.prototype.generateFile('D_initialization.ino', resources);
      saveFile(path.join(options.target, "D_initialization.ino"), renderedD_initialization);

    }, function(err) {
      console.log(err);
    });

}
