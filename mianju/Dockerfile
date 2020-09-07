FROM node:12

WORKDIR /usr/src/mianju

COPY package*.json ./
RUN yarn

COPY . .

ENV ENV=production
ENV NODE_ENV=production
ENV NEXT_PUBLIC_ENV=production

RUN npm run build

EXPOSE 3000

CMD [ "npm", "start" ]
