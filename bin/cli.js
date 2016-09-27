#!/usr/bin/env node

"use strict";

const Tqi = require('./../src/tqi'),
  bluebird = require('bluebird'),
  fs = bluebird.promisifyAll(require('fs')),
  kuler = require('kuler'),
  pkg = require('./../package.json'),
  path = require('path'),
  program = require('commander'),
  glob = require('glob');

program
  .version(pkg.version)
  .usage('[options] <file.txt>')
  .option('-d, --dict <en>', 'Choose a dictonnary with a langage\'s code (en, de ou fr) or a path to your dictionnary (en by default)', 'en')
  .option('-w, --words', 'If true, will show list of correct/misspelled words (disable by default)')
  .parse(process.argv);

fs.statAsync(program.args[0]).catch((err) => {
  console.log(kuler('Input file/folder doesn\'t exist', 'red'));
  process.exit(1);
}).then((stats) => {
  const dict = program.dict.split(',');
  const tqi = new Tqi(dict);
  const options = { wordsResult : program.words !== undefined };
  if (stats.isFile()) {
    const input = path.resolve(program.args[0]);
    tqi.analyze(input, options)
      .then((result) => console.log(path.basename(input), "=>", result))
      .catch((error) => console.log(error))
  } else if (stats.isDirectory()) {
    const total = {correct: 0, misspelled: 0, rate: 0},
      input = path.resolve(program.args[0], "**/*.txt"),
      arrayFiles = glob.sync(input);

    bluebird.map(arrayFiles, (file) => {
      return tqi.analyze(file, options).then((result) => {
        total.correct += result.correct;
        total.misspelled += result.misspelled;
        console.log(path.basename(file), "=>", result);
      });
    }).then(() => {
      console.log("total =>", total);
    })
  } else {
    console.log('what are you trying to do ?');
  }
});
