# Use a base image with Node.js pre-installed
FROM node:14-alpine

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json (if available) to the working directory
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application files to the working directory
COPY . .

# Expose the port where the Node.js application will run (e.g., 3000 for Express apps)
EXPOSE 2021

# Command to start the Node.js application
CMD ["npm", "run", "dev"]
