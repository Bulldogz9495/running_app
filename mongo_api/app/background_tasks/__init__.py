from .challenge_tasks import finish_Create_challenges
from apscheduler.schedulers.asyncio import AsyncIOScheduler


scheduler = AsyncIOScheduler()

scheduler.add_job(finish_Create_challenges, 'cron', hour='0', minute='0')
scheduler.add_job(finish_Create_challenges, 'cron', hour='6', minute='0')
scheduler.add_job(finish_Create_challenges, 'cron', hour='12', minute='0')
scheduler.add_job(finish_Create_challenges, 'cron', hour='18', minute='0')

