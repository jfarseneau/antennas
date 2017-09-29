FROM crystallang/crystal:latest
LABEL maintainer "jf.arseneau@gmail.com"

RUN apt-get update && \
    apt-get install -y build-essential libevent-dev libssl-dev libxml2-dev libyaml-dev libgmp-dev git && \
    apt-get clean && rm -rf /var/lib/apt/lists/* /tmp/* /var/tmp/*
COPY . /antennas

EXPOSE 5004

WORKDIR "/antennas"
RUN shards update && shards install
RUN crystal build --release --no-debug src/antennas.cr
CMD ["/antennas/antennas"]
