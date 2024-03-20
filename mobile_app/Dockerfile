# Use an official Node.js runtime as a parent image
FROM node:18-alpine

# Set the working directory inside the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json to the working directory
COPY /running_app/package*.json ./

RUN npm install -g npm@9.8.1

# Install dependencies
RUN npm install

# Copy the rest of the project files to the working directory
COPY /running_app/. .

# Expose the port that the React Native packager runs on (default is 8081)
EXPOSE 8081 19000 19001 19002

# Set container to use host ip for expo go connection
ENV HOST_IP \
    $(if [ "$(uname)" == "Darwin" ] || [ "$(expr substr $(uname -s) 1 5)" == "Linux" ]; then \
        ip route show default | awk '/default/ {print $3}'; \
    else \
        powershell -Command "(Get-NetIPAddress -AddressFamily IPv4 | Where-Object {$_.InterfaceAlias -eq 'Ethernet' -and $_.AddressState -eq 'Preferred'}).IPAddress"; \
    fi)
ENV REACT_NATIVE_PACKAGER_HOSTNAME=192.168.4.109

# Set up a custom debug log file location
ENV NPM_CONFIG_LOGFILE /usr/src/app/debug.log
ENV EXPO_DEVTOOLS_LISTEN_ADDRESS: 192.168.4.109

# Start the React Native development server
CMD ["npx", "expo", "start"]
