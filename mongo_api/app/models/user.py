from pydantic import BaseModel, Field
from uuid import UUID
from typing import Optional
from bson.binary import Binary
from datetime import datetime

class User(BaseModel):
    id: str # UUID
    email: str
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    middle_name: Optional[str] = None
    motto: Optional[str] = None
    height_inches: Optional[float] = None
    height_feet: Optional[float] = None
    birthday: Optional[datetime] = None
    weight_lbs: Optional[float] = None
    weight_ounces: Optional[float] = None
    created: datetime = Field(default_factory=datetime.now)
    updated: datetime = Field(default_factory=datetime.now)
    

user_schema = {
    "id": {"type": "uuid", "required": True, "unique": True},
    "email": {"type": "string", "required": True, "unique": True},
    "first_name": {"type": "string", "required": False},
    "last_name": {"type": "string", "required": False},
    "middle_name": {"type": "string", "required": False},
    "motto": {"type": "string", "required": False},
    "height_inches": {"type": "float", "required": False},
    "height_feet": {"type": "float", "required": False},
    "birthday": {"type": datetime, "required": False},
    "weight_lbs": {"type": "float", "required": False},
    "weight_ounces": {"type": "float", "required": False},
    "created": {"type": datetime, "required": True},
    "updated": {"type": datetime, "required":True}
}

sample_users = [
    {
        'id': str("933d1bba-aa0b-485f-8e10-95697fb86bd2"),
        'email': 'user1@example.com',
        'first_name': 'John',
        'last_name': 'Doe',
        'middle_name': 'Smith',
        'motto': 'Work hard, play hard',
        'height_inches': 2,
        'height_feet': 6,
        'birthday': datetime(1990, 1, 1),
        'weight_lbs': 200,
        'weight_ounces': 8,
        'created': datetime.now(),
        'updated': datetime.now()
    },
    {
        'id': "99443ade-f889-415a-a2cb-65f3bbab032b",
        'email': 'user2@example.com',
        'first_name': 'Jain',
        'last_name': 'Doe',
        'middle_name': 'Smith',
        'motto': 'Never Give Up',
        'height_inches': 2,
        'height_feet': 5,
        'birthday': datetime(1990, 1, 1),
        'weight_lbs': 130,
        'weight_ounces': 8,
        'created': datetime.now(),
        'updated': datetime.now()
    }
]

'''
from mongoengine import Document, StringField, IntField, UUIDField, FloatField, DateField, DateTimeField
class User(Document):
    _id = UUIDField(required=True, unique=True, primary_key=True)
    email = StringField(required=True, unique=True)
    first_name = StringField(required=False)
    last_name = StringField(required=False)
    middle_name = StringField(required=False)
    motto = StringField(required=False)
    height_inches = FloatField(required=False)
    height_feet = FloatField(required=False)
    birthday = DateField(required=False)
    weight_lbs = FloatField(required=False)
    weight_ounces = FloatField(required=False)
    created = DateTimeField(required=True)
    updated = DateTimeField(required=True)
    '''