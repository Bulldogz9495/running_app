The My Activity screen is a place the user can go to view their personal activity / exercise / run and view user history. It is a navigable screen within the [[Mobile App]]. It has a persisting start a run button along the top of the screen. The rest of the screen is made up of 1 of 2 components: a [[RunComponent]] and a [[MapComponent]]. 


### Run
When a run is being recorded, a geolocation is taken from device every 5 seconds and added to a locations state variable. Each geolocation after the first calculates distance traveled using radius of the earth and coordinates. Then calculates the pace using the calculated distance and time delta.
When the Pause Run button is pressed, the [[EndRunModal]] is shown and recording is paused. 

Future Steps:
Make geolocation saves a background task that can work even if app is minimized