FROM node:14

USER root

WORKDIR /home/node/app

COPY package.json ./

RUN npm -g config set user root

RUN npm cache clean --force

RUN npm install
