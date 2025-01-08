The End Run Modal shows the summary of a run while paused and is used to confirm, resume, or delete a run. 

## Input
* Save Run - An api call is made to /Runs with the run data.resets recording state (locations, recording, TotalDistanceMiles, AveragePacePerMinute, TotalScore, CurrentPace, TotalTimeSeconds)
* Resume Run - Goes back to the map modal and resumes recording.
* Delete Run - Deletes all run data and resets recording state  (locations, recording, TotalDistanceMiles, AveragePacePerMinute, TotalScore, CurrentPace, TotalTimeSeconds)

## Issues
Must not completely reset because the second run always seems wrong - pace is permanently high