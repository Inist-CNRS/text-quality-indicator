'use strict';

const natural = require('natural'),
  bluebird = require('bluebird'),
  fs = bluebird.promisifyAll(require('fs')),
  tokenizer = new natural.WordTokenizer(),
  nodehun = require('nodehun');

class Tqi {
  constructor(dic, aff) {
    this._dic = dic || __dirname + '/../assets/dict-hunspell/en/en_US.dic';
    this._aff = aff || __dirname + '/../assets/dict-hunspell/en/en_US.aff';
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

    tokens.forEach((word) => {
      if (dict.isCorrectSync(word)) {
        result.valid++;
      } else {
        result.error++
      }
    });
    result.rate = result.valid / (result.error + result.valid) * 100;
    return result
  }
}

module.exports = Tqi;
