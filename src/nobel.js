var ArgumentParser = require ('argparse').ArgumentParser;
var Scaffolder = require('./scaffolder');

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
        help: 'The target directory where the generated code will be placed\n' +
            'Note: In this version, no merge will be done, If you have an existing code, it will be overwritten'
    }
);

parser.addArgument(
    [ '-n', '--name' ],
    {
        help: 'The generated project name. If completed, a subfolder with this name will be generated under "target"'
    }
);


// TODO look at the folder and project name. Check it' valid
// Option for generating one method per resource with case, or one method per resource + method

options = parser.parseArgs();
if (options.target!=null && options.source!=null) {

scaffolder = new Scaffolder();
scaffolder.generate(options);

} else {
    console.log("Hey!!! You need to pass source and target!");
}

