use super::schema::guest_entries;
use chrono::NaiveDateTime;
use serde::Serialize;
#[derive(Debug, Queryable, Serialize)]
pub struct GuestEntry {
    pub id: i32,
    pub name: String,
    pub public: i32,
    #[serde(with = "naive_date_time_serde")]
    pub created_at: NaiveDateTime,
}

#[derive(Insertable)]
#[table_name = "guest_entries"]
pub struct NewGuestEntry<'a> {
    pub name: &'a str,
    pub public: i32,
    pub created_at: &'a NaiveDateTime,
}

mod naive_date_time_serde {
    use chrono::NaiveDateTime;
    // Deserialize, Deserializer,
    use serde::{self, Serializer};

    const FORMAT: &str = "%Y-%m-%d %H:%M:%S";

    pub fn serialize<S>(date: &NaiveDateTime, serializer: S) -> Result<S::Ok, S::Error>
    where
        S: Serializer,
    {
        let s = format!("{}", date.format(FORMAT));
        serializer.serialize_str(&s)
    }
}
