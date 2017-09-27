import { expect } from 'meteor/practicalmeteor:chai';
import Member from '/client/lib/drill/Member';
import Direction from '/client/lib/Direction';

describe('Member', function () {

    it('should have a script script upon construction', function () {
      var m = new Member();
      expect(m.script).to.be.an('array');
    })

  })
