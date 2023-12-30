# Inbox-Insights

Inbox-Insights is a Node.js-based application designed to automate email responses. It utilizes Google APIs for Gmail interaction, OAuth 2.0 for secure authentication, and various utility modules for scheduling, email handling, and random interval generation.

## Technologies and Libraries Used

### Node.js

It is built on Node.js, providing a scalable and asynchronous runtime for executing JavaScript on the server. Node.js enables efficient handling of asynchronous operations, making it suitable for building applications with non-blocking I/O.

### Google APIs

The application leverages Google APIs, specifically the [Gmail API](https://developers.google.com/gmail/api/guides), to perform operations such as reading, sending, and labeling emails. OAuth 2.0 authentication ensures secure and authorized access to the user's Gmail account.

### OAuth 2.0 Authentication

For secure authentication with the Gmail API, the app implements OAuth 2.0. It allows users to grant third-party applications limited access to their Gmail accounts without exposing login credentials.

### File System (fs) Module

The `fs` module is used for file system operations, such as reading and writing timestamp data. This ensures that the application processes only new emails received after the last update.

### Promises and async/await

To enhance code readability and avoid callback hell, the app extensively uses Promises and async/await syntax. This choice improves code maintainability and structure.

## How to Run

1. Clone the repository: `git clone https://github.com/thisisadi/Inbox-Insights.git`
2. Install dependencies: `npm install`
3. Configure Gmail API credentials by following instructions in the [documentation](https://developers.google.com/gmail/api/quickstart/nodejs)
4. Run the application: `node index.js`

## Modules

### `auth.js`

The `auth.js` module contains helper functions for handling authentication with the Gmail API.

#### `loadSavedCredentialsIfExist()`

This function attempts to load saved credentials from the local file system. If credentials exist, it returns an authenticated client; otherwise, it returns `null`.

#### `saveCredentials(client)`

Given an authenticated client, this function reads the client's credentials, prepares them for storage, and saves them to the local file system.

#### `authorize()`

This function manages the overall authentication process. It first tries to load saved credentials. If successful, it returns the authenticated client. If no saved credentials are found, it initiates the OAuth 2.0 authentication flow using the `authenticate` function from the `@google-cloud/local-auth` library.

### `email-handler.js`

The `email-handler.js` module contains functions for fetching and sending automated replies to unreplied email threads.

#### `fetchAndSendReplies(auth)`

This function orchestrates the entire process. It reads the last processed timestamp, fetches new email threads since that timestamp, and sends automated replies to unreplied threads.

#### `isReplySent(auth, threadId)`

Checks if an automated reply has been sent to a given email thread by examining the labels of the email messages.

#### `getSenderAddress(gmail, threadId)`

Retrieves the email address of the sender from a given email thread by examining the 'From' header.

#### `sendAutoReply(auth, threadId, senderAddress)`

Sends an automated reply to a given email thread, including a subject line and predefined reply message.

### `schedule.js`

The `schedule.js` module contains utility functions for managing time intervals and scheduling tasks.

#### `getRandomInterval(min, max)`

Generates a random interval between specified minimum and maximum values. This is used for introducing variability in the processing intervals of email threads.

#### `sleep(ms)`

An asynchronous sleep function that introduces pauses between repeated email processing cycles. It helps control the frequency of email checks and replies.

## Areas for Future Improvement

As I continue to enhance the app, some areas can be explored for further improvement and refinement:

1. **Optimized Email Processing with Pagination**: Implementing pagination logic for email fetching is a priority. Currently, fetching emails without pagination could lead to potential memory limitations on the server running the Node.js app, as well as scenarios where the number of emails exceeds the Gmail API's maximum limit. By introducing pagination, I aim to address this issue, ensuring comprehensive coverage of all incoming messages while mitigating potential memory constraints on the server.

2. **Optimized Email Processing with Scheduled Cron Jobs**: To enhance the precision and predictability of email processing, I plan to transition from random intervals to scheduled cron jobs. This shift aims to optimize resource utilization, improve responsiveness, and mitigate potential latency concerns. The goal is to implement a more deterministic approach, evaluating and implementing strategies to reduce variability in response times.

3. **Custom Replies with NLP Models**: Exploring the integration of Natural Language Processing (NLP) models is on the horizon. This would enable the app to generate custom replies tailored to the content of each email thread, enhancing the personalization of automated responses.

4. **Containerization**: Using containerization to simplify deployment and improve the portability of the app across different environments.