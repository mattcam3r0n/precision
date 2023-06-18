10-30-17
* NEW: ctrl(cmd) + right arrow to go to end
* NEW: ctrl(cmd) + left arrow to go to beginning
* FIXED: bug remembering last drill (when logged in)
* NEW: new drill button on toolbar
* FIXED: oblique paths. can now draw paths on oblique lines.
* NEW: automatically save drill after adding/editing path
* NEW: ctrl(cmd) + a to select all
* FIXED: set tempo after opening drill
* NEW: on sign out, close current drill
* NEW: Reset button on path tool. Clears all paths to start over, without having to cancel and reopen path too.

10-31-17
* big refactor of addTurnsTool and guidePaths.
* NEW: moving turn points when drawing paths
* NEW: deleting turn points when drawing paths. 

11-1-17
* show/hide unselected members.  "ghosts" unselected members to make it easier to focus on drawing paths for selected members, but still visible enough to tell where they are.
* began "show/hide paths" tool, but still buggy
* made members a little smaller to make fine detail editing easier. sometimes you couldn't place a turn because a member was in the way.
* ctrl/cmd + d to deselect all

11-14-17
* Two modes for adding steps to drill:  Draw Paths and Add Steps. Draw paths lets you draw out the path to follow.  Add Steps adds steps one step at a time, always in "block" mode (similar to keyboard input).
* Draw Paths: Mouse cursor now shows the currently selected turn direction when placing turns.
* Draw Paths: Mouse cursor reflects countermarch direction depending on count/placement.
* Draw Paths: Block and File mode buttons.  In Block mode, all selected members will turn as a block. In File mode, they will "follow the leader".
* Draw Paths: Block mode is indicated by a box with a single guide point.
* Draw Paths: File mode is indicated by a box and each file is indicated with a line through it, and the leader is a guide point.  Files in non-block arrangements should still be detected.
* Add Steps: Palette for adding steps in all directions, plus Mark Time, Halt, Countermarch, and a "backspace" button that deletes last step and backs up one count.
* Add Steps: Countermarches are right/left based on current count.  Even counts (right foot) are left turns, odd counts are right turns.
* 6/5 or 8/5 switch is back, but 8/5 is not operational yet.

11-15-17
* much faster rendering when adding/removing members

12-30-17
* NEW: upload music files from "choose music" dialog
  * can only upload when logged in
  * can share with other users, or not
  * stored in cloud (Amazon S3) - backed up, secure, not dependent on app server
* NEW: create and save music clips, and share them with other users
* NEW: search and filter music clips and files
* NEW: tapping space to set beats now uses your exact tap timing, rather than just calculating avg bpm. animation will be sync'd with your exact taps. this allows you to adjust for varations in tempo. if tapping isn't provided, bpm will be calculated based on entered number of counts and duration of music. this means animation can be slightly off if there are variations in tempo of music, though it should correct by end of clip.
* NEW: metronome in audio clip dialog allows you to play back recorded beats with music to see how accurate your tapping was and re-do if necessary
* NEW: separate Play and Play w/ Music buttons
* NEW: spinner for lengthy operations, like loading big music files
* NEW: alert system for error and other notifications
* NEW: mark time counts are indicated by slight size change in marchers, so you can tell what's happening
* NEW: halted counts are indicated by slight opacity change in marchers, so you can tell they are intentionally halted
* FIX/NEW: click the halt button for as many counts as you'd like the selected marchers to be halted. click another command to make them start moving again.
* FIX: clear music timeline on new drill
* FIX: countermarches in obliques 
* FIX: automatically opening your last drill on login or when changing views sometimes didn't work

1-6-18

1-7-18

1-10-18
* UI layout makeover
  * dropdown menu in header
    * moved new/open to file menu
    * moved About to Help menu
    * moved Debug (which is temporary) to Help menu
  * timeline is always visible and fixed to bottom
  * Replaced floating "Tools" menu with sidebar
  * Steps and Paths palettes are in sidebar
  * Add Music option is in sidebar now
  * moved playback-related controls to timeline
  * Field zooming options in sidebar.  Can make field larger, smaller, or fit to availalbe space
