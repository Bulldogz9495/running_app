from pydantic import BaseModel, Field


class Location(BaseModel):
    latitude: float
    longitude: float