import { expect } from 'meteor/practicalmeteor:chai';
import Direction from '/client/lib/Direction';

describe('Direction', function () {

    it('N should equal 0 degrees', function() {
        expect(Direction.N).to.equal(0);
      })
    
    it('E should equal 90 degrees', function() {
        expect(Direction.E).to.equal(90);
    })

    it('S should equal 180 degrees', function() {
        expect(Direction.S).to.equal(180);
    })

    it('W should equal 270 degrees', function() {
        expect(Direction.W).to.equal(270);
    })
        
    it('NE should equal 45 degrees', function() {
        expect(Direction.NE).to.equal(45);
      })
    
    it('SE should equal 135 degrees', function() {
        expect(Direction.SE).to.equal(135);
    })

    it('SW should equal 225 degrees', function() {
        expect(Direction.SW).to.equal(225);
    })

    it('NW should equal 315 degrees', function() {
        expect(Direction.NW).to.equal(315);
    })
})
  