FROM node:8.4.0

ARG PORT=3003
ENV PORT=$PORT

ENV HOME /home

RUN mkdir -p $HOME && \
    mkdir -p $HOME/api

WORKDIR $HOME

COPY package.json package-lock.json ./

RUN npm install

COPY /src ./src/

CMD ["npm", "run", "start"]
