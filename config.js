/* This file has been made to load the config dynamically, please run it with "npm run config" or "node config.js" anytime you need to change the config. */
const readline = require('readline');
const fs = require('fs');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function getSecretKey() {
    return new Promise((resolve, reject) => {
        console.log("-=-=-[ Secrets Config ]-=-=-")
        rl.question("Secret encryption key: ", (key) => {
            resolve(key)
        });
    });
}

function getWebConfig() {
    return new Promise((resolve, reject) => {
        console.log("-=-=-[ Website Config ]-=-=-")
        rl.question("Website domain: ", (web_domain) => {
            rl.question("Website port: ", (web_port) => {
                resolve({ web_domain, web_port });
            });
        });
    });
}

function getApiConfig() {
    return new Promise((resolve, reject) => {
        console.log("-=-=-=-[ API Config ]-=-=-=-")
        rl.question("API domain: ", (api_domain) => {
            rl.question("API port: ", (api_port) => {
                resolve({ api_domain, api_port });
            })
        })
    })
}

function getDatabaseConfig() {
    return new Promise((resolve, reject) => {
        console.log("-=-=-[ Database Config ]-=-=-")
        rl.question("Database host: ", (db_host) => {
            rl.question("Database name: ", (db_name) => {
                rl.question("Database user: ", (db_user) => {
                    rl.question("Database password: ", (db_password) => {
                        rl.question("Database port (5432): ", (db_port) => {
                            resolve({ db_host, db_name, db_user, db_password, db_port });
                        })
                    });
                });
            });
        });
    })
}

function writeEnvFile(config) {
    const data = 
    `DATABASE_USER=${config.db_user}
DATABASE_PASSWORD=${config.db_password}
DATABASE_NAME=${config.db_name}
DATABASE_HOST=${config.db_host}
DATABASE_PORT=${config.db_port}

API_DOMAIN=${config.api_domain}
API_PORT=${config.api_port}

WEBSITE_DOMAIN=${config.web_domain}
WEBSITE_PORT=${config.web_port}

SECRET_KEY=${config.key}`;

    fs.writeFileSync('.env', data);
}

function writeTsEnvFile(config) {
    const data = 
`export const environment = {
    API_DOMAIN: "${config.api_domain}",
    API_PORT: ${config.api_port},
    SECRET_KEY: ${config.key}
}`;

    fs.writeFileSync('src/environments/environment.ts', data);
}

async function askAndLoad() {
    const { web_domain, web_port } = await getWebConfig();
    const { api_domain, api_port } = await getApiConfig();
    const { key } = await getSecretKey();
    const { db_host, db_name, db_user, db_password, db_port } = await getDatabaseConfig();
    rl.close();

    const config = {
        web_domain,
        web_port,

        api_domain,
        api_port,

        db_host,
        db_name,
        db_user,
        db_password,
        db_port,

        key
    }

    writeEnvFile(config);
    writeTsEnvFile(config);

    console.clear();
    console.log("Successfully created config !")
}

askAndLoad();
