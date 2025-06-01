const mongoose = require('mongoose');
const mongodbURL = process.env.mongodb;
const folderLoader = require('../../utils/folderLoader.js');
const { textEffects } = require('../../utils/loggingEffects.js');
const { asciiText } = require('../../lib/asciiText.js');

module.exports = {
    name: 'ready',
    once: true,
    async execute(client) {

        client.logs.info(`[SCHEMAS] Started loading schemas...`);

        if (!mongodbURL) {
            client.logs.error(`[DATABASE] No MongoDB URL has been provided. Double check your .env file and make sure it is correct. MongoDB is ${textEffects.bold}required${textEffects.reset} for ${client.user.username} to function.`);
            return;
        }

        try {
            mongoose.set("strictQuery", false);
            await mongoose.connect(mongodbURL || ``, {
            
                serverSelectionTimeoutMS: 10000,
            });
        } catch (err) {
            client.logs.error(`[DATABASE] Error connecting to the database: ${err}`);
            return;
        }

        folderLoader(client);
        asciiText(client, client.botStartTime);
    },
};
