#!/usr/bin/env node
var ArgumentParser = require ('argparse').ArgumentParser;
var Scaffolder = require('./scaffolder');
var sb = require('string-builder');
var path = require('path');
var fs = require('fs.extra');


var parser = new ArgumentParser({
    version: '0.0.1',
    addHelp:true,
    description: 'Argparse example'
});

parser.addArgument(
    [ '-s', '--source' ],
    {
        help: 'The RAML file from which the whole code will be generated\n' +
            'It\'s the user responsibility to link the files and !includes on the filesystem or the internet'
    }
);

parser.addArgument(
    [ '-t', '--target' ],
    {
        help: 'The target directory where the project will be created: [target]/[name]\n' +
            'Note: If not specified, the project will be generated in ./[name]'
    }
);

parser.addArgument(
    [ '-n', '--name' ],
    {
        help: 'The generated project name. It will be used the following way:\n' +
            '- A subfolder of [target]\n' +
            '- The main project file [name].ino'
    }
);

parser.addArgument(
    [ '-il', '--installLibraries' ],
    {
        help: 'Include this option and indicate the Arduino Installation folder. Ex: "... -il ~/Documents/Arduino/libraries" if you need Nobel to install the required libraries (Webduino, android-resource, and Flash)'
    }
);



// Option for generating one method per resource with case, or one method per resource + method

var err = false;
options = parser.parseArgs();


if (options.source==null) {
    sb.appendLine("- The Source file must be specified");
    err = true;
}

if (options.name==null) {
    sb.appendLine("- The Project Name must be specified.");
    err = true;
}

if (!isChar(options.name)) {
    sb.appendLine("- The Project Name only accepts letters.");
    err = true;
}


if (err) {
    console.log("Please, check the following errors (nobel -h or nobel --help for the User Guide)");
    console.log(sb.toString());
    return;
}


if (options.installLibraries!=null) {

    if (!fs.existsSync(options.installLibraries)) {
        console.log("ERR: "+ options.installLibraries+" does not exist. Libraries installation is skipped");
        return;
    }


    installDependency(options.installLibraries, "arduino_nobel_resource");
    installDependency(options.installLibraries, "Flash");
    installDependency(options.installLibraries, "Webduino");

}

function installDependency(libFolder, dependencyName) {

    if (!fs.existsSync(path.join(libFolder, dependencyName))) {
        fs.copyRecursive(path.join(__dirname, 'arduinoModules', dependencyName), path.join(libFolder, dependencyName),
            function(e) {
                if (e) {
                    console.log(e);
                } else {
                    fs.unlinkSync(path.join(libFolder, dependencyName,'.git'));
                    console.log("INFO: " + dependencyName + " was successfully installed");
                }

            }
        );
    } else {
        console.log("INFO: Omitting "+ dependencyName +" because it was already installed");
    }

}

var targetFolder = options.target || process.cwd();
if (fs.existsSync(targetFolder)) {
    console.log("WARN: The target "+ targetFolder +" folder already exists");
} else {
    fs.mkdirSync(targetFolder)
    console.log("INFO: Creating" + targetFolder);
}

targetFolder = path.join(targetFolder, options.name);

if (fs.existsSync(targetFolder)) {
    if(fs.readdirSync(targetFolder).length > 0) {
        console.log("ERR: The project "+ targetFolder +" already exists and it's not empty");
        return;
    } else {
        console.log("WARN: The project folder"+ targetFolder +" already exists but it' empty. The new project will reuse this folder");
    }
} else {
    fs.mkdirSync(targetFolder)
    console.log("INFO: Creating project folder" + targetFolder);
}

options.target = targetFolder;


scaffolder = new Scaffolder();
scaffolder.generate(options);

function isChar(str) {
    return /^[a-zA-Z]+$/.test(str);
}