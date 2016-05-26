#!/usr/bin/env node

"use strict";

const Tqi = require('./../src/tqi'),
  bluebird = require('bluebird'),
  fs = bluebird.promisifyAll(require('fs')),
  isBinaryFile = require('isbinaryfile'),
  kuler = require('kuler'),
  pkg = require('./../package.json'),
  path = require('path'),
  program = require('commander'),
  async = require('async');

program
  .version(pkg.version)
  .usage('[options] <file>')
  .option('-l, --lang <en>', 'Choose en, de ou fr langage (en by default)', 'en')
  .parse(process.argv);

fs.statAsync(program.args[0]).catch((err) => {
  console.log(kuler('Input file doesn\'t exist', 'red'));
  process.exit(1)
}).then((stats) => {
  if (stats.isFile()) {
    if (!isBinaryFile.sync(program.args[0])) {
      return fs.readFileAsync(path.resolve(program.args[0]), 'utf8')
    } else {
      console.log(kuler('This isn\'t a ASCII file', 'red'));
      process.exit(1)
    }
  } else {
    console.log(kuler('This isn\'t a file', 'red'));
    process.exit(1)
  }
}).then((data) => {
  switch (program.lang) {
    case "de":
      const tqiDE = new Tqi(__dirname + '/../assets/dict-hunspell/de/de_DE_frami.dic', __dirname + '/../assets/dict-hunspell/de/de_DE_frami.aff');
      return tqiDE.analyze(data);
      break;
    case "fr":
      const tqiFR = new Tqi(__dirname + '/../assets/dict-hunspell/fr_FR/fr.dic', __dirname + '/../assets/dict-hunspell/fr_FR/fr.aff');
      return tqiFR.analyze(data);
      break;
    case "en":
      const tqiEN = new Tqi();
      return tqiEN.analyze(data);
      break;
    default:
      console.log(kuler('Wrong code lang', 'red'));
      process.exit(1)
  }
}).then((result) => {
  console.log(program.args[0], "=>", result);
});
