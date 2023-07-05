const argon2 = require('argon2');
const { Pool } = require('pg');

class Options {

    async connection() {

        if (!this.pool) {
            this.pool = new Pool({
                user: 'root',
                password: 'root',
                host: 'localhost',
                port: 5432,
                database: 'baza'
            });
        }
    }
    
    async create_user(email, password) {

        await this.connection();
        
        try {

            await argon2.hash(password).then(async hash => {
                await this.pool.query(`
                    INSERT INTO users (email, hash)
                    VALUES ($1, $2)`, [email, hash]);
                console.log("User " + email + " created");
            });

        } catch (error) {
            console.log(error);
        }
    }

    async login_user(email, password) {

        await this.connection();

        try {
            let result = await this.pool.query(`
                SELECT hash FROM users WHERE email = $1
            `, [email]);
            let hash = result.rows[0]['hash'];

            if (result.rows[0]) {
                await argon2.verify(hash, password).then(result => {
                    if (result) {
                        console.log("Password matches");
                    } else {
                        console.log("Password mismatches");
                    }
                }).catch(error => {console.log(error);});
            } else {
                console.log("User doesn't exist");
            }
        } catch (error) {
            console.log(error);
        }
    }
}



const options = new Options();

if (!process.argv[2]) {
    console.log("Options are: create_user, login_user");
} else {
    if (options[process.argv[2]] && typeof options[process.argv[2]] === "function") {
        options[process.argv[2]](process.argv[3], process.argv[4]);
    } else {
        console.log("Invalid option. Options are: create_user, login_user");
    }
}