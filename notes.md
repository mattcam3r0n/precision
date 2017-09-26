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
            
d = new Drill();
d.band.addMember(dir, x, y);
d.band.members[0].addStep(stepType, dir)
or
d.band.members[0].addStep('gate', dir, dx, dy) // provie dir in degrees, dx, dy