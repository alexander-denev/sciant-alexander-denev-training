CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY, 
    email VARCHAR(255) UNIQUE, 
    hash VARCHAR(255),
    userdata JSON
);
INSERT INTO users (email, hash, userdata) VALUES ('admin', '$argon2id$v=19$m=65536,t=3,p=4$8Q+v1SN2EJGKuI8+pLp9gw$nPPmKx+mYlR9ljP6TPq+C1/TBTGOIOg8yqhWk4LwhnM', '{ "name":"Mr. Admin", "age":"Infinite" }');

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