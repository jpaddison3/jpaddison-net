use actix::SyncArbiter;
use actix_web::{get, web, App, HttpResponse, HttpServer, Responder};
use diesel::{Connection, SqliteConnection};
use listenfd::ListenFd;
use std::process;
use ziwo::{self, AppState, DbExecutor, EnvConfig, InstanceEnv};

#[get("/")]
async fn index(data: web::Data<AppState>) -> impl Responder {
    if let InstanceEnv::Production = &data.env_conf.instance_env {
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
    if env_conf.is_prod() {
        panic!("TODO: Production support");
    }

    // Start sync actors db connections
    let database_url = env_conf.database_url.clone();
    let db_addr = SyncArbiter::start(3, move || {
        let conn = SqliteConnection::establish(&database_url)
            .expect("Database connection failed, TODO: handle this");
        DbExecutor(conn)
    });

    // For autoreload
    let mut listenfd = ListenFd::from_env();

    let mut server = HttpServer::new(move || {
        App::new().service(index).data(AppState {
            env_conf: env_conf.clone(),
            db_addr: db_addr.clone(),
        })
    });
    server = if let Some(l) = listenfd.take_tcp_listener(0).unwrap() {
        // I believe this is saying: if we've been here before, we can reuse the listener
        server.listen(l)?
    } else {
        // I believe this is saying: first time => bind
        // TODO: configurable
        server.bind("127.0.0.1:8088")?
    };

    println!("Starting http server:");
    server.run().await?;

    Ok(())
}
