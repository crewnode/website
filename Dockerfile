FROM node:latest
WORKDIR /crewnode
RUN npm -g install nodemon
COPY ./src/package.json .
RUN npm install
CMD [ "nodemon", "entry.js" ]