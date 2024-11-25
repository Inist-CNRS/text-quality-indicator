'use strict';

const spawn = require('child_process').spawn,
  mappingLang = require('./mappingLang'),
  Promise = require('bluebird'),
  fs = Promise.promisifyAll(require('fs')),
  xregexp = require('xregexp'),
  path = require('path'),
  options={wordsResult: false, timeout: 5};

class Tqi {
  constructor(dict) {
    this.dict = [dict];
    if (Array.isArray(dict)) this.dict = dict;
    if (dict === undefined) this.dict = ['en'];
    this.dict = this.getHunpsellDictionaries(this.dict);
    if (!this.dict || this.dict===[]) this.dict = ['en'];
  }

  analyze(fileTxt, opts) {
    const result = {
      correct: 0,
      misspelled: 0,
      rate: 0,
      words: {
        correct: [],
        misspelled: []
      }
    };
    if (opts && opts.wordsResult) options.wordsResult = opts.wordsResult;
    if (opts && opts.timeout) options.timeout = opts.timeout;

    return Promise.join(
      this.getCorrectWord(fileTxt),
      this.getmisspelledWord(fileTxt),
      this.getTotalToken(fileTxt),
      (correctWords, misspelledWords, totalToken) => {
        result.correct = correctWords.length;
        result.words.correct = correctWords;
        result.misspelled = misspelledWords.length;
        result.words.misspelled = misspelledWords;
        result.totalToken = totalToken;
        const totalWords = result.correct + result.misspelled;
        if (totalWords !== 0) {
          const quantity = 1 - (1 / Math.log10(totalToken + 10));
          const coverDictionnary = result.correct / totalWords;
          result.rate = 2 * 100 * quantity * coverDictionnary / (quantity + coverDictionnary);
        }
        if (!options.wordsResult) delete result.words;
        return result;
      }
    );
  }

  getTotalToken(fileTxt) {
    return fs.readFileAsync(fileTxt, 'utf8').then((content) => {
      const unicodePunctuation = xregexp("\\p{P}+");
      return xregexp.replace(content, unicodePunctuation, ' ', 'all')
        .split(/\s+/)
        .filter((token) => token !== '')
        .length
    })
  }

  getCorrectWord(fileTxt) {
    const dict = this.dict.join(',');
    const cmd = ['-G', '-d', dict, fileTxt];
    return this.spawnCmdHunspell(cmd)
  }

  getmisspelledWord(fileTxt) {
    const dict = this.dict.join(',');
    const cmd = ['-l', '-d', dict, fileTxt];
    return this.spawnCmdHunspell(cmd)
  }

  spawnCmdHunspell(args) {
    return new Promise((resolve, reject) => {
      const hunspellCmd = spawn('timeout',[options.timeout+'s','hunspell'].concat(args));
      let stdout = '';
      let stderr = '';
      hunspellCmd.stdout.on('data', (data) => {
        // console.log(data.toString())
        stdout += data.toString()
      });
      hunspellCmd.stderr.on('data', (data) => stderr += data.toString());
      hunspellCmd.on('error', reject);
      hunspellCmd.on('close', (code) => {
        // if (args[0] === '-G') fs.writeFileSync('output.txt', stdout);
        if (code === 0) {
          resolve(stdout.split('\n').filter((item) => item !== ''));
        } if (code === 124) {
          reject("Hunspell timeout, it can't finish to spell check "+args[args.length -1]);
        } else {
          reject(stderr);
        }
      })
    })
  }

  getHunpsellDictionaries(codesLang) {
    return codesLang.map((codeLang) => {
      //const dict = mappingLang.filter((dictLang) => dictLang.code === codeLang);
      const defaultProvider = mappingLang.defaultProvider;
      const dict = mappingLang.dictionaries[codeLang];
      if (dict) {
        return dict.path.map((pathDict) => {
          const dictProvidfer = dict.provider ? dict.provider : defaultProvider;
          let goodDictionnaryPath = path.normalize(__dirname + '/../lib/dictionaries/' + dictProvidfer + '/' + pathDict);
          if (pathDict.indexOf('./')===0) goodDictionnaryPath = path.normalize(path.join(__dirname,'..',pathDict));
          return goodDictionnaryPath;
        });
      } else {
        let dictPath = codeLang;
        if (!dictPath.endsWith('.dic')) dictPath += '.dic';
        try {
          fs.accessSync(dictPath, fs.constants.R_OK) ;
          return [codeLang];
        } catch (e) {
          return [];
        }

      }
    }).reduce((previous, current) => {
      return previous.concat(current);
    }, []);
  }
}

module.exports = Tqi;
