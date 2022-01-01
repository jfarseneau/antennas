FROM node:9-alpine
LABEL maintainer="jf.arseneau@gmail.com"

COPY . /antennas
WORKDIR "/antennas"

RUN yarn install

EXPOSE 5004
CMD ["node", "index.js"]
