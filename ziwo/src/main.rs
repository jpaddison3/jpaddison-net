use diesel::prelude::*;
use ziwo::models::*;
use ziwo::schema::guest_entries::dsl::*;

use diesel::SqliteConnection;
use std::process;
use ziwo::EnvConfig;

fn main() {
    let env_conf = match EnvConfig::new() {
        Ok(ec) => ec,
        Err(err) => {
            eprintln!("Could not load config got, {}", err);
            process::exit(1);
        }
    };
    if env_conf.is_prod() {
        panic!("TODO: Production support");
    }
    let conn =
        SqliteConnection::establish(&env_conf.database_url).expect("Could not connect to database");

    let guest_book = guest_entries
        .filter(public.eq(1))
        .limit(5)
        .load::<GuestEntry>(&conn)
        .expect("Error loading guest entries");

    for guest_name in guest_book {
        println!("{:#?}", guest_name);
    }
}
