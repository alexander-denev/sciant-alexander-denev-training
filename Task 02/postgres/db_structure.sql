CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY, 
    email VARCHAR(255) UNIQUE, 
    hash VARCHAR(255),
    session_data VARCHAR(255)
);
CREATE TABLE IF NOT EXISTS tickers (
id SERIAL PRIMARY KEY,
symbol VARCHAR(255),
name VARCHAR(255)
);
CREATE TABLE IF NOT EXISTS user_tickers (
    user_id INT REFERENCES users(id),
    ticker_id INT REFERENCES tickers(id)
);
CREATE TABLE IF NOT EXISTS ticker_data (
    ticker_id INT REFERENCES tickers(id),
    at TIMESTAMP,
    price INT
);