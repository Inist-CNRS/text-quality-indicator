'use strict'

const pkg = require('./../package.json'),
  Tqi = require('./../src/tqi'),
  chai = require('chai'),
  fs = require('fs'),
  expect = chai.expect;

var tqio = new Tqi();

describe(pkg.name + '/src/tqi.js', () => {
  describe('#Constructor', () => {
    it('Must have defaults path in .dic & .aff', () => {
    	expect(tqio._dic).to.be.a('string');
    	expect(tqio._aff).to.be.a('string');
    });
    it('Paths from constructor should exist', () => {
    	var dic = fs.accessSync(tqio._dic, fs.R_OK);
    	var aff = fs.accessSync(tqio._dic, fs.R_OK);
    	expect(dic).to.be.equal(undefined);
    	expect(aff).to.be.equal(undefined);
    });
  });
});