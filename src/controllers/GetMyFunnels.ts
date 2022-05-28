import {Response} from 'express'
import {AuthedUser} from '../types'
import {Funnels} from '../models'
export const GetMyFunnels = async (req: AuthedUser, res: Response) => {
	try {
		const {_id: UserId} = req.user

		const myFunnels = await Funnels.find({owner: UserId})
			.populate('pages', '-__v')
			.populate({
				path: 'publish',
				populate: {
					path: 'pages',
					select: '-__v',
				},
			})
			.select('-__v -owner')

		if (myFunnels.length === 0) {
			return res.status(200).json({
				status: 'Success',
				message: 'No Funnels were found',
				funnels: [],
				requestTime: new Date().toISOString(),
			})
		}
		return res.status(200).json({
			status: 'Success',
			message: 'Funnels were fetched successfully',
			funnels: myFunnels,
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
