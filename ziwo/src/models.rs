use chrono::NaiveDateTime;
#[derive(Debug, Queryable)]
pub struct GuestEntry {
    pub id: i32,
    pub name: String,
    pub public: i32,
    pub created_at: NaiveDateTime,
}
