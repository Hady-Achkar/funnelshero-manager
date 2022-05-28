import {Request} from 'express'

export {IFunnel, IMenu, FunnelUser, ILink} from './Funnel'
export {IPage} from './Page'
export {IUser, UserType, ROLES} from './User'
export {AddFunnel} from './AddFunnel'
export {AddPage} from './AddPage'
export {GetPage} from './GetPage'
export {OptSubmits} from './OptSubmits'
export {AddOptSubmits} from './AddOptForm'
export {IEditPage} from './EditPage'
export {IPublishPage} from './PublishPage'
export {IToggleActivateFunnel} from './IToggleActivateFunnel'
export {ITemplate} from './ITemplate'
export {IDeleteFunnel} from './IDeleteFunnel'

export interface IAuthUser {
	readonly email: string
	readonly fullName: string
	readonly _id: string
}

export interface AuthedUser extends Request {
	readonly user: IAuthUser
}

export interface AuthUserBody<T> extends AuthedUser {
	body: T
}

export interface CustomRequest<T> extends Request {
	body: T
}
