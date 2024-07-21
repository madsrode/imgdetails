# Use an official Node.js runtime as a parent image
FROM node:20-slim

# Set the working directory in the container
WORKDIR /usr/src/app

# Copy the current directory contents into the container at /usr/src/app
COPY . .

# Install any needed packages
RUN npm install

# Expose the port the app runs on
EXPOSE 3000

# Run server.js when the container launches
CMD ["npm", "start"]
