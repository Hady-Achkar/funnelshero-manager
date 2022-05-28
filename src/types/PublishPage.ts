import {Schema} from 'mongoose'
export interface IPublishPage {
	readonly pageId: Schema.Types.ObjectId
	readonly funnelId: Schema.Types.ObjectId
}
