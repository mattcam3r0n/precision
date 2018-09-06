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
* RESTORE POINTS? or some other way of recovering
* Advanced Undo: see history of edits and restore to a certain point.
    * double check... are all edits undoable?
* make auto-save optional, and let user specify time interval
    * need a way to detect unsaved when leaving tab
* insert mode
    * switch to flip between insert/overwrite mode
* Maneuvers and Paths should overwrite everything from first turn on?
    * followers need to keep doing what they're doing until they reach leader
* see John's Keep list
  * Path tool not working after left/right face? -- seems to be fixed
* multiple montgomery files
    * create drill while offline. reproduce?
* set up non-block configurations
    * chevron
    * diamond
    * triangle
* strange illinois results... more testing
  * wrong results when odd number of files
* refactor search query to use a method? search is killing db cpu.
* read-only link to share drills
* assign band members
  * load csv?
  * hover to see member info?
* analytics
* get rid of paging on dialogs
* option to push music out when counts are inserted
* cue sheets
* maneuvers
  * rolling parallelogram tool
  * diamond step two tool? (or alternating option step two?)
  * block column tool
  * block buster
  * starburst tool
  * bowtie tool - see nammb site* queen anne step
  * pass through obliques
  * reverse illinois? company fronts to block.  name?
* queen anne
* override direction of block when adding maneuver? or via selection?
* maneuver preview... instead of footprints (or may in addition to), show "ghosts" where band will be in N counts.  Allow them to change N, recalc position.
    * alternatively, animate the ghosts through N counts
* better open dialog
* selection tool
    * switch between block / file /individual mode?
    * override direction of selection?
* file selection tool
    * user can define unusual files
* turn editing 
    * similar to path tool
* select file/rank/diagonal
    * hover or right click member, then select f/r/d
* drill format optimization
    * use a dictionary based approach for script, so it serializes more compactly?
    * test this to see what kind of diff it makes
    * or, use protobuf?
* 8/5... ugh
* BUG: music doesn't stop when reaching end of drill
* optimize CSS
* factor out common maneuver tool controller?
* factor out common controls, like file direction, etc
* generate video of drill
* generate gif of band for next N counts, share it
