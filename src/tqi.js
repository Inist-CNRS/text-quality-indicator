'use strict';

const natural = require('natural'),
  fs = require('fs'),
  path = require('path'),
  tokenizer = new natural.WordTokenizer(),
  async = require('async'),
  nodehun = require('nodehun');

class Tqi {

  constructor(dic, aff) {
    this._dic = dic || __dirname + '/../assets/dict-hunspell/en/en_US.dic';
    this._aff = aff || __dirname + '/../assets/dict-hunspell/en/en_US.aff';
    //CheckPaths
    fs.access(this._dic, fs.R_OK, (err)=> {
      if (err) {
        throw new Error("Bad path : ", err);
      }
      this._dic = path.resolve(this._dic);
    });
    fs.access(this._aff, fs.R_OK, (err)=> {
      if (err) {
        throw new Error("Bad path : ", err);
      }
      this._aff = path.resolve(this._aff);
    });
  }

  analyze(text) {
    const tokens = tokenizer.tokenize(text);
    // TODO : Gérer les cas de chemins invalides vers les fichiers dic et aff
    const dict = new nodehun(fs.readFileSync(this._aff), fs.readFileSync(this._dic));
    const result = {
      valid: 0,
      error: 0,
      rate: 0
    };
    return new Promise((resolve, reject) => {
      async.each(tokens, (word, next) => {
        if (dict.isCorrectSync(word)) {
          result.valid++;
        } else {
          result.error++;
        }
        next();
      }
      , (err) => {
        if (err) {
          reject(err);
        }
        result.rate = result.valid / (result.error + result.valid) * 100;
        //Return result from module
        resolve(result);
      });
    });
  }
}

module.exports = Tqi;

// const tqi = new Tqi();
// console.time('test');
// tqi.analyze(fs.readFileSync(path.resolve(__dirname + '/../test/data/test2.txt'), 'utf8')).then((result) => {
//   console.timeEnd('test');
//   console.log(result);
// });
