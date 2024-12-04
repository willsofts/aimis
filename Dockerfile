FROM node:20.18.0

ENV NODE_ENV=production
ENV NPM_TOKEN=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

RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

COPY package.json /usr/src/app/
COPY .npmrc /usr/src/app/

RUN npm install --production --omit=dev

COPY . /usr/src/app

EXPOSE 8080

CMD ["npm", "start"]
