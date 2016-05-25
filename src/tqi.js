'use strict';

const natural = require('natural'),
  bluebird = require('bluebird'),
  fs = bluebird.promisifyAll(require('fs')),
  path = require('path'),
  tokenizer = new natural.WordTokenizer(),
  async = require('async'),
  nodehun = require('nodehun');

class Tqi {

  constructor(dic, aff) {
    this._dic = dic || __dirname + '/../assets/dict-hunspell/en/en_US.dic';
    this._aff = aff || __dirname + '/../assets/dict-hunspell/en/en_US.dic';
    //CheckPaths
    fs.access(this._dic,fs.R_OK,(err)=>{
      if(err){
        throw new Error("Bad path : ", err);
      }
      this._dic = path.resolve(this._dic);
    });
    fs.access(this._aff,fs.R_OK,(err)=>{
      if(err){
        throw new Error("Bad path : ", err);
        this._aff = path.resolve(this._aff);
      }
    });
  }

  analyze(text,callback) {
    const tokens = tokenizer.tokenize(text);
    // TODO : Gérer les cas de chemins invalides vers les fichiers dic et aff
    const dict = new nodehun(fs.readFileSync(this._aff), fs.readFileSync(this._dic));
    const result = {
      valid: 0,
      error: 0,
      rate: 0
    };

    async.each(tokens, (word,next) => {
      if (dict.isCorrectSync(word)) {
        result.valid++;
      } else {
        result.error++;
      }
      //next word
      next();
    } , (err) => {
      if(err){
        throw err;
      }
      result.rate = result.valid / (result.error + result.valid) * 100;
      //Return result from module
      callback(result);
    });
  }
}

module.exports = Tqi;
