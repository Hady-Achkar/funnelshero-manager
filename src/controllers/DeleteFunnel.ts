import {Response} from 'express'
import {AuthUserBody, IDeleteFunnel} from '../types'
import {isValidObjectId} from 'mongoose'
import {Funnels} from '../models'

export const DeleteFunnel = async (
	req: AuthUserBody<IDeleteFunnel>,
	res: Response,
) => {
	try {
		const {funnelId} = req.body
		if (!funnelId) {
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
		const oldFunnel = await Funnels.findById(funnelId)
		if (!oldFunnel) {
			return res.status(400).json({
				status: 'Failure',
				message: 'funnel was not found',
				funnel: null,
				requestTime: new Date().toISOString(),
			})
		}
		await Funnels.findByIdAndDelete(funnelId)
		return res.status(204).json({
			status: 'Success',
			message: 'Funnel was deleted successfully.',
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
