# Use an official Node.js runtime as a parent image
FROM node:14-alpine

# Set the working directory inside the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the project files to the working directory
COPY . .

# Expose the port that the React Native packager runs on (default is 8081)
EXPOSE 8081

# Mount a volume for the project files from the local machine
VOLUME /usr/src/app

# Start the React Native development server
CMD ["npm", "start"]
