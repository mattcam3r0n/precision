import { HTTP } from 'meteor/http';
import { introJs } from 'intro.js';

class WalkThru {
    constructor() {
    }

    start(walkThruName) {
        HTTP.get("walkThrus/" + walkThruName + ".json", function (err, result) {
            if (err) {
                console.log(err);
            }

            var steps = result.data;
            console.log(steps);

            var intro = introJs();
            intro.setOptions(steps);
            // intro.onafterchange(function(next) {
            //     var el = $(next);
            //     if (el.position().left == 0){
            //         // awful hack when next el isn't visible
            //         setTimeout(function(){
            //             $('.introjs-tooltip').css({top:'200px',left:'200px'});
            //         },600);
            //     }
            // });
            intro.start();
        });

    }
}

export default WalkThru;