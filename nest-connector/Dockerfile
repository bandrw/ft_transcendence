FROM debian:buster
WORKDIR /
RUN apt-get update -y && apt-get install -y curl procps
RUN curl -sL https://deb.nodesource.com/setup_16.x | bash -
RUN apt-get install -y nodejs
RUN npm install -g npm@7.20.6
RUN npm i -g @nestjs/cli
#RUN npm i @types/express
#RUN nest new -g --package-manager npm transcendence
#RUN npm install --save @nestjs/typeorm typeorm postgres pg
EXPOSE 3000
WORKDIR /transcendence

# Dev
CMD npm install && npm run start:dev

## Prod
#COPY ./app /transcendence
#RUN npm install
#CMD ["npm", "run", "start"]