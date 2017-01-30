FROM kkarczmarczyk/node-yarn:7.2-slim

ARG PORT=3003
ENV PORT=$PORT

RUN yarn global add nodemon

ENV HOME /home

RUN mkdir -p $HOME && \
    mkdir -p $HOME/api

WORKDIR $HOME

COPY package.json yarn.lock ./

RUN yarn install

COPY /src ./src/

CMD ["yarn", "run", "start"]
