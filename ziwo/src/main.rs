use actix::SyncArbiter;
use actix_cors::Cors;
use actix_web::{get, middleware, post, web, App, HttpResponse, HttpServer, Responder};
use diesel::{Connection, SqliteConnection};
use listenfd::ListenFd;
use std::process;
use ziwo::{
    self, get_guest_book, sign_guest_book, AppState, DbExecutor, EnvConfig, InstanceEnv,
    SignGuestBook,
};

#[get("/")]
async fn index(_: web::Data<AppState>) -> impl Responder {
    HttpResponse::Ok()
        .body("This is an api service. Perhapse you meant the endpoint at /guest-book?")
}

#[get("/guest-book")]
async fn guest_book(data: web::Data<AppState>) -> impl Responder {
    match get_guest_book(&data.db_addr).await {
        Ok(guest_entries) => HttpResponse::Ok().json(guest_entries),
        Err(err) => {
            eprintln!("{}, returning error", err);
            HttpResponse::InternalServerError().body(format!("{}", err))
        }
    }
}

#[post("/guest-book/new")]
async fn guest_book_new(
    (sign_req, app_data): (web::Json<SignGuestBook>, web::Data<AppState>),
) -> impl Responder {
    let sign_attempt_result = sign_guest_book(&app_data.db_addr, sign_req.0).await;
    match sign_attempt_result {
        Ok(()) => HttpResponse::Ok().body(""),
        Err(err) => {
            eprintln!("{}, returning error", err);
            HttpResponse::InternalServerError().body(format!("{}", err))
        }
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

    // Start sync actors db connections
    let database_url = env_conf.database_url.clone();
    let db_addr = SyncArbiter::start(3, move || {
        let conn = SqliteConnection::establish(&database_url)
            .expect("Database connection failed, TODO: handle this");
        DbExecutor(conn)
    });

    // For autoreload
    let mut listenfd = ListenFd::from_env();

    let app_env_conf = env_conf.clone();
    let mut server = HttpServer::new(move || {
        App::new()
            .service(index)
            .service(guest_book)
            .service(guest_book_new)
            .data(AppState {
                env_conf: app_env_conf.clone(),
                db_addr: db_addr.clone(),
            })
            .wrap(middleware::Condition::new(
                !app_env_conf.is_prod(),
                Cors::new()
                    .allowed_origin("http://localhost:3000")
                    .allowed_methods(vec!["GET", "POST"])
                    .max_age(3600)
                    .finish(),
            ))
    });
    if let InstanceEnv::Dev = env_conf.instance_env {
        server = if let Some(l) = listenfd.take_tcp_listener(0).unwrap() {
            // I believe this is saying: if we've been here before, we can reuse the listener
            server.listen(l)?
        } else {
            // I believe this is saying: first time => bind
            // TODO: configurable
            server.bind("127.0.0.1:8088")?
        };
    } else {
        server = server.bind("0.0.0.0:80")?
    }

    println!("Starting http server:");
    server.run().await?;

    Ok(())
}
