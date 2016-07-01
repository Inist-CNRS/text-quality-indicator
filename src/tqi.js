'use strict';

const natural = require('natural'),
  fs = require('fs'),
  path = require('path'),
  async = require('async'),
  nodehun = require('nodehun'),
  mappingLang = require('./mappingLang');

class Tqi {

  constructor(langs, dic, aff) {
    var self = this;
    this._langs = langs;
    this._dicts = {};

    // Lang is string & mapping with lang exists
    if (typeof this._langs === "string") {
      this._langs = mappingLang[langs] ? this._langs : "en";
    }
    else {
      this._langs = "en"
    }

    // There isn't dic or aff sent
    if (!(dic || aff)) {
      // There is sublangues
      mappingLang[this._langs].path.forEach(function (subLang) {
        self.getDictionnaries(subLang);
      });
    }
    else {
      self.getDictionnaries(null, dic, aff);
    }

    // Load First dictionnary in nodeHun
    this._dictionaries = Object.keys(this._dicts);
    this._firstDict = this._dicts[this._dictionaries[0]];
    this._dict = new nodehun(this._firstDict.aff, this._firstDict.dic);

    //RM first dict already loaded
    delete this._dicts[this._dictionaries[0]];
    this._dictionaries.shift();

    // Regex tokenizer following lang sent
    this._langObj = mappingLang[this._langs];
    this._regex = (this._langObj.regex && (eval(this._langObj.regex) instanceof RegExp)) ?  eval(this._langObj.regex) : " ";
    this._tokenizer = new natural.WordTokenizer({ pattern: this._regex });
  }

  analyze(text, options) {
    
    var tokens = this._tokenizer.tokenize(text),
        self = this;
    options = options || {words: true};

    return new Promise((resolve, reject) => {

      // Load Multiple SubDictionnaries in NodeHun
      if (this._dictionaries.length) {
        for (var subLang in self._dicts) {
          self._dict.addDictionarySync(self._dicts[subLang].dic);
        }
      }

      const result = {
        valid: 0,
        error: 0,
        rate: 0,
        words: {
          found: [],
          rest: []
        }
      };

      async.each(tokens, (word, next) => {
        if (self._dict.isCorrectSync(word)) {
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
      //Do not want words list
      if (!options.words) {
        delete result.words;
      }
      return result;
    });
  }

  getDictionnaries(lang,dic,aff) {
    lang = lang || this._langs;
    console.log(lang , dic , aff)
    dic = dic || __dirname + '/../node_modules/dictionaries/' + (lang + ".dic");
    aff = aff || __dirname + '/../node_modules/dictionaries/' + (lang + ".aff");
    try {
      this._dicts[lang] = {};
      this._dicts[lang].dic = fs.readFileSync(path.resolve(dic));
      this._dicts[lang].aff = fs.readFileSync(path.resolve(aff));
    } catch (err) {
      throw new Error("Cannot read : ", err);
    }
  }
}

module.exports = Tqi;
