import {Schema, model} from 'mongoose'
import {ITemplate} from '../types'
import {MenuSchema} from './Funnel'

const TemplateSchema = new Schema<ITemplate>(
	{
		title: {
			type: String,
			required: true,
			trim: true,
			unique: true,
		},
		image: {
			type: String,
			trim: true,
		},
		thumbnail: {
			type: String,
			trim: true,
		},
		category: {
			type: String,
			required: true,
			trim: true,
		},
		pages: [
			{
				type: Schema.Types.ObjectId,
				ref: 'Page',
			},
		],
		menus: [MenuSchema],
	},
	{
		timestamps: true,
		minimize: false,
		versionKey: false,
	}
)

export default model<ITemplate>('Templates', TemplateSchema)
