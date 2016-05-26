const Tqi = require('./src/tqi'),
	fs = require('fs'),
  path = require('path'),
  kuler = require('kuler'),
  args = require('args'),
  async = require('async');

var tqi = new Tqi();

const options = args.Options.parse([
  {
    name: 'help',
    shortName: 'h',
    help: 'Get Help',
    defaultValue : null,
    type : "bool",
    required : false
  },
  {
    name: 'input',
    shortName: 'i',
    help: 'Input folder or txt file',
    defaultValue : null,
    required : true
  },
  {
    name: 'dic',
    shortName: 'd',
    help: 'Path of a classic dictionnary file',
    defaultValue : null,
    required : false
  },
  {
    name: 'aff',
    shortName: 'a',
    help: 'Path of an affix dictionnary',
    defaultValue : null,
    required : false
  },
  {
    name: 'log',
    shortName: 'l',
    help: 'Log all results into log file',
    defaultValue : 'log.txt',
    required : false
  }
]);

/* ----------- */
/*  CHECK ARGS */
/* ----------- */

const parsed = args.parser(process.argv).parse(options);


if(parsed.help){
  // shows help 
  console.info(options.getHelp());
  return;
}

if(!parsed.input){
  console.info(kuler('Please indicate Input folder or txt file , see help' , 'red'));
  return;
}

/* ----------- */
/*  EXECUTION  */
/* ----------- */

fs.stat(parsed.input, (err,stats)=>{
  if(err){
    console.info(kuler('Input file/folder does not exist', 'red'));
    return;
  }

  // If it's an existing file.
  if(stats.isFile()){
    console.log(kuler('File detected : \r'  , 'cyan'));
    fs.readFile(path.resolve(parsed.input), 'utf8', (err,data)=>{
      tqi.analyze(data).then((result) => {
        console.log(parsed.input , "=>", result);
      });
    });
  }
  // If it's an existing file.
  if(stats.isDirectory()){
    const filesResults = {
      valid : 0,
      error : 0,
      rate : 0,
      nbOfFiles : 0
    };
    console.log(kuler('Folder detected ... \r' , 'cyan'));
    fs.readdir(parsed.input, (err, files) =>{
      async.each(files, (file,next) =>{
        var pathFile  = path.resolve(parsed.input + '/' + file);
        fs.readFile(pathFile, 'utf8', (err,data)=>{
          tqi.analyze(data).then((result) => {
            filesResults.valid += result.valid;
            filesResults.error += result.error;
            var subResult = file + '=>' + JSON.stringify(result) + '\n';
            fs.appendFile(parsed.log, subResult , (err) =>{
              if(!err){  
                console.log(file , '=>', result);
                filesResults.nbOfFiles++;
                return next();
              }
              console.error(err);
            });
          });
        });
      },(err) =>{
        filesResults.rate = filesResults.valid / (filesResults.error + filesResults.valid) * 100;
        fs.appendFile(parsed.log, JSON.stringify(filesResults) + '\n' , (err) =>{
          if(!err){  
            console.info(kuler('Number of files processed : ' + filesResults.nbOfFiles + ', rate : ' +  filesResults.rate + '%', 'green'));
          }
        });
      });
    }); 
  }
});