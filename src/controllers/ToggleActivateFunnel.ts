import {Response} from 'express'
import {AuthUserBody, IToggleActivateFunnel} from '../types'
import {isValidObjectId} from 'mongoose'
import {Funnels} from '../models'

export const ToggleActivateFunnel = async (
	req: AuthUserBody<IToggleActivateFunnel>,
	res: Response,
) => {
	try {
		const {funnelId} = req.body
		const {_id: UserId} = req.user
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
		const _verify = await Funnels.findById(funnelId)
		if (!_verify) {
			return res.status(404).json({
				status: 'Failure',
				message: 'Funnel was not found.',
				funnel: null,
				requestTime: new Date().toISOString(),
			})
		}
		if (UserId != _verify.owner) {
			return res.status(403).json({
				status: 'Failure',
				message: 'You are unauthorized to take such an action',
				requestTime: new Date().toISOString(),

			})
		}
		const {isActive} = _verify
		const updatedFunnel = await Funnels.findByIdAndUpdate(funnelId, {
			$set: {
				isActive: !isActive,
			},
		}, {
			new: true,
		}).populate('pages', '-__v')
			.populate({
				path: 'publish',
				populate: {
					path: 'pages',
					select: '-__v',
				},
			})
			.select('-__v -owner')
		if (!updatedFunnel) {
			return res.status(500).json({
				message: 'Internal Server Error',
				error: 'Something went wrong while updating your funnel.',
				requestTime: new Date().toISOString(),
			})
		}
		const message = updatedFunnel.isActive ? 'Funnel was activated successfully' : 'Funnel was deactivated successfully'
		return res.status(200).json({
			status: 'Success',
			message: message,
			funnel: updatedFunnel,
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
