FROM node:lts-alpine3.20
EXPOSE 4000
WORKDIR /usr/app
COPY package*.json .
COPY ./prisma /usr/app/prisma
RUN npm install
RUN npx prisma generate
COPY . .
CMD [ "npm", "start" ]