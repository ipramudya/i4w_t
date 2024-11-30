# Telegram Ad Bot

A Telegram bot that promotes ads based on user messages using natural language processing and TensorFlow.js to match keywords in the message with stored ads. The bot connects with users and shares the most relevant ad based on the similarity of their messages.

## Architecture Overview

The bot is built with the following components:

- **Telegraf**: A framework to interact with the Telegram Bot API and handle commands and messages.
- **TensorFlow.js**: For running a pre-trained Universal Sentence Encoder model to encode and match the similarity of user messages to stored ads.

## Folder Structure

```
.
├── .env                     # Environment variables (e.g., BOT_TOKEN)
├── nodemon.json             # Nodemon configuration for auto-reloading in development
├── package.json             # Project dependencies and scripts
├── src/
│   ├── data/
│   │   └── ads.json         # JSON file storing ad information
│   ├── bot.ts               # Telegram bot logic and message handling
│   ├── ad-processor.ts      # Ad processing and NLP logic
│   ├── index.ts             # Entry point of the application
│   └── types.ts             # TypeScript types for ads
├── tsconfig.json            # TypeScript configuration
└── package-lock.json        # Locked dependencies for npm

```

## Depedencies

- @tensorflow-models/universal-sentence-encoder: Pre-trained model for encoding text into embeddings.
- @tensorflow/tfjs-node: TensorFlow.js library for Node.js.
- telegraf: Telegram Bot API framework for building the bot.
- dotenv: For managing environment variables.
- typescript: For TypeScript-based development.
- nodemon: For automatic restarting of the app during development.
- prettier: For code formatting.

## Setup and Instalation

### Prerequisites

- Node.js (v14+ recommended)
- npm or yarn package manager

### Step to Get Started

1. Clone the depedencies

```bash
git clone <repository_url>
cd <project_directory>
```

2. Install depedencies

```bash
npm install
```

3. Configure bot token environtment variable

```bash
BOT_TOKEN=your_bot_token_here
```

4. Build and run the application:

- Development environtment, (with auto-reloading via nodemon):

```bash
npm run dev
```

- Production mode (build and run):

```bash
npm run build
npm run serve
```

5. Start interacting with the bot:

- Open your Telegram app and search for @indo4ward_ad_bot or visit t.me/indo4ward_ad_bot.
- Start a chat and see the bot respond with relevant ads (relevant ads could be found on `src/data/ads.json`).

## How Matching Works

1. Message Preprocessing: Incoming user messages are preprocessed by converting them to lowercase and removing punctuation. This helps in matching the keywords accurately.

2. Ad Matching: For each incoming message, the bot compares the user's message to the stored ads by encoding both the message and the ad keywords using the Universal Sentence Encoder model.

3. Cosine Similarity: The bot calculates the cosine similarity between the embeddings of the user message and each ad's keyword list. The ad with the highest similarity is returned as the most relevant ad.

4. Ad Display: If the similarity score exceeds a threshold (e.g., 0.5), the bot responds with the corresponding ad text. Otherwise, the bot replies with a generic message.

## Troubleshooting

- **Bot Token Missing:** If the bot fails to start, make sure the BOT_TOKEN is correctly set in the .env file.
- **Model Not Loaded:** Ensure TensorFlow.js and the Universal Sentence Encoder model are properly loaded. If issues arise, check the TensorFlow.js installation or GPU/CPU availability.
- **No Ads Found:** If the bot doesn't find a relevant ad, try testing with different keywords or reviewing the ads.json file for accuracy.
