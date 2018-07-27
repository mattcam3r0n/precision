#### Version 0.3.6

**NEW**: Added a new **Step-Two** maneuver to make it easier add delayed step offs.
* The band can start from a Halt or from Mark-Time.
* Files can be delayed by a given number of counts (defaults to 2), and the delay can start from the left or right guide.
* Ranks can also be delayed starting from the front or back rank.

**NEW**: Added a new **Waterfall** maneuver.
* The file delay is configurable.  Defaults to 6 counts.
* The "depth" of the waterfall - how far each file proceeds after the initial turn - is configurable.  Defaults to 6 counts.
* The maneuver can be repeated a specified number of times.

**FIX**: Sped up searches in the Open Drill dialog. Frequent searches were also putting too much load on the database.

**FIX**: Files were not detected when the band was halted or marking time, preventing the Path tool and Maneuvers from working.  This now works, but the band must be in a reasonably clean block.

**FIX**: In a few cases, file indicators were drawn incorrectly when at the beginning of the drill.

-------

#### Version 0.3.5

**FIX**: Starting playback in the middle of a split audio track started on wrong beat.

**FIX**: To-the-rears window now remembers previous settings.

-------

#### Version 0.3.4

**FIX**: Fixed a bug that prevented Save As from working when Bookmarks existed in the drill.

**NEW**: The *To-The-Rears* tool allows you to quickly add to-the-rear based maneuvers.  You can delay files left-to-right or right-to-left, and ranks front-to-back or back-to-front.

