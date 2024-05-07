from pydantic import BaseModel, Field
from typing import Optional, List
from uuid import UUID
from datetime import datetime


class Location(BaseModel):
    latitude: float
    longitude: float

class GeoPoint(BaseModel):
    location: Location
    datetime: datetime
    altitude: float = None
    cadence: Optional[int] = None
    pace: Optional[float] = None
    accuracy: Optional[float] = None
    altitudeAccuracy: Optional[float] = None
    heading: Optional[float] = None
    speed: Optional[float] = None # meters / second

class Run(BaseModel):
    id: str # UUID
    user_id: str # UUID
    start_location: Location  # Assuming PointField is a string for latitude and longitude
    start_datetime: datetime
    end_location: Location  # Assuming PointField is a string for latitude and longitude
    end_datetime: datetime
    distance: float # miles
    notes: Optional[str] = None
    cadence: Optional[int] = None
    pace: Optional[float] = None
    duration: float # seconds
    score: Optional[float] = Field(None, ge=0, le=1500)  # Min value of 0 and max value of 1500
    geopoints: List[GeoPoint]  # New field for an array of geopoints
    teams: List[str]

run_schema = {
    "id": {"type": "uuid", "required": True, "unique": True},
    "user_id": {"type": "uuid", "required": True, "unique":False},
    "start_location": {"type": "point", "required": True},
    "end_location": {"type": "point", "required": True},
    "distance": {"type": "int", "required": True, "min_value": 0},
    "notes": {"type": "string", "required": False},
    "cadence": {"type": "int", "required": False, "min_value": 0},
    "pace": {"type": "float", "required": False, "min_value": 0},
    "duration": {"type": "float", "required": True, "min_value": 0},
    "score": {"type": "float", "required": False, "min_value": 0, "max_value": 1500}
}


# Sample data for seeding
sample_runs = [
    {
        'id': "914a7fa8-5c92-44e8-b961-96c7aeca40cd",
        'user_id': '933d1bba-aa0b-485f-8e10-95697fb86bd2',
        'start_location': {"latitude": 40.7128, "longitude": -74.0060},
        'start_datetime': datetime.now(),
        'end_location': {"latitude": 34.7128, "longitude": -118.0060},
        'end_datetime': datetime.now(),
        'distance': 10,
        'notes': 'Sample run 1',
        'cadence': 160,
        'pace': 6.5,
        'duration': 3600,
        'score': 100,
        'geopoints': [{"location": {"latitude": 40.7128, "longitude": -74.0060}, "cadence": 155, "pace": 6.7, "datetime": datetime.now()}],
        'teams': ['6eaf4c12-8aa0-42d5-8447-e0b598c03bb2']
    },
    {
        'id': "3ed45c43-6714-4bf4-adec-e3ddc22e8c76",
        'user_id': '3ed45c43-6714-4bf4-adec-e3ddc22e8c76',
        'start_location': {"latitude": 40.7128, "longitude": -74.0060},
        'start_datetime': datetime.now(),
        'end_location': {"latitude": 34.7128, "longitude": -118.0060},
        'end_datetime': datetime.now(),
        'distance': 10,
        'notes': 'Sample run 1',
        'cadence': 160,
        'pace': 6.5,
        'duration': 3600,
        'score': 100,
        'geopoints': [{"location": {"latitude": 40.7128, "longitude": -74.0060}, "cadence": 156, "pace": 6.7, "datetime": datetime.now()}]
    },
    {
        'id': "f8f3335c-9c7a-403e-a004-d07e47cdb82f",
        'user_id':'99443ade-f889-415a-a2cb-65f3bbab032b',
        'start_location': {"latitude": 40.7128, "longitude": -74.0060},
        'start_datetime': datetime.now(),
        'end_location': {"latitude": 47.7128, "longitude": -122.0060},
        'end_datetime': datetime.now(),
        'distance': 1,
        'notes': 'Sample run 2',
        'cadence': 155,
        'pace': 600,
        'duration': 600,
        'score': 130,
        'geopoints': [{"location": {"latitude": 40.7128, "longitude": -74.0060}, "cadence": 155, "pace": 6.7, "datetime": datetime.now()}],
        'teams': ['6eaf4c12-8aa0-42d5-8447-e0b598c03bb2']
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