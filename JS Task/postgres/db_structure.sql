CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY, 
    email VARCHAR(255) UNIQUE, 
    hash VARCHAR(255),
    userdata JSON
);
INSERT INTO users (email, hash, userdata) VALUES ('admin', '$argon2id$v=19$m=65536,t=3,p=4$8Q+v1SN2EJGKuI8+pLp9gw$nPPmKx+mYlR9ljP6TPq+C1/TBTGOIOg8yqhWk4LwhnM', '{ "name":"Mr. Admin", "age":"Infinite" }');

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





INSERT INTO tickers (symbol) VALUES ('ETHUSD');
INSERT INTO user_tickers (user_id, ticker_id) VALUES (1, 1);
INSERT INTO ticker_data (ticker_id, at, price) VALUES (1, 1690272692, 149.33);
INSERT INTO ticker_data (ticker_id, at, price) VALUES (1, 1690272700, 144.80);

INSERT INTO tickers (symbol) VALUES ('BTCUSD');
INSERT INTO user_tickers (user_id, ticker_id) VALUES (1, 2);
INSERT INTO ticker_data (ticker_id, at, price) VALUES (2, 1690272697, 561.84);
INSERT INTO ticker_data (ticker_id, at, price) VALUES (2, 1690273696, 700.21);