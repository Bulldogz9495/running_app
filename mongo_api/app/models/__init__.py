from .run import Run, sample_runs, run_schema
from .team import Team, sample_teams, team_schema
from .user import User, sample_users, user_schema
from .challenge import Challenge, sample_challenges

data_models = {
    "Users": User,
    "Runs": Run,
    "Teams": Team,
    "Challenges": Challenge,
}

data_schemas = {
    "users": user_schema,
    "runs": run_schema,
    "teams": team_schema,
}

data_seed = {
    "users": sample_users,
    "runs": sample_runs,
    "teams": sample_teams,
    "challenges": sample_challenges
}
