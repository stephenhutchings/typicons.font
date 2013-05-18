var fs = require('fs');
var YAML = require('yamljs');

// RENAME FILES TO REMOVE ILLUSTRATOR NAME PREFIX
var renameSVGFiles = function(callback) {
  var svgPath = '../../src/svg';
  var textToRemove = 'typicons_';
  var SVGFiles = [];

  fs.readdir(svgPath, function(err, files){
    if (err) throw err;

    files.forEach(function(file){
      if (file == '.DS_Store') return;
      
      var newFile = file.replace(textToRemove, '');

      // Save new file name
      SVGFiles.push(newFile);

      fs.rename(svgPath + '/' + file, svgPath + '/' + newFile, function (err) {
        if (err) throw err;
      });
    })

    // Return callback with files
    callback(SVGFiles);
  })
}

// GENERATE GLYPHS.YAML
var generateYAML = function() {
  var uid = function(hyphen) {
    var s4 = function() {
      return Math.floor((1 + Math.random()) * 0x10000)
                 .toString(16)
                 .substring(1);
    };

    var _ = hyphen ? '-' : '';

    return s4() + s4() + _ + s4() + _ + s4() + _ +
           s4() + _ + s4() + s4() + s4();
  }

  renameSVGFiles(function(names){
    var glyphs = names.map(function(name, i){
      return {
        css: name.replace('.svg', ''),
        code: '0x' + (parseInt('E000',16) + i).toString(16),
        search: [],
        uid: uid()
      }
    })
    
    var config = YAML.load('meta.yml');
    config.glyphs = glyphs;

    var yaml = YAML.stringify(config, 10);

    fs.writeFile('../../config.yml', yaml, function(e){
      console.log('Processed ' + config.glyphs.length + ' glyphs');
      console.log('Saved ../../config.yml');
    });
  });
}

generateYAML();