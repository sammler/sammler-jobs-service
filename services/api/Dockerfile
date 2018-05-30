FROM node:8.4.0@sha256:080488acfe59bae32331ce28373b752f3f848be8b76c2c2d8fdce28205336504

ARG PORT=3000
ENV PORT=$PORT

ENV HOME /home/app

RUN npm install -g nodemon && \
    mkdir -p $HOME

WORKDIR $HOME

COPY index.js package.json package-lock.json ./

RUN npm install --quiet --production

COPY /src ./src/

CMD ["npm", "run", "start"]
