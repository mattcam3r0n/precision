origin.x,y

dir
steps
stepType (1, 1/2)


steps - number of counts/times to repeat
dx, dy - change in x/y, going forward (multiply by -1 to reverse?)
stepType - full, 1/2, pinwheel/gate - metadata to describe what's happening, but not used to calc position?
for regular steps, dx/dy are calculated based on direction of step
for pinwheel steps, dx/dy are calculated along the curve

calculating current position is just taking starting position plus the sum of nodes (adjusting for partial node if necessary)
