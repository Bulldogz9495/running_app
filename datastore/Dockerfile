# Use the official MongoDB Docker image
FROM mongo:latest

# Set the working directory inside the container
WORKDIR /usr/src/app

# Expose the default MongoDB port
EXPOSE 27017

USER root

# Install additional tools
RUN apt-get update && apt-get install -y \
    curl \
    && curl -O https://fastdl.mongodb.org/tools/db/mongodb-database-tools-debian92-x86_64-100.3.1.deb \
    && dpkg -i mongodb-database-tools-debian92-x86_64-100.3.1.deb \
    && rm -f mongodb-database-tools-debian92-x86_64-100.3.1.deb

# Remove any existing socket file
RUN rm -f /tmp/mongodb-27017.sock

COPY mongod.conf.orig /etc/mongod.conf.orig

# Start MongoDB when the container starts
CMD ["mongod", "--bind_ip_all"]
