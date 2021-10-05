FROM node:16.10.0-bullseye-slim
WORKDIR /home/node/app
RUN apt update -q \
    && apt upgrade -y \
    && apt install -y \
       build-essential \
       git
RUN yarn global add gatsby-cli
EXPOSE 8000
