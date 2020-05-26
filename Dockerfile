FROM node:10

EXPOSE 8080

WORKDIR /opt/express

COPY . .

RUN npm install
RUN npm run build

CMD npm run start
