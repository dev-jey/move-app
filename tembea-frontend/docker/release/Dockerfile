#  label STAGE 1 as ‘builder’
FROM node:8-alpine as builder

LABEL application="tembea-frontend"
ARG NODE_ENV=$NODE_ENV
ENV TERM=xterm-256color NODE_ENV="${NODE_ENV}"

RUN mkdir -p /usr/app
WORKDIR /usr/app
COPY . .
RUN npm install -g yarn@1.12.x @angular/cli npm-snapshot && rm -rf package-lock.json
RUN npm cache clean --force
RUN npm install && npm rebuild node-sass
RUN $(npm bin)/ng build -c=$NODE_ENV

# STAGE 2:
FROM nginx:1.15.8-alpine

### setup nginx configurations
COPY nginx/default.conf /etc/nginx/conf.d/

# From ‘builder’ stage copy the artifacts in dist/ to the default nginx public folder
RUN rm -rf /usr/share/nginx/html/*
COPY --from=builder /usr/app/dist /usr/share/nginx/html
