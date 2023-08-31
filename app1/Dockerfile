FROM node:alpine

WORKDIR src/app

COPY package.json package.json

RUN npm install

COPY . .

EXPOSE 6000

CMD npm start