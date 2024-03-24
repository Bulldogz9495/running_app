# Challenge Run
An idea that will allow runners to compete with each other in teams. The initial idea is a simple running app that will provide a score for each run. This score will be summed for a team and the teams scores will be calculated and compared allowing for competition. The original idea was for a city wide team (this can be the default) and cities can compete with each other. This will hopefully be an exciting and enjoyable way for runners and non-runners to get out their and move and compete. 

# Mongo API
This app is based on fastapi and pymongo and will host a set of endpoints that allow the front end to make rest requests to the mongo database.

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


{
    "_id": ObjectId("609e4e0fcbb24f1234567893"),
    "date": "2022-01-01",
    "distance_km": 10,
    "duration_minutes": 60,
    "user_id": ObjectId("609e4b68cbb24f1234567890"),
    "team_id": ObjectId("609e4c79cbb24f1234567891")
}
{
    "_id": ObjectId("609e4c79cbb24f1234567891"),
    "team_name": "Team A",
    "description": "A great team",
    "users": [
        ObjectId("609e4b68cbb24f1234567890"),
        ObjectId("609e4babcbb24f1234567896")
    ],
    "runs": [
        ObjectId("609e4e0fcbb24f1234567893"),
        ObjectId("609e4f1ccbb24f1234567895"),
        ObjectId("609e4f70cbb24f1234567897")
    ]
}
{
    "_id": ObjectId("609e4b68cbb24f1234567890"),
    "name": "John Doe",
    "email": "johndoe@example.com",
    "teams": [
        ObjectId("609e4c79cbb24f1234567891"),
        ObjectId("609e4d0dcbb24f1234567892")
    ],
    "runs": [
        ObjectId("609e4e0fcbb24f1234567893"),
        ObjectId("609e4e7ecbb24f1234567894"),
        ObjectId("609e4f1ccbb24f1234567895")
    ]
}
