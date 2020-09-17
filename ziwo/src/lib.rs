//! TODO Doc
#[macro_use]
extern crate diesel;

use actix::prelude::*;
use anyhow::{self, Result};
use diesel::prelude::*;
use serde::Deserialize;
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
    #[error("unrecognized instance environment: '{0}'")]
    UnrecognizedIntanceEnv(String),
}

// Configuration from environment variables
impl EnvConfig {
    // Get environment variables, with help from dotenv
    pub fn new() -> Result<EnvConfig> {
        match dotenv::dotenv() {
            Ok(_) => (),
            Err(err) => println!("Not using .env file: {}", err),
        };

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

/// Struct that handles async communication with the DB
///
/// Meant to be run on synchronous threads
pub struct DbExecutor(pub SqliteConnection);

impl Actor for DbExecutor {
    type Context = SyncContext<Self>;
}

impl Handler<SignGuestBook> for DbExecutor {
    type Result = QueryResult<()>;

    fn handle(&mut self, msg: SignGuestBook, _: &mut Self::Context) -> Self::Result {
        let new_entry = models::NewGuestEntry {
            name: &msg.name,
            public: if msg.public { 1 } else { 0 },
            created_at: &chrono::offset::Utc::now().naive_utc(),
        };

        diesel::insert_into(guest_entries)
            .values(&new_entry)
            .execute(&self.0)?;

        Ok(())
        // Err(DieselError::AlreadyInTransaction)
    }
}

impl Handler<GetGuestBook> for DbExecutor {
    type Result = QueryResult<Vec<GuestEntry>>;

    fn handle(&mut self, msg: GetGuestBook, _: &mut Self::Context) -> Self::Result {
        let items = guest_entries
            .filter(public.eq(1))
            .limit(msg.num_entries)
            .order(created_at.desc())
            .load::<models::GuestEntry>(&self.0)?;

        Ok(items)
    }
}

/// Message that can be sent to DbExecutor to create a new guest_entry
#[derive(Deserialize, Debug)]
pub struct SignGuestBook {
    pub name: String,
    pub public: bool,
}

impl Message for SignGuestBook {
    type Result = QueryResult<()>;
}

pub struct GetGuestBook {
    pub num_entries: i64,
}

impl Message for GetGuestBook {
    type Result = QueryResult<Vec<GuestEntry>>;
}

#[derive(Debug, Error)]
pub enum SignatureRejection {
    #[error("name must not be empty")]
    MissingName,
}

// TODO: I guess this could be a method on a enum struct that wrapped db_addr
pub async fn sign_guest_book(db_addr: &Addr<DbExecutor>, guest_entry: SignGuestBook) -> Result<()> {
    if guest_entry.name == "" {
        anyhow::bail!(SignatureRejection::MissingName);
    }
    // Double layer of Result. First "try" the MessageError Result type from the
    // send, then try the QueryResult it returns
    db_addr.send(guest_entry).await??;
    Ok(())
}

pub async fn get_guest_book(db_addr: &Addr<DbExecutor>) -> Result<Vec<GuestEntry>> {
    // Isn't it beautiful?
    Ok(db_addr.send(GetGuestBook { num_entries: 7 }).await??)
}

/// All application state lives here. It get's passed to App.data in the App
/// factory, and gets passed as the first argument to all services
pub struct AppState {
    pub env_conf: EnvConfig,
    pub db_addr: Addr<DbExecutor>,
}
