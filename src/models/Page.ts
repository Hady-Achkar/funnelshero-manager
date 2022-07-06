import {Schema, model} from 'mongoose'
import {IPage} from '../types'

export const PageSchema = new Schema<IPage>(
	{
		title: {
			type: String,
			trim: true,
			required: true,
		},
		data: {
			type: String,
			trim: true,
			required: true,
		},
		metaTags: {
			type: String,
			trim: true,
		},
		isPublished: {
			type: Boolean,
			default: false,
		},
		publishedAt: {
			type: Date,
		},
		link: {
			type: String,
			trim: true,
		},
	},
	{
		timestamps: true,
		versionKey: false,
		minimize: false,
	}
)
PageSchema.index({
	title: 'text',
})
PageSchema.pre('save', async function (next) {
	if (this.title === 'Home') {
		this.link = `/`
		next()
	} else {
		const link = this.title.toLowerCase().replace(/\s/g, '-')
		this.link = `/${link}`
		next()
	}
})
export default model<IPage>('Page', PageSchema)
