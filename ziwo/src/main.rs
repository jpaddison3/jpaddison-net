use diesel::prelude::*;

use diesel::SqliteConnection;
use std::process;
use ziwo::{self, EnvConfig};

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

    ziwo::get_and_print_guest_book(&conn);
    if let Err(err) = ziwo::create_signature(
        &conn,
        "Peperomia Argyreia",
        true,
        &chrono::NaiveDateTime::parse_from_str("2020-08-22T10-00-00", "%Y-%m-%dT%H-%M-%S").unwrap(),
    ) {
        panic!("{}", err)
    }
    ziwo::get_and_print_guest_book(&conn);
}
