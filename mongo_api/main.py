import os
import pymongo
import time
import boto3
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routes.api import router as api_router
from app.services.mongodb_seed import initialize_database
from app.models import data_models
from app.settings import logger


initialize_database(data_models)

app = FastAPI()

origins = [
    "http://localhost:8081",  # Replace with your React Native app's origin
    "https://your-production-app.com",  # Add other allowed origins as needed
]

app.port = 80
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "PATCH", "DELETE"],
    allow_headers=["*"],
)

app.include_router(api_router)

@app.on_event("startup")
async def add_private_ip_to_target_group():
    if os.getenv("ENVIRONMENT") != "local":
        from app.settings import CLUSTER_NAME as cluster_name
        from app.settings import SERVICE_NAME as service_name
        from app.settings import TARGET_GROUP_ARN as target_group_arn
        
        ecs = boto3.client('ecs', region_name='us-east-1')
        elbv2 = boto3.client('elbv2', region_name='us-east-1')

        # Get the container instance ARNs
        tasks = ecs.list_tasks(cluster=cluster_name)['taskArns']
        tasks = ecs.describe_tasks(cluster=cluster_name, tasks=tasks)
        ips = []
        for task in tasks:
            ips = [ips, (task['attachments'][0]['details'][-1]['value'])]
        private_ips = [container['container']['networkInterfaces'][0]['privateIpv4Address'] for container in response['containerInstances']]
        logger.info(f"Private IPs: {private_ips}")
        
        # Register the private IPs with the target group
        response = elbv2.register_targets(
            TargetGroupArn=target_group_arn,
            Targets=[{'Id': private_ip, 'Port': 80} for private_ip in private_ips]
        )
        logger.info(f"Response from register_targets: {response}")
