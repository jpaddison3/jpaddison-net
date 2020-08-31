use actix::SyncArbiter;
use actix_web::{get, web, App, HttpResponse, HttpServer, Responder};
use diesel::{Connection, SqliteConnection};
use listenfd::ListenFd;
use std::process;
use ziwo::{self, AppState, DbExecutor, EnvConfig, SignGuestBook};

#[get("/")]
async fn index(data: web::Data<AppState>) -> impl Responder {
    let guest_entry_fut = data.db_addr.send(SignGuestBook {
        name: String::from("Philodendron Hederaceum"),
        public: true,
    });
    let guest_entry_res_1 = guest_entry_fut.await;
    let guest_entry_res_2 = match guest_entry_res_1 {
        Ok(ger) => ger,
        Err(err) => {
            // TODO;
            panic!("{}", err)
        }
    };
    let guest_entry = match guest_entry_res_2 {
        Ok(ge) => ge,
        Err(err) => {
            // TODO;
            panic!("{}", err)
        }
    };
    HttpResponse::Ok().body(format!("Hello programmer, {}", guest_entry.name))
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
