FROM node:14-alpine

WORKDIR /app

EXPOSE 3000

CMD ["npm", "run", "start"]

COPY package.json ./
COPY tsconfig.json ./

RUN npm install

COPY ./public ./public
COPY ./src ./src
#COPY ./.env ./
