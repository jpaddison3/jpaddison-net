FROM rust:1.45

WORKDIR /usr/src/ziwo
COPY . .

RUN cargo install --path .

EXPOSE 80

CMD ["ziwo"]
