Color Scheme generator
https://coolors.co/353535-40703b-ffffff-d9d9d9-284b63 

Denver Meeting 1/5/18
* layout changes
    * overview of new layout
        * timeline always on bottom, merged with playback controls
        * tools along left
            * where to put open/new etc? side or bottom?
    * field sizing and zooming
    * what to do with palettes for add steps and draw paths
        * easiest to hardest...
            * leave them floating
            * put the button palette in the sidebar (too busy? constant back and forth?)
            * change approach to add steps and draw paths
                * add steps: use mouse based approach, clicking in quadrant/direction you want to go
                    * not too hard a change.
                    * more space efficient, less "busy"
                    * maybe not quite as obvious how it works
                    * still need buttons for MT, halt, delete.
                * draw paths: make it similar to old software. click leader (or path) to activate
                    * faster, fewer button clicks. 
                    * can change direction "in place", rather than having to place turn "in the path"
                    * big change. will take some time.
                    * important to allow multiple active file paths, so you can see context

* color scheme preference?

* field logo -- too distracting? fade it on mouseover, fade it always, fade it on contact, allow user to turn off


* questions
    * oblique countermarches? is it correct?
    * how do you delete/edit/change things in pyware? eg, if you wanted to change things in the middle
    * DNS? precision.nammb.org?

* concerns

    * biggest things that haven't started yet:
        * lasso
        * middle-of-drill editing. no clear direction yet.
        * undo/redo.
        * user management, sign up, payment.  Stripe.
    * pinwheels. not too worried about this, but need to get started.
    * other things i'd like to work on: 
        * step-two tool. 
        * mirroring.
    * Pyware. are some of our features too close? (despite being independent?)



Takeaways
* continue with ui revamp
    * move button palettes to left side
    * long term, allow sidebar to collapse
    * use black header bar as drop down menu.
        * File menu
        * Help menu
        * show current drill name in header bar
* calculate counts if tempo is entered
* calculate tempo if counts is entered
* add metronome feature to audio clip dialog
    * automatically detect start/deadspace? add warning? way to clip?
* new favicon?
* make logo fade on mouseover, when members pass over it?
* left and right CM buttons
* show drill time on one axis of timeline?
    * use a second timeline and sync with first
* need some way to set tempo for a section of drill, akin to music
* three count about face button?
* better signup form with additional fields

Next Steps
* ui revamp
    * factor out sidebar into component
    * stride button
    * 
