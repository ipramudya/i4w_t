import 'dotenv/config'
import { TelegramBot } from './bot'

const BOT_TOKEN = process.env.BOT_TOKEN

if (!BOT_TOKEN) {
	console.error('BOT_TOKEN is required in environment variables')
	process.exit(1)
}

const bot = new TelegramBot(BOT_TOKEN)
bot.start()
