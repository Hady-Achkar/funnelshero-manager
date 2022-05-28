import {Schema} from 'mongoose'
export interface IEditPage {
	readonly title: string
	readonly data: string
	readonly funnelId: string
	readonly pageId: Schema.Types.ObjectId
}
