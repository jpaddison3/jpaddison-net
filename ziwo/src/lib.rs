#[macro_use]
extern crate diesel;

use anyhow::{self, Result};
use chrono::NaiveDateTime;
use diesel::prelude::*;
use std::env;
use thiserror::Error;

pub mod models;
pub mod schema;

use self::models::*;
use self::schema::guest_entries::dsl::*;

#[derive(Debug, Clone)]
pub struct EnvConfig {
    pub instance_env: InstanceEnv,
    pub database_url: String,
}

#[derive(Error, Debug)]
pub enum ConfigError {
    #[error("unrecognized instance environment '{0}'")]
    UnrecognizedIntanceEnv(String),
}

impl EnvConfig {
    pub fn new() -> Result<EnvConfig> {
        dotenv::dotenv()?;

        let instance_env = match &env::var("ENV")?[..] {
            "production" => InstanceEnv::Production,
            "staging" => InstanceEnv::Staging,
            "test" => InstanceEnv::Test,
            "dev" => InstanceEnv::Dev,
            s => anyhow::bail!(ConfigError::UnrecognizedIntanceEnv(String::from(s))),
        };
        let database_url = env::var("DATABASE_URL")?;

        Ok(EnvConfig {
            instance_env,
            database_url,
        })
    }

    pub fn is_prod(&self) -> bool {
        if let InstanceEnv::Production = self.instance_env {
            true
        } else {
            false
        }
    }
}

#[derive(Debug, Clone, Copy)]
pub enum InstanceEnv {
    Production,
    Staging,
    Test,
    Dev,
}

pub fn create_signature<'a>(
    conn: &SqliteConnection,
    name_: &'a str,
    public_: bool,
    created_at_: &'a NaiveDateTime,
) -> Result<()> {
    use schema::guest_entries;

    let new_entry = NewGuestEntry {
        name: name_,
        public: if public_ { 1 } else { 0 },
        created_at: created_at_,
    };

    diesel::insert_into(guest_entries::table)
        .values(&new_entry)
        .execute(conn)?;

    Ok(())
}

pub fn get_and_print_guest_book(conn: &SqliteConnection) {
    let guest_book = match guest_entries
        .filter(public.eq(1))
        .limit(5)
        .load::<GuestEntry>(conn)
    {
        Ok(gb) => gb,
        Err(err) => panic!("Error loading guest entries: {}", err),
    };

    if guest_book.is_empty() {
        println!("Empty guestbook");
        return;
    }
    println!("Guests:");
    for guest_name in guest_book {
        println!(" * {}", guest_name.name);
    }
}
