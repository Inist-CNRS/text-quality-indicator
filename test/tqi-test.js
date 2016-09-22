'use strict';

const pkg = require('./../package.json'),
  Tqi = require('./../src/tqi'),
  fs = require('fs'),
  chai = require('chai'),
  expect = chai.expect;


const tqi = new Tqi(),
  emptyFile = __dirname + '/data/empty-file.txt',
  frSample = __dirname + '/data/fr-sample.txt';


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
      })
    })
  });

  describe('#getMispelledWord', function () {
    it('should return a total of mispelled word', function () {
      return tqi.getMispelledWord(frSample).then((result) => {
        expect(result).to.be.an("array");
      })
    })
  });

  describe('#analyze', function () {
    it('should return an object "result"', function () {
      return tqi.analyze(frSample).then((result) => {
        expect(result).to.have.property("correct");
        expect(result.correct).to.be.a("number");
        expect(result).to.have.property("mispelled");
        expect(result.mispelled).to.be.a("number");
        expect(result).to.have.property("rate");
        expect(result.rate).to.be.a("number");
      })
    });

    it('should return an object "result" even with an empty file', function () {
      return tqi.analyze(emptyFile).then((result) => {
        expect(result).to.have.property("correct");
        expect(result.correct).to.be.a("number");
        expect(result).to.have.property("mispelled");
        expect(result.mispelled).to.be.a("number");
        expect(result).to.have.property("rate");
        expect(result.rate).to.be.a("number");
      })
    })
  });

  describe('#spawnCmdHunspell', function () {
    it('should return an object "result"', function () {
      return tqi.spawnCmdHunspell(['-G', frSample]).then((result) =>{
        expect(result).to.be.an("array");
      })
    })
  });
});