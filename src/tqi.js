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
    this._dic = path.resolve(this._dic);
    this._aff = path.resolve(this._aff);
    try {
      this._dicFile = fs.readFileSync(this._dic);
      this._affFile = fs.readFileSync(this._aff);
    }catch(err){
      throw new Error("Cannot read : ", err);
    }
  }

  analyze(text,options) {
    const tokens = tokenizer.tokenize(text);
    const dict = new nodehun(this._affFile, this._dicFile);
    options = options || { words : true };

    return new Promise((resolve, reject) => {
      const result = {
        valid: 0,
        error: 0,
        rate: 0,
        words : {  
          found: [],
          rest : []
        }
      };

      async.each(tokens, (word, next) => {
        if (dict.isCorrectSync(word)) {
          result.words.found.push(word);
          result.valid++;
        } else {
          result.words.rest.push(word);
          result.error++;
        }
        next();
      }, (err) => {
        if (err) {
          reject(err);
        } else {
          resolve(result);
        }
      });
    }).then((result) => {
      const totalWords = result.valid + result.error;
      if (totalWords !== 0) {
        result.rate = result.valid / (result.error + result.valid) * 100;
      }
      //we do not want words list
      if(!options.words){
        delete result.words;
      }
      return result;
    });
  }
}

module.exports = Tqi;
