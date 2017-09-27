import { expect } from 'meteor/practicalmeteor:chai';
import Band from '/client/lib/drill/Band';
import Direction from '/client/lib/Direction';

describe('Band', function () {

    it('should have a members array upon construction', function () {
      var b = new Band();
      expect(b.members).to.be.an('array');
    })

  })