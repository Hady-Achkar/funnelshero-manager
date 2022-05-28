import {IFunnel} from '.'

export interface OptSubmits extends Document {
	email: string
	fullname: string
	phone: string
	funnel: IFunnel
}
