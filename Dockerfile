FROM node:12

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install -g @nestjs/cli

RUN npm install

CMD ["node", "dist/main"]
