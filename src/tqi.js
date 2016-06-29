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
    this._langs = langs,
    this._dicts = {};

    // Lang is string & mapping with lang exists
    if(typeof this._langs === "string"){
      this._langs = mappingLang[langs] ? this._langs : "en";
    }

    // Ther is sublangues
    mappingLang[this._langs].path.forEach(function (subLang) {
      getSubdictionnaries(subLang);
    });

    function getSubdictionnaries(subLang){
      try {
        self._dicts[subLang] = {};
        self._dicts[subLang].dic = fs.readFileSync(path.resolve( __dirname + '/../node_modules/dictionaries/' + (subLang + ".dic") ));
        self._dicts[subLang].aff = fs.readFileSync(path.resolve( __dirname + '/../node_modules/dictionaries/' + (subLang + ".aff") ));
      }catch(err){
        throw new Error("Cannot read : ", err);
      }
    }

  }

  analyze(text,options) {
    const tokens = tokenizer.tokenize(text);
    const dictionaries = Object.keys(this._dicts);
    const firstDict = this._dicts[dictionaries[0]];
    var dict = new nodehun(firstDict.aff, firstDict.dic);
    delete this._dicts[dictionaries[0]];
    
    // There is subdictionnaries to used
    if(dictionaries.length){
      console.log(dictionaries)
      async.forEachOf(this._dicts, function(val,subLang,arr){
        console.log("sublang : " , subLang , " val " , val)
      })
    }

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

var e =  new Tqi("pt")
e.analyze("Un petit bouldog anglais").then(function(result){
  console.log("result : ", result);
});

module.exports = Tqi;
