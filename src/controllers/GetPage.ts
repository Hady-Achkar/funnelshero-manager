import {Response} from 'express'
import {AuthUserBody, GetPage as IGetPage} from '../types'
import {isValidObjectId} from 'mongoose'
import {Funnels, Pages} from '../models'
export const GetPage = async (req: AuthUserBody<IGetPage>, res: Response) => {
	try {
		const {title, funnelId} = req.body
		const {_id: UserId} = req.user
		if (!title || title === '') {
			return res.status(400).json({
				status: 'Failure',
				errors: [
					{
						name: 'missing title',
						field: 'title',
					},
				],
				requestTime: new Date().toISOString(),
			})
		}
		if (!funnelId || funnelId === '') {
			return res.status(400).json({
				status: 'Failure',
				errors: [
					{
						name: 'missing funnelId',
						field: 'funnelId',
					},
				],
				requestTime: new Date().toISOString(),
			})
		}
		if (!isValidObjectId(funnelId)) {
			return res.status(400).json({
				status: 'Failure',
				errors: [
					{
						name: 'wrong funnelId format',
						field: 'funnelId',
					},
				],
				requestTime: new Date().toISOString(),
			})
		}
		const _verifyFunnel = await Funnels.findById(funnelId).populate(
			'pages',
			'-__v'
		)
		if (!_verifyFunnel) {
			return res.status(400).json({
				status: 'Failure',
				errors: [
					{
						name: 'funnel was not found',
						field: 'funnelId',
					},
				],
				requestTime: new Date().toISOString(),
			})
		}
		if (_verifyFunnel.owner != UserId) {
			return res.status(403).json({
				status: 'Failure',
				errors: [
					{
						name: "You don't own this funnel",
						field: 'funnelId',
					},
				],
				requestTime: new Date().toISOString(),
			})
		}
		const _page = await _verifyFunnel.pages.find(
			(page: any) => page.title === title
		)
		return res.status(200).json({
			status: 'Success',
			message: 'Page was fetched successfully.',
			page: _page,
			requestTime: new Date().toISOString(),
		})
	} catch (err) {
		if (err instanceof Error) {
			return res.status(500).json({
				message: 'Internal Server Error',
				error: err.message,
				requestTime: new Date().toISOString(),
			})
		}
	}
}
