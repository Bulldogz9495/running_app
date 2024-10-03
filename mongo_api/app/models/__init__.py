from .run import Run, sample_runs, run_schema
from .team import Team, sample_teams, team_schema
from .user import User, sample_users, user_schema, message_schema, Message, sample_messages
from .challenge import (
    Challenge, 
    sample_challenges, 
    TeamChallenge, 
    GeographicChallenge, 
    UserChallenge, 
    challenge_schema,
    team_challenge_schema, 
    geographic_challenge_schema, 
    user_challenge_schema,
    sample_team_challenges,
    sample_geographic_challenges,
    sample_user_challenges
)

data_models = {
    "Users": User,
    "Messages": Message,
    "Runs": Run,
    "Teams": Team,
    "Challenges": Challenge,
    "TeamChallenges": TeamChallenge,
    "GeographicChallenges": GeographicChallenge,
    "UserChallenges": UserChallenge,
}

data_schemas = {
    "users": user_schema,
    "messages": message_schema,
    "runs": run_schema,
    "teams": team_schema,
    "challenges": challenge_schema,
    "team_challenges": team_challenge_schema,
    "geographic_challenges": geographic_challenge_schema,
    "user_challenges": user_challenge_schema,
}

data_seed = {
    "users": sample_users,
    "messages": sample_messages,
    "runs": sample_runs,
    "teams": sample_teams,
    "challenges": sample_challenges,
    "messages": sample_messages,
    "team_challenges": sample_team_challenges,
    "geographic_challenges": sample_geographic_challenges,
    "user_challenges": sample_user_challenges
}
