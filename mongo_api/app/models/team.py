from pydantic import BaseModel, Field, root_validator
from typing import List, Optional
from uuid import UUID
from datetime import datetime
from .user import User


class Invitation(BaseModel):
    id: str
    team_id: str
    user_id: Optional[str]
    date_created: datetime = Field(default_factory=datetime.now)
    date_accepted: Optional[datetime] = None
    pending: bool = True
    
sample_invitations = [
    {
        'id': "f8f3335c-9c7a-403e-a004-d07e47cdb82f",
        'team_id': "6eaf4c12-8aa0-42d5-8447-e0b598c03bb2",
        'user_id': "933d1bba-aa0b-485f-8e10-95697fb86bd2",
        'date_created': datetime.now(),
        'date_accepted': None,
        'pending': True
    }
]

invitation_schema = {
    'id': {"type": "uuid", "required": True, "unique": True},
    "team_id": {"type": "uuid", "required": True},
    "user_id": {"type": "uuid", "required": True},
    "date_created": {"type": "datetime", "required": True},
    "date_accepted": {"type": "datetime", "required": False},
    "pending": {"type": "bool", "required": True}
}

class Team(BaseModel):
    id: str # UUID
    name: str
    size: int
    motto: str = None
    members: List[str] = [] # UUID
    owner: str # UUID
    last_challenge_date: Optional[datetime] = None
    last_challenge_score: Optional[int] = None
    invitations: List[Invitation] = []


team_schema = {
    "id": {"type": "uuid", "required": True, "unique": True},
    "name": {"type": "string", "required": True},
    "size": {"type": "int", "required": True, "min_value": 0},
    "motto": {"type": "string", "required": False},
    "members": {"type": "Array", "required": True},
    "owner": {"type": "uuid", "required": True},
    "last_challenge_date": {"type": "datetime", "required": False},
    "last_challenge_score": {"type": "int", "required": False},
    "invitations": {"type": "Array", "required": False}
}

sample_teams = [
    {
        'id': "6eaf4c12-8aa0-42d5-8447-e0b598c03bb2",
        'name': 'Team A',
        'motto': 'We strive for excellence',
        'members': ["933d1bba-aa0b-485f-8e10-95697fb86bd2", "99443ade-f889-415a-a2cb-65f3bbab032b"],
        'owner': '99443ade-f889-415a-a2cb-65f3bbab032b',
        'last_cahllenge_score': 0,
        'last_challenge_date': None,
        'invitations': sample_invitations
    }
]


'''
from mongoengine import Document, StringField, IntField, UUIDField
class Team(Document):
    _id = UUIDField(required=True, unique=True, primary_key=True)
    name = StringField(required=True)
    size = IntField(required=True, min_value=0)
    motto = StringField(required=False)
    members = ArrayField(required=True)
    owner = UUIDField(required=True)
'''