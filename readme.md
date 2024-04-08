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