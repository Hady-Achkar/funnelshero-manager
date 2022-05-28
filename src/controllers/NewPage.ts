import {Response} from 'express'
import {AddPage, AuthUserBody} from '../types'
import {Funnels, Pages} from '../models'
import {isValidObjectId} from 'mongoose'
import InitialPage from '../assets/initialPage.json'
export const NewPage = async (req: AuthUserBody<AddPage>, res: Response) => {
	try {
		const {title, funnelId} = req.body
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
		const _verify = await Funnels.findById(funnelId).populate('pages', 'title')
		if (!_verify) {
			return res.status(404).json({
				status: 'Failure',
				message: 'Funnel was not found',
				requestTime: new Date().toISOString(),
			})
		}
		const _verifyPage = _verify.pages.find((page) => page.title === title)
		if (_verifyPage) {
			return res.status(400).json({
				status: 'Failure',
				message: 'Bad request, page title already in use.',
				requestTime: new Date().toISOString(),
			})
		}
		const page = await Pages.create({
			title,
			data: JSON.stringify(InitialPage),
		})
		const updatedFunnel = await Funnels.findByIdAndUpdate(
			funnelId,
			{$push: {pages: page._id}},
			{new: true}
		)
			.select('-__v')
			.populate('pages', '-__v')
		return res.status(200).json({
			status: 'Success',
			message: 'Funnel was created successfully',
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
