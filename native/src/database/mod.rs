use std::sync::Mutex;
use std::collections::HashMap;

use napi::{Error, Result};
use serde_json::{Value, Number};

use base64::Engine;
use base64::engine::general_purpose;

use rusqlite::{ToSql, Connection};
use rusqlite::types::Type;

#[napi]
pub struct Database {
    conn: Mutex<Connection>,
}

#[napi]
impl Database {
    // 构造函数
    #[napi(constructor)]
    pub fn new(path: String) -> Result<Self> {
        let conn = Connection::open(path).map_err(|e| {
            Error::from_reason(format!("Failed to open database: {:?}", e))
        })?;

        Ok(Database {
            conn: Mutex::new(conn),
        })
    }

    // 析构函数
    #[napi]
    pub fn close(&self) {}

    // 执行查询 
    #[napi]
    pub fn query(&self, sql: String, params: Vec<String>) -> Result<Vec<HashMap<String, Value>>> {
        let conn = self.conn.lock().unwrap();
        let params: Vec<&dyn ToSql> = params.iter().map(|p| p as &dyn ToSql).collect();

        let mut stmt = conn.prepare(&sql).map_err(|e| {
            Error::from_reason(format!("Failed to parse SQL: {}", e))
        })?;

        let count = stmt.column_count();
        let mut rows = stmt.query(params.as_slice()).map_err(|e| {
            Error::from_reason(format!("Failed to query SQL: {}", e))
        })?;

        let mut result = Vec::new();
        while let Some(row) = rows.next().map_err(|e| {
            Error::from_reason(format!("Failed to iterate over rows: {}", e))
        })? {
            let mut item = HashMap::new();
            for idx in 0..count {
                let name = row.as_ref().column_name(idx).unwrap().to_string();
                let value = row.get_ref_unwrap(idx);

                match value.data_type() {
                    Type::Null => {
                        item.insert(name, Value::Null);
                    }
                    Type::Integer => {
                        item.insert(name, Value::Number(
                            value.as_i64().unwrap().into()
                        ));
                    }
                    Type::Real => {
                        item.insert(name, Value::Number(
                            Number::from_f64(value.as_f64().unwrap().into()).unwrap()
                        ));
                    }
                    Type::Text => {
                        item.insert(name, Value::String(
                            value.as_str().unwrap().to_string()
                        ));
                    }
                    Type::Blob => {
                        item.insert(name, Value::String(
                            general_purpose::STANDARD.encode(value.as_blob().unwrap())
                        ));
                    }
                }
            }
            result.push(item);
        }

        Ok(result)
    }

    // 执行 创建/插入/更新/删除 等操作
    #[napi]
    pub fn execute(&self, sql: String, params: Vec<String>) -> Result<bool> {
        let conn = self.conn.lock().unwrap();
        let params: Vec<&dyn ToSql> = params.iter().map(|p| p as &dyn ToSql).collect();

        conn.execute(&sql, params.as_slice()).map_err(|e| {
            Error::from_reason(format!("Failed to execute SQL: {}", e))
        })?;
        
        Ok(true)
    }
}
