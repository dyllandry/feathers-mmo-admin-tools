FROM node:18

WORKDIR /home/node/app

COPY package.json .

RUN npm i

ENTRYPOINT [ "npm", "run", "dev" ]