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
      this._langs = mappingLang[langs] ? langs.split() : ["en"];
    }

    // Array of languages sent
    if(Array.isArray(this._langs)){
      //Remove non-present mapping language
      self._langs.slice(0).forEach(function (lang) {
        if(!mappingLang[lang]){
          self._langs.splice(self._langs.indexOf(lang),1);
          return;
        }
        getSubdictionnaries(lang);    
      });
    }

    //Make sure there is always a language
    if(!this._langs || !this._langs.length){
      getSubdictionnaries("en"); 
    }

    function getSubdictionnaries(lang){
      mappingLang[lang].path.forEach(function(subDic){
        try {
          self._dicts[subDic] = {};
          self._dicts[subDic].dic = fs.readFileSync(path.resolve( __dirname + '/../node_modules/dictionaries/' + (subDic + ".dic") ));
          self._dicts[subDic].aff = fs.readFileSync(path.resolve( __dirname + '/../node_modules/dictionaries/' + (subDic + ".aff") ));
        }catch(err){
          throw new Error("Cannot read : ", err);
        }
      });
    }

  }

  analyze(text,options) {
    const tokens = tokenizer.tokenize(text);
    const dictionaries = Object.keys(this._dicts);
    const firstDict = this._dicts[dictionaries[0]];
    var dict = new nodehun(firstDict.aff, firstDict.dic);

    if(dictionaries.length > 1){
      async.forEachOf(this._dicts,function(val,lang,cb){
        console.log("lang : " ,lang  , val.dic)
        //dic.addDictionary(this._dicts[lang].dic,)
      });
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

// var e =  new Tqi(["ru","ro","en"])
// e.analyze("Un petit bouldog anglais").then(function(result){
//   console.log("result : ", result);
// });

module.exports = Tqi;
