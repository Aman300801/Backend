# Speciy a base image
FROM node:26-alpine3.23

WORKDIR /app
COPY ./package.json ./

#Install Node.js and npm
RUN npm install

COPY ./ ./

#Default command to run the container
CMD ["npm", "start"]