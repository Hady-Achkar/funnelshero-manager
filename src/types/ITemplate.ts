import {Document} from 'mongoose'

export interface ITemplate extends Document {
	title: string
	data: string
	isPublished: boolean
	lastPublish: Date
	publishedData: {
		title: string
		data: string
	}
}