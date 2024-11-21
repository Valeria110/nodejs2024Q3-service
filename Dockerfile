FROM node:lts-alpine3.20
WORKDIR /usr/app
COPY package*.json .
COPY ./prisma /usr/app/prisma
RUN npm install
RUN npx prisma generate
COPY . .
EXPOSE 4000
CMD [ "npm", "start" ]