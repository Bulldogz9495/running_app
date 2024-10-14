from pydantic import BaseModel, Field
from typing import Optional, List
from uuid import UUID
from datetime import datetime, timedelta
from app.models.run import Run

from .utility_models import Location

### Challenges will store competitive data between users, teams, geographies, etc. The total Challenge score will be saved along with run uuids.

class Challenge(BaseModel):
    id: str # UUID
    title: str
    description: Optional[str] = None
    start_datetime: datetime
    end_datetime: datetime
    notes: Optional[str] = None
    scoring_method: Optional[str]
    challenge_type: str # Team, Geographic, user, personal
    creator: str
    repeat: bool = False
    active: bool = True

class TeamChallenge(Challenge):
    teams: List[str]

class GeographicChallenge(Challenge):
    geography: str
    runs: List[Run]

class UserChallenge(Challenge):
    users: List[str]
    
challenge_schema = {
    "id": {"type": "uuid", "required": True, "unique": True},
    "title": {"type": "string", "required": True},
    "description": {"type": "string", "required": False},
    "start_datetime": {"type": "datetime", "required": True},
    "end_datetime": {"type": "datetime", "required": True},
    "notes": {"type": "string", "required": False},
    "scoring_method": {"type": "string", "required": True},
    "challenge_type": {"type": "string", "required": True},
    "creator": {"type": "uuid", "required": True},
    "repeat": {"type": "bool", "required": True},
    "active": {"type": "bool", "required": True}
}

team_challenge_schema = {
    **challenge_schema,
    "teams": {"type": "List[uuid]", "required": True}
}

geographic_challenge_schema = {
    **challenge_schema,
    "geography": {"type": "string", "required": True},
    "runs": {"type": "List[uuid]", "required": True}
}

user_challenge_schema = {
    **challenge_schema,
    "users": {"type": "List[uuid]", "required": True}
}

# Sample data for seeding
sample_challenges = [
    {
        'id': "914a7fa8-5c92-44e8-b961-96c7aeca40cd",
        'title': 'Sample Challenge 1',
        'description': 'Sample Description 1',
        'start_datetime': datetime.now(),
        'end_datetime': datetime.now() + timedelta(days=1),
        'notes': 'Sample personal challenge 1',
        'scoring_method': "highest_score",
        'challenge_type': 'personal',
        'creator': '933d1bba-aa0b-485f-8e10-95697fb86bd2',
        'repeat': False,
        'active': True
    }
]

sample_team_challenges = [
    {
        'id': "933d1bba-aa0b-485f-8e10-95697fb86bd2",
        'title': 'Sample Team Challenge 1',
        'description': 'Sample Description 1',
        'start_datetime': datetime.now(),
        'end_datetime': datetime.now() + timedelta(days=1),
        'notes': 'Sample team challenge 1',
        'scoring_method': "highest_score",
        'challenge_type': 'team',
        'creator': '933d1bba-aa0b-485f-8e10-95697fb86bd2',
        'teams': ['6eaf4c12-8aa0-42d5-8447-e0b598c03bb2'],
        'repeat': False,
        'active': True
    }
]

sample_geographic_challenges = [
    {
        'id': "933d1bba-aa0b-485f-8e10-95697fb86bd2",
        'title': 'Sample Geographic Challenge 1',
        'description': 'Sample Description 1',
        'start_datetime': datetime.now(),
        'end_datetime': datetime.now() + timedelta(days=1),
        'notes': 'Sample geographic challenge 1',
        'scoring_method': "highest_score",
        'challenge_type': 'geographic',
        'creator': '933d1bba-aa0b-485f-8e10-95697fb86bd2',
        'geography': 'michigan',
        'runs': ['914a7fa8-5c92-44e8-b961-96c7aeca40cd'],
        'repeat': False,
        'active': True
    }
]

sample_user_challenges = [
    {
        'id': "933d1bba-aa0b-485f-8e10-95697fb86bd2",
        'title': 'Sample User Challenge 1',
        'description': 'Sample Description 1',
        'start_datetime': datetime.now(),
        'end_datetime': datetime.now() + timedelta(days=1),
        'notes': 'Sample user challenge 1',
        'scoring_method': "highest_score",
        'challenge_type': 'user',
        'creator': '933d1bba-aa0b-485f-8e10-95697fb86bd2',
        'users': ['933d1bba-aa0b-485f-8e10-95697fb86bd2'],
        'repeat': False,
        'active': True
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