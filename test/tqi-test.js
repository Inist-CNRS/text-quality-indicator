'use strict';

const pkg = require('./../package.json'),
  Tqi = require('./../src/tqi'),
  chai = require('chai'),
  path = require('path'),
  fs = require('fs'),
  expect = chai.expect;


var tqi = new Tqi(),
  enBig = fs.readFileSync(path.resolve(__dirname + '/data/en-big.txt'), 'utf8'),
  emptyFile = fs.readFileSync(path.resolve(__dirname + '/data/empty-file.txt'), 'utf8');


describe(pkg.name + '/src/tqi.js', function () {
  describe('#Constructor', function () {
    it('Dictionaries have to be in node_modules', function (done) {
      fs.access(path.resolve("node_modules/dictionaries/"), fs.R_OK, (err) => {
        expect(err).to.be.null;
        done();
      });
    });
    it('Must throw error when bad path .dic sent', function (done) {
      try {
        var badTqi = new Tqi(null,'a/very/bad/path.dic');
      } catch(error) {
          done();
      }
    });
    it('Must throw error when bad path .aff sent', function (done) {
      try {
        var badTqi = new Tqi(null,null,'a/very/bad/path.dic');
      } catch(error) {
          done();
      }
    });
    it('Must have English as default language', () => {
      expect(tqi._langs).to.be.a('string');
      expect(tqi._langs).to.be.eql('en');
    });
    it('Dictionary from constructor should exist', function (done) {
      expect(tqi._firstDict).to.have.property('dic');
      expect(tqi._firstDict).to.have.property('aff');
      done()
    });
  });
  describe('#Analyze', function () {
    this.timeout(6900);
    it('Analyze must return an object "result"', function (done) {
      tqi.analyze(enBig).then((result) => {
        expect(result).to.have.property("valid");
        expect(result.valid).to.be.a("number");
        expect(result).to.have.property("error");
        expect(result.error).to.be.a("number");
        expect(result).to.have.property("rate");
        expect(result.rate).to.be.a("number");
        done();
      }, (err) => {
        done(err);
      })
    });
    it('Analyze must return an object "result" even with an empty file', function (done) {
      tqi.analyze(emptyFile).then((result) => {
        expect(result).to.have.property("valid");
        expect(result.valid).to.be.a("number");
        expect(result).to.have.property("error");
        expect(result.error).to.be.a("number");
        expect(result).to.have.property("rate");
        expect(result.rate).to.be.a("number");
        done();
      }, (err) => {
        done(err);
      })
    });
    it('Analyze must return zero found result when bad language used', function (done) {
      tqi.analyze("chien poisson").then((result) => {
        expect(result.valid).to.be.eql(0);
        expect(result.error).to.be.eql(2);
        done();
      }, (err) => {
        done(err);
      })
    });

  });
});