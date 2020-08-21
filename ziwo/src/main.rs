use std::process;
use ziwo::EnvConfig;

fn main() {
    let _env_conf = match EnvConfig::new() {
        Ok(e) => e,
        Err(_) => {
            println!("Must have ENV in your environment"); // TODO;
            process::exit(1);
        }
    };
    // if env_conf.is_prod() {
    //     panic!("TODO: Production support");
    // }
    println!("Hello, world!");
}
