FROM debian:buster
WORKDIR /
RUN apt-get update -y && apt-get install -y curl procps
RUN curl -sL https://deb.nodesource.com/setup_16.x | bash -
RUN apt-get install -y nodejs
RUN npm install -g npm@8.0.0
RUN npm install -g @vue/cli
EXPOSE 8080 8000
WORKDIR /transcendence
CMD npm install && npm run serve