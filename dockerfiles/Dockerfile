FROM ubuntu:xenial

RUN apt install && \
    apt update && \
    apt install --no-install-recommends -y --allow-unauthenticated \
    curl \
    iputils-ping \
    ca-certificates \
    git \
    apt-transport-https && \
    curl -sS https://dl.yarnpkg.com/debian/pubkey.gpg | apt-key add - && \
    echo "deb https://dl.yarnpkg.com/debian/ stable main" | tee /etc/apt/sources.list.d/yarn.list && \
    apt-get update && \
    apt-get install --no-install-recommends -y --allow-unauthenticated yarn && \
    curl -sL https://deb.nodesource.com/setup_16.x | bash - && \
    apt-get install -y nodejs && \
    yarn install && \
    npm install -g agentkeepalive --save && \
    npm install -g npm@latest

COPY . /home/my-app

WORKDIR /home/my-app

CMD ping localhost -t 1