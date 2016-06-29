'use strict';

const natural = require('natural'),
  fs = require('fs'),
  path = require('path'),
  tokenizer = new natural.WordTokenizer(),
  async = require('async'),
  nodehun = require('nodehun'),
  mappingLang = require('./mappingLang');

class Tqi {

  constructor(langs, dic, aff) {
    var self = this;
    this._langs = langs;

    // Lang is string & mapping with lang exists
    if(typeof this._langs === "string"){
      this._langs = mappingLang[langs] ? langs.split() : ["en"];
    }

    // Array of languages sent
    if(Array.isArray(this._langs)){
      //Remove non-present mapping language
      self._langs.slice(0).forEach(function (lang) {
        if(!mappingLang[lang]){
          self._langs.splice(self._langs.indexOf(lang),1);
        }
      });
    }

    //Make sure there is always a language
    this._langs = (this._langs && this._langs.length) ? this._langs : ["en"];
    

    console.log(self._langs);
    this._dic0 = __dirname + '/../assets/dict-hunspell/' + this._langs[0] + '/' + this._langs + '.dic';
    this._aff0 = __dirname + '/../assets/dict-hunspell/' + this._langs[0] + '/' + this._langs + '.aff';
    
    // //CheckPaths
    // this._dic = path.resolve(this._dic);
    // this._aff = path.resolve(this._aff);
    // try {
    //   this._dicFile = fs.readFileSync(this._dic);
    //   this._affFile = fs.readFileSync(this._aff);
    // }catch(err){
    //   throw new Error("Cannot read : ", err);
    // }
  }

  analyze(text,options) {
    const tokens = tokenizer.tokenize(text);
    // const dict = new nodehun(this._affFile, this._dicFile);
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

var e =  new Tqi("ro");

module.exports = Tqi;
