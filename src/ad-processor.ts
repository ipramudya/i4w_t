import * as use from '@tensorflow-models/universal-sentence-encoder'
import * as tf from '@tensorflow/tfjs-node'
import fs from 'fs/promises'
import path from 'path'
import type { Ad } from './types'

export class AdProcessor {
	private ads: Ad[] = []
	private model: use.UniversalSentenceEncoder | null = null

	public async initialize(): Promise<void> {
		if (!this.model) {
			this.model = await use.load()
		}
		this.ads = await this.loadAds()
	}

	private async loadAds(): Promise<Ad[]> {
		const adsPath = path.join(__dirname, 'data', 'ads.json')
		const data = await fs.readFile(adsPath, 'utf-8')

		return JSON.parse(data) as Ad[]
	}

	public async analyzeMessage(message: string): Promise<string | null> {
		if (!this.model) {
			throw new Error('model not initialized')
		}

		// Encode the user message
		const preprocessMessage = this.preprocessText(message)
		const userEmbedding = (await this.model.embed(preprocessMessage)) as unknown as tf.Tensor2D

		let bestAd: Ad | null = null
		let highestScore = 0

		for (const ad of this.ads) {
			const adText = ad.keywords.join(' ')
			const preprocessedAdText = this.preprocessText(adText)
			const adEmbedding = (await this.model.embed(preprocessedAdText)) as unknown as tf.Tensor2D

			// Calculate similarity (cosine similarity)
			const similarity = this.computeCosineSimilarity(userEmbedding, adEmbedding)

			if (similarity > highestScore) {
				highestScore = similarity
				bestAd = ad
			}
		}

		// Return the best ad if it meets the similarity threshold
		return highestScore > 0.5 ? bestAd?.text || null : null
	}

	/**
	* Calculates the cosine similarity between two vectors (represented as TensorFlow tensors),
	which is a measure of similarity between two non-zero vectors based on the cosine of the angle between them
	*/
	private computeCosineSimilarity(a: tf.Tensor2D, b: tf.Tensor2D): number {
		const dotProduct = tf.sum(tf.mul(a, b)).arraySync() as number
		const normA = tf.sqrt(tf.sum(tf.square(a))).arraySync() as number
		const normB = tf.sqrt(tf.sum(tf.square(b))).arraySync() as number
		return dotProduct / (normA * normB)
	}

	/**
	 * Convert the message to lowercase, remove non-alphanumeric characters, and trim whitespace
	 * @example
	 * Input: "Hello, World! How are you?"
	 * Output: "hello world how are you"
	 */
	private preprocessText(text: string): string {
		return text
			.toLowerCase()
			.replace(/[^\w\s]/gi, '')
			.trim()
	}
}
