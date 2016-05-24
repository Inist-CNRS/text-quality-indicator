'use strict';

const natural = require('natural'),
  bluebird = require('bluebird'),
  fs = bluebird.promisifyAll(require('fs')),
  tokenizer = new natural.WordTokenizer(),
  kuler = require('kuler');


fs.readFileAsync(__dirname + '/test/test.txt', 'utf8').then((text) => {
  // console.log(tokenizer.tokenize(text));
  return tokenizer.tokenize(text)
}).then((tokens) => {
  const dict = fs.readFileSync(__dirname + '/assets/dict/en/general.txt', 'utf8'),
    result = {
      valid: 0,
      error: 0
    };
  tokens.forEach((word) => {
    const regex = new RegExp('\\b' + word + '\\b');

    if (dict.match(regex)) {
      // console.log(word, kuler('OK', 'green'));
      result.valid++;
    } else {
      // console.log(word, kuler('KO', 'red'));
      result.error++
    }
  });
  return result
}).then((result) => {
  console.log('quality text :', Math.trunc(result.valid / (result.error + result.valid) * 100) + "%");
});


// With nodehun + dictionnaries from LibreOffice

const nodehun = require('nodehun');

fs.readFileAsync(__dirname + '/test/test.txt', 'utf8').then((text) => {
  // console.log(tokenizer.tokenize(text));
  return tokenizer.tokenize(text)
}).then((tokens) => {
  const dict = new nodehun(fs.readFileSync(__dirname + '/assets/dict-hunspell/en/en_US.aff'), fs.readFileSync(__dirname + '/assets/dict-hunspell/en/en_US.dic'));
  const result = {
    valid: 0,
    error: 0
  };

  tokens.forEach((word) => {
    if (dict.isCorrectSync(word)) {
      // console.log(word, kuler('OK', 'green'));
      result.valid++;
    } else {
      // console.log(word, kuler('KO', 'red'));
      result.error++
    }
  });
  return result
}).then((result) => {
  console.log('quality text with nodehun + dictionnaries from LibreOffice :', Math.trunc(result.valid / (result.error + result.valid) * 100) + "%");
});







