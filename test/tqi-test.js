'use strict';

const pkg = require('./../package.json'),
  Tqi = require('./../src/tqi'),
  fs = require('fs'),
  path = require('path'),
  chai = require('chai'),
  expect = chai.expect;


const tqi = new Tqi(),
  emptyFile = __dirname + '/data/empty-file.txt',
  frSample = __dirname + '/data/fr-sample.txt',
  enSample = __dirname + '/data/en-sample.txt',
  laSample = __dirname + '/data/la-sample.txt';


describe(pkg.name + '/src/tqi.js', function () {
  describe('#constructor', function () {
    it('should initialize dictionnary', function () {
      expect(tqi.dict).to.be.an('array')
    })
  });

  describe('#getCorrectWord', function () {
    it('should return a total of correct word', function () {
      return tqi.getCorrectWord(frSample).then((result) => {
        expect(result).to.be.an("array");
        expect(result.length).to.be.above(70)
      })
    })
  });

  describe('#getmisspelledWord', function () {
    it('should return a total of misspelled word', function () {
      return tqi.getmisspelledWord(frSample).then((result) => {
        expect(result).to.be.an("array");
        expect(result.length).to.be.below(150)
      })
    })
  });

  describe('#getTotalToken', function () {
    it('should return total of token from a french text', function () {
      return tqi.getTotalToken(frSample).then((result) => {
        expect(result).to.be.a("number");
        expect(result).to.be.above(200);
      })
    });

    it('should return total of token from an english text', function () {
      return tqi.getTotalToken(enSample).then((result) => {
        expect(result).to.be.a("number");
        expect(result).to.be.above(200)
      })
    })
  });

  describe('#analyze', function () {
    it('should return an object "result"', function () {
      return tqi.analyze(frSample, {wordsResult:true}).then((result) => {
        expect(result).to.have.property("correct");
        expect(result.correct).to.be.a("number");
        expect(result).to.have.property("misspelled");
        expect(result.misspelled).to.be.a("number");
        expect(result).to.have.property("rate");
        expect(result.rate).to.be.a("number");
      })
    });

    it('should return an object "result" even with an empty file', function () {
      return tqi.analyze(emptyFile).then((result) => {
        expect(result).to.have.property("correct");
        expect(result.correct).to.be.a("number");
        expect(result).to.have.property("misspelled");
        expect(result.misspelled).to.be.a("number");
        expect(result).to.have.property("rate");
        expect(result.rate).to.be.a("number");
      })
    });

    it('should return an object "result" with the words correct and misspelled', function () {
      return tqi.analyze(frSample, {wordsResult:true}).then((result) => {
        expect(result).to.have.property("correct");
        expect(result.correct).to.be.a("number");
        expect(result).to.have.property("misspelled");
        expect(result.misspelled).to.be.a("number");
        expect(result).to.have.property("rate");
        expect(result.rate).to.be.a("number");
        expect(result).to.have.property("words");
        expect(result.words.correct).to.be.an('array');
        expect(result.words.misspelled).to.be.an('array');
      })
    })
    
    it('should return an object "result" with some good metrics for an english text with a latin dictionnary', function () {
      const latinTqi = new Tqi("./lib/dictionnaries/la/la");
      return latinTqi.analyze(enSample).then((result) => {
        expect(result).to.have.property("correct");
        expect(result.correct).to.be.a("number");
        expect(result).to.have.property("misspelled");
        expect(result.misspelled).to.be.a("number");
        expect(result).to.have.property("rate").to.be.lessThan(60);      
        expect(result).to.have.property("rate");
        expect(result.rate).to.be.a("number");
      });
    });

    it('should return an object "result" with some good metrics for a latin text with a latin dictionnary', function () {
      const latinTqi = new Tqi("./lib/dictionnaries/la/la");
      
      return latinTqi.analyze(laSample).then((result) => {
        expect(result).to.have.property("correct");
        expect(result.correct).to.be.a("number");
        expect(result).to.have.property("misspelled");
        expect(result.misspelled).to.be.a("number");
        expect(result).to.have.property("rate").to.be.greaterThan(60);      
        expect(result).to.have.property("rate");
        expect(result.rate).to.be.a("number");
      })
    });

  });



  // TODO ajouter le dictionnaire FR pour le test
  describe('#spawnCmdHunspell', function () {
    it('should return an object "result"', function () {
      return tqi.spawnCmdHunspell(['-d', __dirname + '/../node_modules/dictionaries/fr_FR/fr', '-G', frSample]).then((result) =>{
        expect(result).to.be.an("array");
      })
    })
  });

  describe('#getHunpsellDictionnaries', function () {
    it('should return an array with the dictionnaries\'s path', function () {
      const anotherDictionnary = path.join(__dirname,"data/another-dictionnary");
      const anotherOtherDictionnary = "./lib/dictionnaries/la/la";
      const listDict = tqi.getHunpsellDictionnaries(['en', 'fr', '/path/to/another/dictionnary',anotherDictionnary,anotherOtherDictionnary]);
      expect(listDict).to.include(path.normalize(__dirname + '/../node_modules/dictionaries/en/en_US'));
      expect(listDict).to.include(path.normalize(__dirname + '/../node_modules/dictionaries/en/en_CA'));
      expect(listDict).to.include(path.normalize(__dirname + '/../node_modules/dictionaries/en/en_GB'));
      expect(listDict).to.include(path.normalize(__dirname + '/../node_modules/dictionaries/fr_FR/fr'));
      expect(listDict).to.not.include(path.normalize('/path/to/another/dictionnary'));
      expect(listDict).to.include(path.normalize(anotherDictionnary));
    })
  });
});
