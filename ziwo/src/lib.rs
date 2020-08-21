use std::env;
use thiserror::Error;
use anyhow::{self, Result};

pub struct EnvConfig {
    pub instance_env: InstanceEnv,
    pub database_url: String,
}

#[derive(Error, Debug)]
pub enum ConfigError {
    #[error("unrecognized instance environment error")]
    UnrecognizedIntanceEnv,
}

impl EnvConfig {
    pub fn new() -> Result<EnvConfig> {
        dotenv::dotenv()?;

        let instance_env =         match &env::var("ENV")?[..] {
                "Production" => InstanceEnv::Production,
                "Staging" => InstanceEnv::Staging,
                "Test" => InstanceEnv::Test,
                "Dev" => InstanceEnv::Dev,
                _ => anyhow::bail!(ConfigError::UnrecognizedIntanceEnv),
            };
        let database_url = env::var("DATABASE_URL")?;

        Ok(EnvConfig {
            instance_env,
            database_url,
        })
    }

    // pub fn is_prod(&self) -> bool {
    //     if self.instance_env == InstanceEnv::Production {
    //         true
    //     } else {
    //         false
    //     }
    // }
}

pub enum InstanceEnv {
    Production,
    Staging,
    Test,
    Dev,
}
