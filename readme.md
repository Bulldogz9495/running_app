# Challenge Run
An idea that will allow runners to compete with each other in teams. The initial idea is a simple running app that will provide a score for each run. This score will be summed for a team and the teams scores will be calculated and compared allowing for competition. The original idea was for a city wide team (this can be the default) and cities can compete with each other. This will hopefully be an exciting and enjoyable way for runners and non-runners to get out their and move and compete. 

## Architecture
The app is seperated into microservices with a front end react-native android and ios app. 

### Backend 
Mongo DB with mongo db api app using fastapi to make db data changes
Automated task container that runs automated tasks based on mongo database data

### Front End Framework
React-Native running expo go to test android and ios data.
This does not work well in the docker compose so disable the expo container in compose and use npx expo start to run front end.


# Stack
React-Native
Android SDK
iOS
Python
* FastAPI
* Pymongo
Mongo DB
Docker
AWS - ECR, Cluster, Service, Task, s3
MongoDB Atlas

# Dev setup
Requires access to aws account and mongodb account



# Testing:
Create account
Edit profile information
Start a run
Save a run
View State Challenge Data
Join a Team
Become a pro member
Create a team
Invite others to team


## Tasks
Create a messaging setup for internal user communication.
Create deep linking for invitations to new users and existing users via text and email
Message users regaurding challenge status and performance
Add geographic challenges that will automatically allow track all users that meet the challenge in their area.
Create a development build with expo eas and introduce react-native-purchases using revenue-cat
Make scroll areas refresh when pulled down (runs, teams)
Handle empty states on scrolls
Save Login info so user doesn't have to type it in each time



## Nice to have tasks
Users can be notified when team members complete a run
Weekly messages regaurding team performance
Invitations can expire
Map has polyline of current runs route
Total Run Time updates 10 times a second
Make map follow current travel direction while exercising
Runs can have comments (chat)
Save screenshots of maps with route
Initial loading screen uses runner icon
Create a challenges schema that will allow users to join a challenge.
Include Biometric ID



## Completed Tasks
Fix saving of runs