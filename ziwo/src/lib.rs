use anyhow::{self, Result};
use std::env;
use thiserror::Error;

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

pub enum InstanceEnv {
    Production,
    Staging,
    Test,
    Dev,
}