* NEW: Settings to show/hide grid and logo. 
* NEW: favicon (tiny icon in browser tab), uses nammb logo
* FIX: increased number of members that can be added to in excess of 30 x 30 ranks and files
* NEW: field logo is more subtle, to make it easier to see when editing in that area, and fades further when mouse is over it 

1-11-18
* FIX: format steps label so it doesn't have a zillion decimal places
* NEW: save grid and logo preferences to user profile
* NEW: drill name in header
* NEW: drill info dialog
* NEW: composed by field when uploading 
* FIX: wavy file indicators when on odd count
* FIX: show new step count when moving turn marker
* Clean up event related code

1-20-18
* NEW: Pinwheel and gate tool
* FIX: playback bug
* FIX: disallow go-to-beginning, step-forward, etc buttons during playback
* FIX: zoom timeline and go to beginning on open
* NEW: edit drill name by clicking on it in header
* FIX: draw paths tool collapses when stride type changed
* FIX: allow only one of path/add steps/pinwheel tool to be active at a time

1-21-18
* FIX: timeline was not properly clearing music from previous drill, after opening another
* FIX: changes to music on timeline were not being saved in some cases

1-22-18
* NEW: log uncaught errors

1-28-18
* NEW: pencil icon next to drill name in header
* FIX: logging bug

1-30-18
* NEW: merged Select and Marchers side menus
* NEW: re-organized buttons in Steps menu. new icons.

2-1-18
* NEW: drag step tool
* NEW: pinwheel, drag step, and gate buttons in Steps menu. removed Pinwheel menu. Pinwheel/Gate buttons default to appropriate pivot point (but can still be changed). Pinwheel/Gate/Drag Steps palette floats.
* NEW: Left, right and about face buttons.
* NEW: Added 1 and 5 step spacing options when adding members
* NEW: show number of selected marchers next to cursor position near timeline
* NEW: free form (lasso) selection on dbl click. dbl click again to finish.
* NEW: marchers face correct direction during pinwheels and gates

v0.1 2-17-18
* NEW: delete confirmations for
  * delete marchers
  * delete accounts
  * delete drills
* NEW: basic color settings for marchers
* NEW: user signup
* NEW: basic admin panel with...
  * disable account
  * delete account
  * grant admin privileges
  * basic usage stats 

Last release tag v0.2.6

4-21-18
* FIX: Path tool sometimes doesn't use selected direction
* FIX: Weird file path indicator when drill is first opened and at beginning of drill.
* FIX: Logo and grid not respecting profile settings on inital load
* NEW: Add sequential number to New Drill name.  E.g., New Drill 1, New Drill 2, etc.
* NEW: Open Recent on file menu shows list of up to 10 recently opened drills
* NEW: Open dialog indicates currently open drill
* NEW: Can delete currently open drill.  New drill will be opened.

Released v0.2.7 
* but without delete current drill

5-1-18
* FIX: widened count box on bookmark dialog
* NEW: show bookmarks on timeline
* NEW: double-click bookmark to edit
* NEW: added notes and counts to forecast to bookmarks, to facilitate chart printing
* FIX: errors in share dialog
* NEW: print charts

5-4-18 Released v0.2.8, chart printing

5-4-18
* FIX: music will be added at current count
* NEW: Small cosmetic changes to print chart dialog
* NEW: Delete Forward keyboard shortcut, context menu
* NEW: On context menu, a new Selection sub-menu with options to modify the current selection, including Xs and Os, and alternating ranks and files.

5-4-18 Release v0.2.9, Xs and Os, etc

5-5-18
* FIX: New audio restrictions in Chrome broke playback.

Release v0.3.0 to fix chrome audio problem

5-9-18
* NEW: Insert steps button on Steps menu
* NEW: Right-click menu on timeline
* NEW: Zoom timeline in/out from right-click menu
* NEW: Split track.  Right click on track (and at appropriate count), choose 'Split Track at Count X'. The split point is calculated based on tempo, so if tempo is not precise, the music may split in an awkward place.
* NEW: Option to print marchers in color on Charts.

Release v0.3.1 - split track, print marchers in color

5-14-18
* FIX: Insert Step did not undo properly
* NEW: Change tempo for sections of a drill. The tempo box above the timeline is default tempo, for when no music or tempo is specified.  In places where there is no music, you can add a tempo to region on the timeline.  Music tempo still takes precedence.

