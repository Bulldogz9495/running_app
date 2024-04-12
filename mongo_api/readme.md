# Challenge Run
An idea that will allow runners to compete with each other in teams. The initial idea is a simple running app that will provide a score for each run. This score will be summed for a team and the teams scores will be calculated and compared allowing for competition. The original idea was for a city wide team (this can be the default) and cities can compete with each other. This will hopefully be an exciting and enjoyable way for runners and non-runners to get out their and move and compete. 

# Mongo API
This app is based on fastapi and pymongo and will host a set of endpoints that allow the front end to make rest requests to the mongo database.


# Deployment
Tricks:
```
aws ecs execute-command --cluster challenge_run_cluster --task arn:aws:ecs:us-east-1:920990234657:task/challenge_run_cluster/d54876dc950b465f8e46f961f77890fd --container api-service --interactive --command "/bin/bash"
```

# Code Structure
project_name/
├── app/
│   ├── __init__.py
│   ├── main.py
│   ├── models/
│   │   └── __init__.py
│   ├── routes/
│   │   ├── __init__.py
│   │   └── api.py
│   ├── services/
│   │   ├── __init__.py
│   │   └── mongodb_service.py
│   └── settings.py
├── docker-compose.yml
├── Dockerfile
├── requirements.txt
└── README.md


# Task List
Create about endpoint and set up aws to monitor it
Buy HTTPS ssl Cert (research)
Score calculation on run post
automated tasks for team calculation
Email confirmation