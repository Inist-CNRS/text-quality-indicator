'use strict';

const natural = require('natural'),
  bluebird = require('bluebird'),
  fs = bluebird.promisifyAll(require('fs')),
  tokenizer = new natural.WordTokenizer(),
  dict = fs.readFileSync(__dirname + '/assets/dict/en/general.txt', 'utf8'),
  kuler = require('kuler');

fs.readFileAsync(__dirname + '/test/test.txt', 'utf8').then((text) => {
  // console.log(tokenizer.tokenize(text));
  return tokenizer.tokenize(text)
}).then((tokens) => {
  const result = {
    valid: 0,
    error: 0
  };
  tokens.forEach((word) => {
    const regex = new RegExp('\\b'+word+'\\b');

    if (dict.match(regex)) {
      console.log(word, kuler('OK', 'green'));
      result.valid++;
    } else {
      console.log(word, kuler('KO', 'red'))
      result.error++
    }
  });
  return result
}).then((result) => {
  console.log(Math.trunc(result.valid/(result.error+result.valid)*100) + "%");
});











