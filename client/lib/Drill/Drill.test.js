import { chai, expect } from 'meteor/practicalmeteor:chai';
import Drill from '/client/lib/Drill/Drill';
import Band from '/client/lib/Drill/Band';

describe('Drill', function () {
    it('should have a band upon construction', function () {
      var d = new Drill();
      expect(d.band).to.be.an('object');
    })
  })