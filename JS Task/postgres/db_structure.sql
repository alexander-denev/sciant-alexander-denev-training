CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY, 
    email VARCHAR(255) UNIQUE, 
    hash VARCHAR(255),
    userdata JSON
);
INSERT INTO users (email, hash, userdata) VALUES ('admin', '$argon2id$v=19$m=65536,t=3,p=4$wFjyLoltSVrHXNG7jyzWkQ$2BaoysGWItu4G9F+JCES0BOBLjJbcYa6xtwvZ6Zesxs', '{ "name":"Mr. Admin", "age":"Infinite" }');

CREATE TABLE IF NOT EXISTS tickers (
    id SERIAL PRIMARY KEY,
    symbol VARCHAR(255) UNIQUE
);

CREATE TABLE IF NOT EXISTS user_tickers (
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(id),
    ticker_id INT REFERENCES tickers(id),
    UNIQUE(user_id, ticker_id)
);

CREATE TABLE IF NOT EXISTS ticker_data (
    id SERIAL PRIMARY KEY,
    ticker_id INT REFERENCES tickers(id),
    at BIGINT,
    price NUMERIC
);