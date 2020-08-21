use std::process;
use ziwo::EnvConfig;

fn main() {
    let env_conf = match EnvConfig::new() {
        Ok(ec) => ec,
        Err(err) => {
            eprintln!("Could not load config got, {}", err); // TODO;
            process::exit(1);
        }
    };
    if env_conf.is_prod() {
        panic!("TODO: Production support");
    }
    println!("Hello, world!");
}
