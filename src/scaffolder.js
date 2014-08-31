var swig = require('swig');
var path = require('path');
var ramlParser = require('raml-parser');
var fs = require('fs');


var Scaffolder = module.exports = function(verbose) {
    this.verbose = verbose;
}

var resources = ['a', 'b', 'c'];

Scaffolder.prototype.generate = function(options) {

    if (this.verbose) {
        console.log("Generating API with this parameters:");
        console.dir(options);
    }
    var resources
    ramlParser.loadFile(options.source).then(function(data) {
        resources = data.resources;//console.log(JSON.stringify(data, null, 2));

        var arduino_rest_api = swig.renderFile(path.join(__dirname, 'templates','arduino_rest_api.ino'),
            {
                resources: resources
            }
        )

        fs.writeFile(options.target + "/main/main.ino", arduino_rest_api, function(err) {
            if(err) {
                console.log(err);
            } else {
                console.log("The file was saved!");
            }
        });

        var renderedA_functions = swig.renderFile(path.join(__dirname, 'templates','A_functions.ino'),
            {
                resources: resources
            }
        )

        fs.writeFile(options.target + "/main/A_functions.ino", renderedA_functions, function(err) {
            if(err) {
                console.log(err);
            } else {
                console.log("The file was saved!");
            }
        });

        var renderedB_definitions = swig.renderFile(path.join(__dirname, 'templates','B_definitions.ino'),
            {
                resources: resources
            }
        )

        fs.writeFile(options.target + "/main/B_definitions.ino", renderedB_definitions, function(err) {
            if(err) {
                console.log(err);
            } else {
                console.log("The file was saved!");
            }
        });

        var renderedC_handlers = swig.renderFile(path.join(__dirname, 'templates','C_handlers.ino'),
            {
                resources: resources
            }
        )

        fs.writeFile(options.target + "/main/C_handlers.ino", renderedC_handlers, function(err) {
            if(err) {
                console.log(err);
            } else {
                console.log("The file was saved!");
            }
        });

        var renderedD_initialization = swig.renderFile(path.join(__dirname, 'templates','D_initialization.ino'),
            {
                resources: resources
            }
        )

        fs.writeFile(options.target + "/main/D_initialization.ino", renderedD_initialization, function(err) {
            if(err) {
                console.log(err);
            } else {
                console.log("The file was saved!");
            }
        });

        //console.log(renderedC_handlers);

    }) ;



}
