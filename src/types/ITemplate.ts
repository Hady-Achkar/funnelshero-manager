import {Document} from 'mongoose'
import {MenuSchema} from '../models/Funnel'

export interface ITemplate extends Document {
	title: string
	pages: string[]
	image: string
	category: string
	thumbnail: string
	menus: [typeof MenuSchema]
}
