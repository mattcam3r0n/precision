origin.x,y

dir -- angle in degrees
steps
stepType (1, 1/2)


steps - number of counts/times to repeat
dx, dy - change in x/y, going forward (multiply by -1 to reverse?)
stepType - full, 1/2, pinwheel/gate - metadata to describe what's happening, used to calc dx/dy
for regular steps, dx/dy are calculated based on direction of step
for pinwheel steps, dx/dy are calculated along the curve

calculating current position is just taking starting position plus the sum of nodes (adjusting for partial node if necessary)

drill
    band - array of members. is there any other metadata needed here?
        member
            startX, startY
            script - array of script nodes
                scriptNode
                    dx
                    dy
                    stepType

compress script for storage but expand to arrays for use?
            
Communication between design view, field, etc
    * currently selected drill is stored... where? app state service?
    * current drill is bound to designSurface
    * drill is passed to field on creation
        * for each member...
            * marchers are created
            * added to field
            * references between marcher and member are set
    * when a new member is added, design view sends membersAdded event with new members
        * marchers are created
        * added to field
        * references are set

Field, Marcher, FieldController

Marcher - fabricjs subclass that renders a marcher and handles/raises events

Field - fabricjs subclass that renders field and handles/raises events

FieldController - app class that controls canvas, field, marchers, etc. ?

File Finder
* create a [x][y] map of all selected members
* create function that calculates x,y of all points around member
* look in map for member at that point

Field Markings -- mark where turns occur
* block mode or FTL mode
* in FTL mode, show who the leaers are
* choose type of turn to make from palette
* place on field in front of leaders/block
* only show valid places for it. ie, only directly in front of block/file
* show current path for N counts (maybe 12?)
    * allow this to be turned on/off? tweak how many counts forward to show?
* when a turn is placed, extend current path forward N counts?
* can place next turn, but only in path of last

New FTL algo
* create x/y map of members
* to find who a member is following, calc position in 2/4/6 counts. 
    * check each to see if in same place as another member


  *

A B C       A   A   A
A B C       B   B   B
A B C       C   C   C


  A
  A A
B B B  * 
C C C

    A
    A
  B A
  B B  * 
C C C

A A A  *
  B B
  B C
    C
    C