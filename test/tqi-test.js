'use strict';

const pkg = require('./../package.json'),
  Tqi = require('./../src/tqi'),
  chai = require('chai'),
  path = require('path'),
  fs = require('fs'),
  expect = chai.expect;

var tqi = new Tqi(),
  enBig = fs.readFileSync(path.resolve(__dirname + '/data/en-big.txt'), 'utf8');

describe(pkg.name + '/src/tqi.js', function () {
  describe('#Constructor', function () {
    it('Must have defaults path in .dic & .aff', () => {
      expect(tqi._dic).to.be.a('string');
      expect(tqi._aff).to.be.a('string');
    });
    it('Dic\'s path from constructor should exist', function (done) {
      fs.access(tqi._dic, fs.R_OK, (err) => {
        expect(err).to.be.null;
        done();
      });
    });
    it('Aff\'s path from constructor should exist', function (done) {
      fs.access(tqi._aff, fs.R_OK, (err) => {
        expect(err).to.be.null;
        done();
      });
    });
  });
  describe('#Analyze', function () {
    this.timeout(5500);
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
    })
  });
});