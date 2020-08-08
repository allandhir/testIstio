FROM node:lts-slim
WORKDIR '/usr/app/test'

COPY package.json .

RUN npm install
RUN apt-get update && apt-get install curl jq -y

COPY . .
EXPOSE 8003
CMD ["node","stress.js"]
