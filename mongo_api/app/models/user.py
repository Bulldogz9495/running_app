from pydantic import BaseModel, Field
from uuid import UUID
from typing import Optional, List
from bson.binary import Binary
from datetime import datetime
from app.utils.security import get_password_hash

class Token(BaseModel):
    access_token: str
    token_type: str
    
class Message(BaseModel):
    id: str
    created_by: str
    message: str
    created: datetime
    updated: datetime
    read: bool
    message_type: str
    metadata: dict
    
class User(BaseModel):
    id: str # UUID
    password: str
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
    paid: Optional[bool] = False
    messages: Optional[List[Message]]


message_schema = {
    'id': {"type": "uuid", "required": True, "unique": True},
    "created_by": {"type": "uuid", "required": True},
    "message": {"type": "string", "required": True},
    "created": {"type": "datetime", "required": True},
    "updated": {"type": "datetime", "required": True},
    "read": {"type": "bool", "required": True},
    "message_type": {"type": "string", "required": True},
    "metadata": {"type": "dict", "required": False}
}


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
    "updated": {"type": datetime, "required":True},
    "paid": {"type": "bool", "required": True}
}


sample_messages = [
    {
        'id': "99443ade-f889-415a-a2cb-65f3bbab032b",
        'created_by': str("933d1bba-aa0b-485f-8e10-95697fb86bd2"),
        'message': "Hello World!",
        'created': datetime.now(),
        'updated': datetime.now(),
        'read': False,
        'message_type': 'text',
        'metadata': {}
    },
    {
        'id': "933d1bba-aa0b-485f-8e10-95697fb86bd2",
        'created_by': str("933d1bba-aa0b-485f-8e10-95697fb86bd2"),
        'message': "How are you?",
        'created': datetime.now(),
        'updated': datetime.now(),
        'read': True,
        'message_type': 'invitation',
        'metadata': {
            "team_id": "6eaf4c12-8aa0-42d5-8447-e0b598c03bb2", 
            "team_name": "Team 1",
            "inviter_id": "933d1bba-aa0b-485f-8e10-95697fb86bd2", 
            "inviter_email": "user1@example.com",
            "inviter_name": "John Doe",
            "invitation_id": "f8f3335c-9c7a-403e-a004-d07e47cdb82f"
            }
    }
]

sample_users = [
    {
        'id': str("933d1bba-aa0b-485f-8e10-95697fb86bd2"),
        'password': str(get_password_hash("test password")),
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
        'updated': datetime.now(),
        'paid': True,
        'messages': sample_messages
    },
    {
        'id': "99443ade-f889-415a-a2cb-65f3bbab032b",
        'password': str(get_password_hash("test password")),
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
        'updated': datetime.now(),
        'paid': False,
        'messages': []
    }
]

