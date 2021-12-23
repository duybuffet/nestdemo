FROM node:12

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install -g @nestjs/cli

RUN npm install

RUN npm run build

CMD ["node", "dist/main"]
