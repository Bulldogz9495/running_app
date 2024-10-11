from app.services.mongodb_service import MongoDBService
from app.models.challenge import GeographicChallenge
import uuid
from datetime import datetime

db_service = MongoDBService()

states = ["Alabama", "Alaska", "Arizona", "Arkansas", "California", "Colorado", "Connecticut", "Delaware", "District of Columbia", "Florida", "Georgia", "Hawaii", "Idaho", "Illinois", "Indiana", "Iowa", "Kansas", "Kentucky", "Louisiana", "Maine", "Maryland", "Massachusetts", "Michigan", "Minnesota", "Mississippi", "Missouri", "Montana", "Nebraska", "Nevada", "New Hampshire", "New Jersey", "New Mexico", "New York", "North Carolina", "North Dakota", "Ohio", "Oklahoma", "Oregon", "Pennsylvania", "Rhode Island", "South Carolina", "South Dakota", "Tennessee", "Texas", "Utah", "Vermont", "Virginia", "Washington", "West Virginia", "Wisconsin", "Wyoming"]

geochallenge = GeographicChallenge(
    id=str(uuid.uuid4()),
    title="State Challenge",
    description="How many points can your state score?",
    start_datetime=datetime(year=2024, month=9, day=29),
    end_datetime=datetime(year=2024, month=10, day=5),
    notes="The more points you score the better your state is. Always remeber the best run is one you can repeat tomorrow. Be careful out there!",
    scoring_method="total_points",
    challenge_type="Georaphic",
    creator="933d1bba-aa0b-485f-8e10-95697fb86bd2",
    repeat=True,
    active=True,
    geography="",
    runs=[],
)


if __name__ == "__main__":
    for state in states:
        print(state)
        geochallenge.id = str(uuid.uuid4())
        geochallenge.title = f"{state} State Challenge"
        geochallenge.notes = f"The more points you score the better {state} does. Always remeber the best run is one you can repeat tomorrow. Be careful out there!"
        geochallenge.description = f"How many points can you score for {state}?"
        geochallenge.geography = state
        result = db_service.sync_db.geographic_challenges.insert_one(dict(geochallenge))
