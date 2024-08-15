use std::sync::Mutex;

use napi::Result;
use rusqlite::{Connection};

#[napi]
pub struct Database {
    conn: Mutex<Connection>,
}

#[napi]
impl Database {
    #[napi(constructor)]
    pub fn new(path: String) -> Result<Self> {
        let conn = Connection::open(path).unwrap();
        Ok(Database {
            conn: Mutex::new(conn)
        })
    }
}