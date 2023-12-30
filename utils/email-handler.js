const fs = require('fs').promises;
const { google } = require('googleapis');
const config = require('../config');

// Fetches emails and sends automated replies to unreplied email threads.
async function fetchAndSendReplies(auth) {
    const gmail = google.gmail({ version: 'v1', auth });

    try {
        // Read the last processed timestamp from the file
        const timestampData = await fs.readFile('timestamp.json', 'utf-8');
        const timestampJson = JSON.parse(timestampData);
        const lastProcessedTimestamp = timestampJson.lastProcessedTimestamp;
        console.log('Last Processed Timestamp: ', lastProcessedTimestamp);

        // List new threads in the inbox since the last processed timestamp
        const listResponse = await gmail.users.threads.list({
            userId: 'me',
            q: lastProcessedTimestamp ? `to:me AND is:inbox after:${lastProcessedTimestamp}` : 'to:me AND is:inbox',
        });

        const threads = listResponse.data.threads || [];
        console.log('New threads: ', threads.length);

        for (const thread of threads) {
            // Check if a reply has been sent to this thread
            const hasSentReply = await isReplySent(auth, thread.id);

            if (!hasSentReply) {
                // Retrieve the sender's email address
                const senderAddress = await getSenderAddress(gmail, thread.id);

                // Send an automated reply
                await sendAutoReply(auth, thread.id, senderAddress);
            }
        }
    } catch (error) {
        console.error('Error fetching and sending replies:', error.message);
    }
}

// Checks if an automated reply has been sent to a given email thread.
async function isReplySent(auth, threadId) {
    const gmail = google.gmail({ version: 'v1', auth });

    // Get details of the email thread
    const threadDetails = await gmail.users.threads.get({ userId: 'me', id: threadId });
    const messages = threadDetails.data.messages;

    for (const message of messages) {
        // Check if the email is labeled as 'SENT'
        const labels = (await gmail.users.messages.get({ userId: 'me', id: message.id })).data.labelIds || [];
        if (labels.includes('SENT')) {
            return true;
        }
    }

    return false;
}

// Retrieves the email address of the sender from a given email thread.
async function getSenderAddress(gmail, threadId) {
    const threadDetails = await gmail.users.threads.get({ userId: 'me', id: threadId });
    const messages = threadDetails.data.messages;

    for (const message of messages) {
        // Extract the 'From' header from the email
        const headers = (await gmail.users.messages.get({ userId: 'me', id: message.id })).data.payload.headers;
        const fromHeader = headers.find(header => header.name.toLowerCase() === 'from');

        if (fromHeader) {
            return fromHeader.value;
        }
    }

    return null;
}

// Sends an automated reply to a given email thread.
async function sendAutoReply(auth, threadId, senderAddress) {
    const gmail = google.gmail({ version: 'v1', auth });
    await gmail.users.messages.send({
        userId: 'me',
        requestBody: {
            threadId: threadId,
            raw: Buffer.from(
                `To: ${senderAddress}\r\n` +
                `${config.subjectLine}\r\n` +
                `${config.replyMessage}`
            ).toString('base64'),
        },
    });
}

module.exports = {
    fetchAndSendReplies,
};
