const fs = require('fs');
const { authorize } = require('./utils/auth');
const { fetchAndSendReplies } = require('./utils/email-handler');
const { getRandomInterval, sleep } = require('./utils/schedule');
const config = require('./config');

async function main() {
    try {
        // Authenticate with Gmail API
        const client = await authorize();

        while (true) {
            console.log("Processing emails...");

            // Record the timestamp before processing
            const newTimestampData = {
                lastProcessedTimestamp: Math.floor(Date.now() / 1000)
            };
            await fetchAndSendReplies(client);

            // Update the timestamp file with the new timestamp
            await fs.writeFileSync('timestamp.json', JSON.stringify(newTimestampData, null, 2), 'utf-8');
            console.log("Processing completed.");
            const interval = getRandomInterval(config.minInterval, config.maxInterval);
            await sleep(interval);
        }
    } catch (error) {
        console.error('Error: ', error);
    }
}

main();