Release v0.3.2 - fix undo insert bug, specify tempo on timeline

* FIX: Unhide keyboard shortcut not working
* NEW: Maneuvers menu
* NEW: Countermarch, Illinois, Column, and Texas Turn maneuvers, with "footprints" preview
* FIX: Sped up chart printing by about 50%.  Still takes about 1.5s per chart.

Released v0.3.3

* FIX: Save As bug related to Bookmarks
* NEW: To-The-Rears tool

Released v0.3.4

* FIX: Playback in the middle of a split audio track started on wrong beat.
* FIX: To-the-rears window now remembers previous settings.

^ Released v0.3.5

* FIX: Speed up search box in Open Drill dialog.
* FIX: File indicators were sometimes incorrect when at beginning of drill.
* FIX: Files were not detected when in a halted / mark time state.
* NEW: Step-two maneuver
* NEW: Waterfall maneuver
* NEW: Squirrel Cage maneuver

^ Released v0.3.6

* FIX: Detect files when ranks are spaced up to 8 steps apart.  Previously only allowed up to 6 steps between leader and follower.
* NEW: The length of the drill in minutes & seconds is shown in the button bar above the timeline.  It also shows the length in counts.
* NEW: The timeline now shows time of each count in minutes & seconds (mm:ss) on the top.  It continues to show the count along the bottom.
* NEW: Fast Break maneuver
* NEW: Add Music option on timeline right-click menu.
* NEW: Keyboard shortcut - Press spacebar to play/stop drill (with music).

^ Released v0.3.7

* FIX: Using space bar to tap counts in audio dialog was causing drill to start playing in the background.  Fixed.
* FIX: Music now sorted alphabetically by title.
* FIX: More accurate size and placement of field numbers.
* FIX: Charts were forecasting footprints even if counts-to-forecast was zero.  Fixed.
* FIX: Path tool was not working when in "Block" mode. Fixed.
* NEW: Can now "Undo" steps added with Path tool. This works for the whole path operation that was saved by click the green check button in the Path tool, not for individual file paths.

^ Released v0.3.8

* NEW: Show an instruments legend when printing charts in color.
* FIX: Delete Track on right-click menu was not working.  Fixed.
* FIX: Added a scrollbar to the bookmarks menu.  When there were a lot of bookmarks, the menu was sometimes too large to fit on screen.
* FIX: Added a note about pop-up blockers on Print Charts dialog box.

^ Release v0.3.9 -- Failed release, due a hex-rgb package note minifying properly.  Aborted.

^ Release v0.3.10 -- Release all features intended for 0.3.9.  Removed offending package.

* NEW: The "Choose Music" dialog box now has "My Music" and "NAMMB Music" tabs. Admins can upload music to the shared NAMMB library so that it can be used by all users.

^ Release v0.3.11 - My Music tabs

* NEW: The current count on the timeline is now shaded to make it more obvious.  The blue line was causing some confusion about which count (to the left or right of the line) was current.
* NEW: On the grid, lines on every 2 paces are accented slightly.
* NEW: "Print Grid" option when printing charts.
* FIX: The color legend on charts showed wrong colors for a few instruments. Fixed.

^ Release v0.3.12 - Timeline changes

* FIX: Chart updates:
  * Chart titles now wrap lines when very long
  * Spacing and placement of field, color legend

^ Release v0.3.13

* NEW: Insert Halt / Mark Time option on right-click menu.

^ Release v0.3.14

* FIX: Cleaner grid lines on screen and chart.  Even lines are accentuated and odd lines are slightly faded.
* FIX: Optimize how drills are loaded.
* FIX: Changes to Insert Step button to better handle upcoming turns.

^ Release v0.3.15

*FIX: Insert Step button was not working properly since v0.3.14.

^ Release v0.3.16

*FIX: Fixes to Delete and Clear step buttons. You can now undo these actions.

^ Release v0.3.17

* NEW: How To Videos dialog

^ Release v0.3.19
* NEW: Half/Full step type option for countermarch maneuver

^ Release v0.3.20
* FIX: Triangle (direction) markers should not be selectable, movable, etc.