import {Schema, model} from 'mongoose'
import {ITemplate} from '../types'

const TemplateSchema = new Schema<ITemplate>({
	title: {
		type: String,
		required: [true, 'Title is a required field'],
		trim: true,
		unique: true,
	},
	data: {
		type: String,
		trim: true,
		required: [true, 'data is a required field'],
	},
	isPublished: {
		type: Boolean,
		default: false,
	},
	lastPublish: {
		type: Date,
	},
	publishedData: {
		title: String,
		data: String,
	},
}, {
	timestamps: true,
	minimize: false,
	versionKey: false,
})

export default model<ITemplate>('Templates', TemplateSchema)