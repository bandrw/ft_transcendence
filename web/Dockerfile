FROM node:14-alpine

WORKDIR /app

EXPOSE 3000

CMD ["npm", "run", "serve"]

COPY package.json ./
COPY package-lock.json ./
COPY tsconfig.json ./
COPY .eslintrc.js ./
COPY babel.config.js ./
COPY .browserslistrc ./

RUN npm install

COPY ./public ./public
COPY ./src ./src
#COPY ./.env ./
