FROM node:20.18.0

ARG NPM_TOKEN
ENV NODE_ENV=production

RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

COPY package.json /usr/src/app/
COPY .npmrc /usr/src/app/

RUN npm install --omit=dev

COPY . /usr/src/app

EXPOSE 8080

CMD ["npm", "start"]
