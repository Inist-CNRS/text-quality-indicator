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
  .option('-l, --lang <en>', 'Choose code lang (en by default)', 'en')
  .option('-w, --words <false>', 'If true, will show found/rest list of words (disable by default)', false)
  .parse(process.argv);


fs.statAsync(program.args[0]).catch((err) => {
  console.log(kuler('Input file/folder doesn\'t exist', 'red'));
  process.exit(1);
}).then((stats) => {
  const analyzeThisFile = (file) => {
    const options = { words : program.words };
    return fs.readFileAsync(file, 'utf8').then((data) => {
      const tqiDE = new Tqi(program.lang)
      return tqiDE.analyze(data,options);
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