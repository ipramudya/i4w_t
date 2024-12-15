/**
 * Credits
 * https://www.kaggle.com/models/tensorflow/universal-sentence-encoder
 * https://github.com/tensorflow/tfjs-models/blob/master/universal-sentence-encoder/README.md
 */

import * as use from '@tensorflow-models/universal-sentence-encoder'
import fs from 'fs/promises'
import path from 'path'
import type { Ad } from './types'

export class AdProcessor {
	private ads: Ad[] = []
	private qnaModel: Awaited<ReturnType<typeof use.loadQnA>> | null = null

	public async initialize(): Promise<void> {
		if (!this.qnaModel && this.ads.length === 0) {
			this.qnaModel = await use.loadQnA()
			this.ads = await this.loadAds()
		}
	}

	private async loadAds(): Promise<Ad[]> {
		const adsPath = path.join(process.cwd(), 'src', 'data', 'ads.json')
		const data = await fs.readFile(adsPath, 'utf-8')
		return JSON.parse(data) as Ad[]
	}

	public async analyzeMessage(message: string): Promise<string | null> {
		if (!this.qnaModel) {
			throw new Error('qna model not initialized')
		}

		// Prepare input data for embeddings
		const queries = [this.preprocessText(message)]
		const responses = this.ads.map((ad) => this.preprocessText(ad.keywords.join(' ')))

		// Generate embeddings for query and responses
		const embeddings = this.qnaModel.embed({ queries, responses })
		const embeddedQuery = embeddings['queryEmbedding'].arraySync() as number[][]
		const embeddedResponses = embeddings['responseEmbedding'].arraySync() as number[][]

		let highestScore = 0
		let bestAd: Ad | null = null

		// Get the coresponding ad for input message based on the highest similarity score
		for (let i = 0; i < this.ads.length; i++) {
			const ad = this.ads[i]
			const similarityScore = this.dotProduct(embeddedQuery[0], embeddedResponses[i])

			if (!similarityScore) {
				continue
			} else if (similarityScore > highestScore) {
				highestScore = similarityScore
				bestAd = ad
			}
		}

		return bestAd?.text || null
	}

	private dotProduct(vec1: number[], vec2: number[]) {
		if (vec1.length !== vec2.length) return null

		const operation = (a: number, b: number) => a * b
		const multipliedVecs = this.zipWith(vec1, vec2, operation)

		return this.sum(multipliedVecs)
	}

	/**
	 * Combines multiple arrays into a single array using a custom combiner function.
	 * @example
	 * const arr1 = [1, 2, 3]
	 * const arr2 = [4, 5, 6]
	 * const operation = (a, b) => a + b
	 * const result = [5, 7, 9]
	 */
	private zipWith(
		arr1: number[],
		arr2: number[],
		operation: (a: number, b: number) => number,
	): number[] {
		const result: number[] = []

		for (let i = 0; i < arr1.length; i++) {
			const operationResult = operation(arr1[i], arr2[i])
			result.push(operationResult)
		}

		return result
	}

	private sum(arr: number[]): number {
		let result = 0

		for (let i = 0; i < arr.length; i++) {
			result += arr[i]
		}

		return result
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
