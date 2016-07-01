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
    this._dicts = {};

    // Lang is string & mapping with lang exists
    if (typeof this._langs === "string") {
      this._langs = mappingLang[langs] ? this._langs : "en";
    }
    else {
      this._langs = "en"
    }

    if (!dic || !aff) {
      // There is sublangues
      mappingLang[this._langs].path.forEach(function (subLang) {
        self.getSubdictionnaries(subLang);
      });
    }
    else {
      try {
        self._dicts[this._langs] = {};
        self._dicts[this._langs].dic = fs.readFileSync(path.resolve(dic));
        self._dicts[this._langs].aff = fs.readFileSync(path.resolve(aff));
      } catch (err) {
        throw new Error("Cannot open dic sent : ", err);
      }
    }

    this._dictionaries = Object.keys(this._dicts);
    this._firstDict = this._dicts[this._dictionaries[0]];
    this._dict = new nodehun(this._firstDict.aff, this._firstDict.dic);

    //RM first dict already loaded
    delete this._dicts[this._dictionaries[0]];
    this._dictionaries.shift();
  }

  analyze(text, options) {
    const tokens = tokenizer.tokenize(text);
    var self = this;
    options = options || {words: true};

    return new Promise((resolve, reject) => {

      // Multiple dictionnaries
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
      //we do not want words list
      if (!options.words) {
        delete result.words;
      }
      return result;
    });
  }

  getSubdictionnaries(subLang) {
    try {
      this._dicts[subLang] = {};
      this._dicts[subLang].dic = fs.readFileSync(path.resolve(__dirname + '/../node_modules/dictionaries/' + (subLang + ".dic")));
      this._dicts[subLang].aff = fs.readFileSync(path.resolve(__dirname + '/../node_modules/dictionaries/' + (subLang + ".aff")));
    } catch (err) {
      throw new Error("Cannot read : ", err);
    }
  }
}

var e =  new Tqi("en");
e.analyze("A little cat with a black color and maybe a colour abridgement").then(function(result){
  console.log("result : ", result);
});

module.exports = Tqi;
