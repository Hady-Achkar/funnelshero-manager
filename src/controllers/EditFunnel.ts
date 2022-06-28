import {Request, Response} from 'express'
import {Funnels} from '../models'

export default async (req: Request, res: Response) => {
	try {
		const {funnelId, proDomain, category, image} = req.body
		//@ts-ignore
		const {_id: UserId} = req.user
		let funnelData = {}

		if (!funnelId) {
			return res.status(404).json({
				message: 'funnelId was not found',
			})
		}

		if (proDomain && proDomain !== '') {
			funnelData = {...funnelData, proDomain}
		}
		if (category && category !== '') {
			funnelData = {...funnelData, category}
		}
		if (image && image !== '') {
			funnelData = {...funnelData, image}
		}

		const _funnel = await Funnels.findByIdAndUpdate(funnelId, {
			$set: funnelData,
		})

		if (!_funnel) {
			return res.status(500).json({
				message: 'Internal server error',
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

		return res.status(200).json({
			message: 'Funnel was edited successfully',
			funnelId: _funnel._id,
		})
	} catch (error) {
		if (error instanceof Error) {
			return res.status(500).json({
				message: error.message,
			})
		}
	}
}
