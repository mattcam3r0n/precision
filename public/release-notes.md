#### Version 0.3.10 - 8/27/18

**NEW**: Show an instruments legend when printing charts in color.

**FIX**: Delete Track on right-click menu was not working.  Fixed.

**FIX**: Added a scrollbar to the bookmarks menu.  When there were a lot of bookmarks, the menu was sometimes too large to fit on screen.

**FIX**: Added a note about pop-up blockers on the Print Charts dialog box.  Pop-up blockers may prevent the application from opening the chart in a new browser tab. You may need to add an exception to your pop-up blocker, disable it, or hold the Ctrl key to bypass it when printing charts.

-------

#### Version 0.3.9 - 8/27/18
I ran in to a few technical problems while attempting to release v0.3.9, resulting in a couple hours of down time.  I apologize if this inconvenienced anyone.

-------

#### Version 0.3.8 - 8/12/18

**NEW**: You can now **Undo** actions added via the Paths tool. 

**FIX**: Music is now sorted alphabetically.

**FIX**: Charts were showing forecasted paths even when "Counts to forecast" was zero.  This is now fixed.

**FIX**: The Path tool was not working in Block mode.  This is fixed.

**FIX**: More accurate sizing and placement of the yard line numbers.  This may need more tweaking.

**FIX**: Using the space bar to tap out counts in audio dialog was causing drill to start playing in the background.  Fixed.

-------

#### Version 0.3.7 - 8/2/18

**FIX**: File Detection - Followers will be detected up to 8 steps from their leader (previously 6 steps).  Gaps larger than 8 steps will be treated as a new file.

**NEW**: The timeline now shows the time in minutes and seconds (mm:ss) along the top, and the count along the bottom.  In addition, the toolbar above the timeline now displays the length of the drill in mm:ss and counts. The times are re-calculated to take music and tempo changes in to account.

<img src="./timeline-time.png" width="60%" />


**NEW**: **Fast Break** maneuver.  Ranks are typically 6 steps apart when applying this maneuver.  Group A continues forward, Group B marks time two counts, and Group C backs up two counts.  The A/B/C groups can start from the left or right guide.  Apply it again in the opposite direction to undo.

<img src="./fast-break.png" width="30%" />


**NEW**: You can now **Add Music** from the right-click menu on the timeline.

**NEW**: Keyboard Shortcut - You can start and stop drill playback by tapping the space bar.

-------

#### Version 0.3.6 - 7/30/18

**NEW**: The **Step-Two** maneuver makes it easier add delayed step offs.
<img src="./step-two.png" width="75%" />

* The band can start from a Halt or from Mark-Time.
* Files can be delayed by a given number of counts (defaults to 2), and the delay can start from the left or right guide.
* Ranks can also be delayed starting from the front or back rank.

**NEW**: **Waterfall** maneuver

<img src="./waterfall.png" width="60%" />

* The file delay is configurable.  Defaults to 6 counts.
* The "depth" of the waterfall - how far each file proceeds after the initial turn - is configurable.  Defaults to 6 counts.
* The maneuver can be repeated a specified number of times.


**NEW**: **Squirrel Cage** maneuver.  Each "ring" in the selected block will rotate around the block for a given number of counts.
<img src="./squirrel-cage.png" width="75%" />
* Clockwise or counter-clockwise rotation
* Alternate the direction of each "ring"

**FIX**: Sped up searches in the Open Drill dialog. Frequent searches were also putting too much load on the database.

**FIX**: Files were not detected when the band was halted or marking time, preventing the Path tool and Maneuvers from working.  This now works, but the band must be in a reasonably clean block.

**FIX**: In a few cases, file indicators were drawn incorrectly when at the beginning of the drill.
