# Use an official Python runtime as a parent image
FROM python:3.12-slim

RUN apt-get update
RUN apt-get install inetutils-ping
RUN apt-get install -y curl

# Set the working directory inside the container
WORKDIR /usr/src

# Copy the requirements.txt file into the container at /app
COPY requirements.txt .

RUN pip install --upgrade pip setuptools

# Install the dependencies from requirements.txt
RUN pip install --no-cache-dir -r requirements.txt

# Copy the rest of the application code into the container at /app
COPY . .

# Expose the port that the FastAPI application will run on (default is 8000)
EXPOSE 80

# Command to run the FastAPI application
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "80", "--reload"]
