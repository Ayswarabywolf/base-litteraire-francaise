$env:PGPASSWORD = "postgres"
psql -U postgres -f init_db.sql
