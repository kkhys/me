FROM node:16.13.0-bullseye-slim
WORKDIR /home/node/app
RUN apt update -q \
    && apt upgrade -y \
    && apt install -y \
       build-essential
RUN yarn
