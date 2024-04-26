from pydantic import BaseModel, Field
from typing import Optional, List
from uuid import UUID
from datetime import datetime

class Location(BaseModel):
    latitude: float
    longitude: float

class Challenge(BaseModel):
    id: str # UUID
    users: List[str] # UUID
    start_datetime: datetime
    end_datetime: datetime
    notes: Optional[str] = None
    score: Optional[float]
    geography: Optional[bool] = False
    location: Optional[Location]


# Sample data for seeding
sample_challenges = [
    {
        'id': "914a7fa8-5c92-44e8-b961-96c7aeca40cd",
        'users': ['933d1bba-aa0b-485f-8e10-95697fb86bd2', '99443ade-f889-415a-a2cb-65f3bbab032b'],
        'start_location': {"latitude": 40.7128, "longitude": -74.0060},
        'end_location': {"latitude": 34.7128, "longitude": -118.0060},
        'notes': 'Sample challenge 1',
        'score': 0,
        'geography': False
    },
    {
        'id': "914a7fa8-5c92-44e8-b961-96c7aeca40cd",
        'users': ['933d1bba-aa0b-485f-8e10-95697fb86bd2'],
        'start_location': {"latitude": 40.7128, "longitude": -74.0060},
        'end_location': {"latitude": 34.7128, "longitude": -118.0060},
        'notes': 'Sample challenge 2',
        'score': 0,
        'geography': False
    }
]


'''
from mongoengine import Document, StringField, IntField, UUIDField, PointField, DecimalField, FloatField
class Run(Document):
    _id = UUIDField(required=True, unique=True, primary_key=True)
    user_id = UUIDField(required=True, unique=True, primary_key=False)
    start_locaiton = PointField(required=True) # Lat Long data
    end_location = PointField(required=True)
    distance = IntField(required=True, min_value=0)
    notes = StringField(required=False)
    cadence = IntField(required=False, min_value=0)
    pace = FloatField(required=False, min_value=0)
    duration = FloatField(required=True, min_value=0)
    score = FloatField(required=False, min_value=0, max_value=1500)
'''