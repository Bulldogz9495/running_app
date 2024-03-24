from pydantic import BaseModel, Field, root_validator
from typing import List
from uuid import UUID

class Team(BaseModel):
    # id: UUID
    name: str
    size: int
    motto: str = None
    members: List[UUID] = []
    owner: UUID


team_schema = {
    "_id": {"type": "uuid", "required": True, "unique": True},
    "name": {"type": "string", "required": True},
    "size": {"type": "int", "required": True, "min_value": 0},
    "motto": {"type": "string", "required": False},
    "members": {"type": "Array", "required": True},
    "owner": {"type": "uuid", "required": True}
}

sample_teams = [
    {
        '_id': "6eaf4c12-8aa0-42d5-8447-e0b598c03bb2",
        'name': 'Team A',
        'size': 5,
        'motto': 'We strive for excellence',
        'members': ["933d1bba-aa0b-485f-8e10-95697fb86bd2", "99443ade-f889-415a-a2cb-65f3bbab032b"],
        'owner': '99443ade-f889-415a-a2cb-65f3bbab032b'
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