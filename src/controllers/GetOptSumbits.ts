import {Request, Response} from 'express'
import {OptSubmits} from '../models'

export default async (req: Request, res: Response) => {
	const {funnelId} = req.body

	try {
		const _submits = await OptSubmits.find({funnel: funnelId})

		if (!_submits) {
			return res.status(500).json({
				message: 'Internal server error',
			})
		}

		return res.status(200).json({
			status: 'Success',
			submits: _submits,
			message: 'Submits were fetched successfully!',
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
