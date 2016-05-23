'use strict';

const natural = require('natural'),
  bluebird = require('bluebird'),
  fs = bluebird.promisifyAll(require('fs')),
  tokenizer = new natural.WordTokenizer(),
  dict = fs.readFileSync(__dirname + '/assets/dict/en/general.txt', 'utf8');

fs.readFileAsync(__dirname + '/test/test.txt', 'utf8').then((text) => {
  // console.log(tokenizer.tokenize(text));
  return tokenizer.tokenize(text)
}).then((tokens) => {
  const result = {
    valid: 0,
    error: 0
  };
  tokens.forEach((word) => {
    const regex = new RegExp('\\n'+word+'\\n');

    if (dict.match(regex)) {
      console.log(word, ': OK');
      result.valid++;
    } else {
      console.log(word, ': NO good !')
      result.error++
    }
  });
  return result
}).then((result) => {
  console.log(result)
});











