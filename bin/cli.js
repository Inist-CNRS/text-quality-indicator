#!/usr/bin/env node

"use strict";

const Tqi = require('./../src/tqi'),
  bluebird = require('bluebird'),
  fs = bluebird.promisifyAll(require('fs')),
  kuler = require('kuler'),
  pkg = require('./../package.json'),
  path = require('path'),
  program = require('commander'),
  glob = require('glob'),
  async = require('async');

program
  .version(pkg.version)
  .usage('[options] <file.txt>')
  .option('-l, --lang <en>', 'Choose en, de ou fr langage (en by default)', 'en')
  .option('-w, --words <false>', 'If true, will show found/rest list of words (disable by default)', false)
  .parse(process.argv);


fs.statAsync(program.args[0]).catch((err) => {
  console.log(kuler('Input file/folder doesn\'t exist', 'red'));
  process.exit(1);
}).then((stats) => {
  const analyzeThisFile = (file) => {
    const options = { words : program.verbose };
    return fs.readFileAsync(file, 'utf8').then((data) => {
      switch (program.lang) {
        case "de":
          const tqiDE = new Tqi(__dirname + '/../assets/dict-hunspell/de/de_DE_frami.dic', __dirname + '/../assets/dict-hunspell/de/de_DE_frami.aff');
          return tqiDE.analyze(data,options);
          break;
        case "fr":
          const tqiFR = new Tqi(__dirname + '/../assets/dict-hunspell/fr_FR/fr.dic', __dirname + '/../assets/dict-hunspell/fr_FR/fr.aff');
          return tqiFR.analyze(data,options);
          break;
        case "en":
          const tqiEN = new Tqi();
          return tqiEN.analyze(data,options);
          break;
        default:
          console.log(kuler('Wrong code lang', 'red'));
          process.exit(1)
      }
    })
  };

  if (stats.isFile()) {
    const input = path.resolve(program.args[0]);
    analyzeThisFile(input).then((result) => {
      console.log(path.basename(input), "=>", result);
    });
  } else {
    const total = {valid: 0, error: 0, rate: 0},
      input = path.resolve(program.args[0], "**/*.txt"),
      arrayFiles = glob.sync(input);

    async.each(arrayFiles, (file, next) => {
      analyzeThisFile(file).then((result) => {
        total.valid += result.valid;
        total.error += result.error;
        console.log(path.basename(file), "=>", result);
        next();
      });
    }, (err) => {
      if (arrayFiles.length !== 1) {
        total.rate = total.valid / (total.error + total.valid) * 100;
        console.log("total =>", total);
      }
    });
  }
});