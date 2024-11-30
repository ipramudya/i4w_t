import { Context, Telegraf } from 'telegraf'
import { message } from 'telegraf/filters'

export class TelegramBot {
	private bot: Telegraf

	constructor(token: string) {
		if (!token) throw new Error('token is required to access the bot')

		this.bot = new Telegraf(token)
		this.initializeHandlers()
	}

	/**
	 * Initialize bot command and message handlers.
	 */
	private initializeHandlers(): void {
		this.bot.command('start', this.handleStart.bind(this))
		this.bot.on(message('text'), this.handleIncomingMessage.bind(this))

		// Catch unhandled errors
		this.bot.catch((error) => {
			console.log(`Unhandled error: ${(error as Error).message}`)
		})
	}

	/**
	 * Handle the '/start' command.
	 * @param ctx - Telegraf context.
	 */
	private async handleStart(ctx: Context): Promise<void> {
		await ctx.reply(
			"Hello! I'm your friendly bot. I might share some relevant offers along the way!",
		)
	}

	/**
	 * Handle incoming text messages.
	 * @param ctx - Telegraf context.
	 */
	private async handleIncomingMessage(ctx: Context): Promise<void> {
		try {
			if (ctx.message && 'text' in ctx.message && ctx.chat) {
				const userId = ctx.message.from.id
				const message = ctx.message.text

				console.log(`Received message from user ${userId}: ${message}`)
			}
		} catch (error) {
			console.log(`Error handling incoming message: ${(error as Error).message}`)
			await ctx.reply('Sorry, something went wrong while processing your message.')
		}
	}

	/**
	 * Start the bot instance.
	 */
	public start(): void {
		this.bot
			.launch(() => console.log('Bot started successfully'))
			.catch((error) => console.log(`Failed to start the bot: ${error.message}`))

		process.once('SIGINT', () => this.bot.stop('SIGINT'))
		process.once('SIGTERM', () => this.bot.stop('SIGTERM'))
	}
}
