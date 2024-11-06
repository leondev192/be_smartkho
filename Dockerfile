FROM node:20
WORKDIR /usr/src/app
COPY package.json yarn.lock ./
RUN yarn install 
RUN yarn global add @nestjs/cli
COPY . .
RUN npx prisma generate
RUN yarn build
EXPOSE ${PORT}
CMD [ "yarn", "start:dev" ]