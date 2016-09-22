'use strict';

const spawn = require('child_process').spawn;

class Tqi {
  constructor(dict) {
    this.dict = [dict];
    if (Array.isArray(dict)) this.dict = dict;
    if (dict === undefined) this.dict = ['en_US'];
  }

  analyze(fileTxt) {
    const result = {
      correct: 0,
      mispelled: 0,
      rate: 0,
      words: {
        correct: [],
        mispelled: []
      }
    };

    return this.getCorrectWord(fileTxt).then((correctWords) => {
      result.correct = correctWords.length;
      result.words.correct = correctWords;
      return this.getMispelledWord(fileTxt)
    }).then((mispelledWords) => {
      result.mispelled = mispelledWords.length;
      result.words.mispelled = mispelledWords;
      const totalWords = result.correct + result.mispelled;
      if (totalWords !== 0) {
        result.rate = result.correct / totalWords * 100;
      }
      return result;
    })
  }

  getCorrectWord(fileTxt) {
    const dict = this.dict.join(',');
    const cmd = ['-G', '-d ' + dict, fileTxt];
    return this.spawnCmdHunspell(cmd)
  }

  getMispelledWord(fileTxt) {
    const dict = this.dict.join(',');
    const cmd = ['-l', '-d ' + dict, fileTxt];
    return this.spawnCmdHunspell(cmd)
  }

  spawnCmdHunspell(args) {
    return new Promise((resolve, reject) => {
      const hunspellCmd = spawn('hunspell', args);
      let stdout = '';
      let stderr = '';
      hunspellCmd.stdout.on('data', (data) => stdout = data.toString());
      hunspellCmd.stderr.on('data', (data) => stderr = data.toString());
      hunspellCmd.on('error', reject);
      hunspellCmd.on('close', (code) => {
        if (code === 0) {
          resolve(stdout.split('\n').filter((item) => item !== ''));
        } else {
          reject(stderr);
        }
      })
    })
  }
}

module.exports = Tqi;
