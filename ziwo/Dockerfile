FROM rust:1.45 as cargo-build

WORKDIR /usr/src/ziwo

COPY Cargo.toml Cargo.toml
COPY Cargo.lock Cargo.lock

RUN mkdir src/

RUN echo "fn main() {println!(\"if you see this, the build broke\")}" > src/main.rs

RUN cargo build --release

RUN cargo install diesel_cli --no-default-features --features sqlite

RUN rm -f target/release/deps/ziwo*

COPY . .

RUN cargo build --release --frozen

RUN cargo install --path . --locked

FROM debian:buster-slim
#rust:1.45

RUN apt-get update && apt-get install -y sqlite3
RUN rm -rf /var/lib/apt/lists/*

WORKDIR /usr/local/ziwo

COPY --from=cargo-build /usr/local/cargo/bin/ziwo /usr/local/bin/ziwo
COPY --from=cargo-build /usr/local/cargo/bin/diesel /usr/local/bin/diesel

COPY migrations migrations

ENV DATABASE_URL=prod.db
RUN diesel migration run

EXPOSE 8080

CMD ["ziwo"]
