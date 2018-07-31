Color Scheme generator
https://coolors.co/353535-40703b-ffffff-d9d9d9-284b63 


Build Issue
* A dev dependency on jsom package causes build errors
* Others have noted this.
* Caused huge memory usage during minification, which i worked around but...
* Build eventually crashed with error.
* Removed the following dev dependencies, which were added to allow mocha tests to work with es6.  The real culprit seems to be jsdom.  These were devDependencies, so unsure why meteor was building them.

    "babel": "^6.23.0",
    "babel-core": "^6.26.3",
    "babel-preset-es2015": "^6.24.1",
    "babel-root-slash-import": "^1.1.0",
    "chai": "^4.1.2",
    "jsdom": "11.11.0",
    "jsdom-global": "3.0.2",

Check point in polygon...

From https://stackoverflow.com/questions/22521982/js-check-if-point-inside-a-polygon 
Test https://codepen.io/anon/pen/JpjLNK 
function inside(point, vs) {
    // ray-casting algorithm based on
    // http://www.ecse.rpi.edu/Homepages/wrf/Research/Short_Notes/pnpoly.html

    var x = point[0], y = point[1];

    var inside = false;
    for (var i = 0, j = vs.length - 1; i < vs.length; j = i++) {
        var xi = vs[i][0], yi = vs[i][1];
        var xj = vs[j][0], yj = vs[j][1];

        var intersect = ((yi > y) != (yj > y))
            && (x < (xj - xi) * (y - yi) / (yj - yi) + xi);
        if (intersect) inside = !inside;
    }

    return inside;
};


8/5 modified stride between hashes
----------------------------------
* when executing step, if it is between hashes, modify deltaY?
  * pros
    * less invasive - can be implemented in position calculator
    * does not affect drill files
    * does not affect deleting/moving of steps?
  * cons - adds more work to playback (slower)
* what would this do to obliques?  would it work the same?

TODO
* fast break tool
* rolling parallelogram tool
* diamond step two tool? (or alternating option step two?)
* block column tool
* starburst tool
* assign band members
  * load csv?
  * hover to see member info?
* read-only link to share drills
* insert mode
    * switch to flip between insert/overwrite mode
* selection tool
    * switch between block / file /individual mode?
* file selection tool
    * user can define unusual files
* turn editing 
    * similar to path tool
* select file/rank/diagonal
    * hover or right click member, then select f/r/d
* analytics
* drill format optimization
    * use a dictionary based approach for script, so it serializes more compactly?
    * test this to see what kind of diff it makes
    * or, use protobuf?
* 8/5... ugh
