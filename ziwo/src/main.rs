use actix_web::{get, web, App, HttpResponse, HttpServer, Responder};
use listenfd::ListenFd;
use std::process;
use ziwo::{self, EnvConfig, InstanceEnv};

#[get("/")]
async fn index(data: web::Data<EnvConfig>) -> impl Responder {
    if let InstanceEnv::Production = &data.instance_env {
        HttpResponse::Ok().body("Hello this site is professional")
    } else {
        HttpResponse::Ok().body("Hello programmer")
    }
}

#[actix_rt::main]
async fn main() -> std::io::Result<()> {
    let env_conf = match EnvConfig::new() {
        Ok(ec) => ec,
        Err(err) => {
            eprintln!("Failed to load environment configuration, got: {}", err);
            process::exit(1);
        }
    };
    let mut listenfd = ListenFd::from_env();

    let mut server = HttpServer::new(move || App::new().service(index).data(env_conf.clone()));

    server = if let Some(l) = listenfd.take_tcp_listener(0).unwrap() {
        server.listen(l)?
    } else {
        server.bind("127.0.0.1:8088")?
    };

    server.run().await
}
