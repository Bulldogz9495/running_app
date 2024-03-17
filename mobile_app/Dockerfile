# Use an official Node.js runtime as a parent image
FROM node:16-alpine

# Set the working directory inside the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json to the working directory
COPY /running_app/package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the project files to the working directory
COPY /running_app/. .

# Expose the port that the React Native packager runs on (default is 8081)
EXPOSE 8081

# Set up a custom debug log file location
ENV NPM_CONFIG_LOGFILE /usr/src/app/debug.log

# Start the React Native development server
CMD ["npx", "expo", "start"]
