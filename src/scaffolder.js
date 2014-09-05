var swig = require('swig');
var path = require('path');
var fs = require('fs');
var ramlParser = require('raml-parser');


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
}


Scaffolder.prototype.generate = function(options) {

    if (this.verbose) {
        console.log("Generating API with this parameters:");
        console.dir(options);
    }

    var resources
    ramlParser.loadFile(options.source).then(function(data) {
        resources = data.resources;

        var arduino_rest_api = swig.renderFile(path.join(__dirname, 'templates','arduino_rest_api.ino'),
            {
                resources: resources
            }
        )

        saveFile(path.join(options.target, options.name + ".ino"), arduino_rest_api);



        var renderedA_functions = swig.renderFile(path.join(__dirname, 'templates','A_functions.ino'),
            {
                resources: resources
            }
        )

        saveFile(path.join(options.target, "A_functions.ino"), renderedA_functions);

        var renderedB_definitions = swig.renderFile(path.join(__dirname, 'templates','B_definitions.ino'),
            {
                resources: resources
            }
        )

        saveFile(path.join(options.target, "B_definitions.ino"), renderedB_definitions);


        var renderedC_handlers = swig.renderFile(path.join(__dirname, 'templates','C_handlers.ino'),
            {
                resources: resources
            }
        )

        saveFile(path.join(options.target, "C_handlers.ino"), renderedC_handlers);

        var renderedD_initialization = swig.renderFile(path.join(__dirname, 'templates','D_initialization.ino'),
            {
                resources: resources
            }
        )

        saveFile(path.join(options.target, "D_initialization.ino"), renderedD_initialization);



    }) ;



}
