const assert = require('chai').assert;
const Surfer = require('../lib/surfer');
const World = require('./world');

describe('Jump', function() {
  context('jump method and attributes', function () {
    it('should have a method called "jump()"', function () {
      var surfer = new Surfer({});
      assert.isFunction(surfer.jump);
    });

    it('"jump()" should decrement the "y" property by 70', function () {
      var surfer = new Surfer({y: 110});
      surfer.jump();
      assert.equal(surfer.y, 40);
    });

    it('should have a spacebarWasPressed() method', function () {
      var surfer = new Surfer({});
      assert.isFunction(surfer.spacebarWasPressed);
    });
  });
});