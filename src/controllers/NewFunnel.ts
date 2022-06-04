import {Funnels, Pages, Users} from '../models'
import {Response, Request} from 'express'
import {AddFunnel, AuthUserBody} from '../types'
import InitialPage from '../assets/initialPage.json'
export const NewFunnel = async (req: Request, res: Response) => {
	try {
		const {category, title, image} = req.body
		if (!category || category === '') {
			return res.status(400).json({
				status: 'Failure',
				errors: [
					{
						name: 'missing category',
						field: 'category',
					},
				],
				requestTime: new Date().toISOString(),
			})
		}
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
		//@ts-ignore
		const {_id: UserId} = req.user
		const _page = await Pages.create({
			title: 'Home',
			data: JSON.stringify(InitialPage),
			isPublished: true,
			publishedAt: new Date(),
		})
		const _user = await Users.findById(UserId)
		if (!_user) {
			return res.status(404).json({
				status: 'Failure',
				message: 'User was not found',
				requestTime: new Date().toISOString(),
			})
		}
		const _verify = await Funnels.findOne({
			title,
		})
		if (_verify) {
			return res.status(400).json({
				status: 'Failure',
				message: 'Bad request, funnel title already in use',
				requestTime: new Date().toISOString(),
			})
		}
		const _placeHolderFunnel = await Funnels.create({
			category,
			title,
			image,
			owner: UserId,
			pages: [_page._id],
			contactEmail: _user.email,
			publish: {
				pages: [{..._page}],
			},
		})
		const funnel = await Funnels.findById(_placeHolderFunnel._id)
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
			throw new Error('Internal Server Error')
		}
		return res.status(200).json({
			status: 'Success',
			message: 'Funnel was created successfully',
			funnel: {
				...funnel.toObject(),
				pages: [
					{
						..._page.toObject(),
					},
				],
			},
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
