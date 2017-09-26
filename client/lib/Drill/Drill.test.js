import { chai } from 'meteor/practicalmeteor:chai';
import Drill from '/client/lib/Drill/Drill';

describe('my module', function () {
    it('does something that should be tested', function () {
      // This code will be executed by the test driver when the app is started
      // in the correct mode
      var d = new Drill();
      chai.assert.equal(d.name, 'Test!');
    })
  })