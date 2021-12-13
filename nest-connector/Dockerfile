FROM node:lts-alpine

WORKDIR /app

EXPOSE 3000

CMD ["npm", "run", "start:prod"]

COPY ./app/package.json ./
COPY ./app/package-lock.json ./
COPY ./app/tsconfig.json ./
COPY ./app/tsconfig.build.json ./
COPY ./app/nest-cli.json ./

RUN npm install

COPY ./app/src ./src

RUN npm run build