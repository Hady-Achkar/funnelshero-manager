import {Funnels} from '../models'
import {Response} from 'express'
import {AuthedUser} from '../types'

export const GetFunnel = async (req: AuthedUser, res: Response) => {
	try {
		const {title} = req.query

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
		const funnel = await Funnels.findOne({
			title: title as string,
		})
			.populate('pages', '-__v')
			.populate({
				path: 'publish',
				populate: {
					path: 'pages',
					select: '-__v',
				},
			})
			.select('-__v -owner')
		if (!funnel) {
			return res.status(404).json({
				status: 'Failure',
				message: 'Funnel was not found',
				requestTime: new Date().toISOString(),
			})
		}
		process.exit(0)
		return res.status(200).json({
			status: 'Success',
			message: 'Funnel was created successfully',
			funnel,
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
