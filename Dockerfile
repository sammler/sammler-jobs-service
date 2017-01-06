FROM kkarczmarczyk/node-yarn:7.2-slim
MAINTAINER Stefan Walther <swr.nixda@gmail.com>

ARG PORT=3003
ENV PORT=$PORT

RUN yarn global add nodemon

ENV HOME /home
RUN mkdir -p $HOME
RUN mkdir -p $HOME/api
WORKDIR $HOME

COPY package.json yarn.lock ./

RUN yarn install

COPY /src ./src/

EXPOSE $PORT

CMD ["yarn", "run", "start"]
