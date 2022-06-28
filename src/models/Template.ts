import {Schema, model} from 'mongoose'
import {ITemplate} from '../types'

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
		category: {
			type: String,
			required: true,
			trim: true,
		},
		baseDomain: {
			type: String,
			trim: true,
		},
		proDomain: {
			type: String,
			trim: true,
			default: '',
		},
		favIcon: {
			type: String,
			trim: true,
			default: process.env.FUNNELS_FAV_ICON || '',
		},
		isActive: {
			type: Boolean,
			default: false,
		},
		publish: {
			pages: [
				{
					type: Schema.Types.Mixed,
					ref: 'Page',
				},
			],
		},
		pages: [
			{
				type: Schema.Types.ObjectId,
				ref: 'Page',
			},
		],
		contactEmail: {
			type: String,
			required: true,
			trim: true,
		},
		allowedNotifications: {
			type: Boolean,
			default: true,
		},
	},
	{
		timestamps: true,
		minimize: false,
		versionKey: false,
	}
)

export default model<ITemplate>('Templates', TemplateSchema)
