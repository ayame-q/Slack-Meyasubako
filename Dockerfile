FROM node:12.18.2-alpine

COPY ./package.json /usr/src/app/
WORKDIR /usr/src/app
RUN npm install

COPY . /usr/src/app

EXPOSE 8080

CMD npm run start
