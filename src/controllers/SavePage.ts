import {Response} from 'express'
import {AuthUserBody, IEditPage} from '../types'
import {isValidObjectId} from 'mongoose'
import {Funnels, Pages} from '../models'
import {IPage} from '../types'
export const EditPage = async (req: AuthUserBody<IEditPage>, res: Response) => {
	try {
		const {title, data, funnelId, pageId} = req.body

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
		if (!isValidObjectId(pageId)) {
			return res.status(400).json({
				status: 'Failure',
				errors: [
					{
						name: 'wrong pageId format',
						field: 'pageId',
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

		const _otherPages = await _verifyFunnel.pages.filter(
			(page: IPage) => page._id != pageId
		)
		const _verifyTitle = _otherPages.find((page: IPage) => page.title === title)
		if (_verifyTitle) {
			return res.status(400).json({
				status: 'Success',
				message: 'Page title is already in use.',
				requestTime: new Date().toISOString(),
			})
		}

		const link = `/${title.toLowerCase().replace(/\s/g, '-')}`

		await Pages.findByIdAndUpdate(pageId, {
			$set: {
				title,
				data,
				link,
				isPublished: false,
			},
		})

		const updatedFunnel = await Funnels.findByIdAndUpdate(
			funnelId,
			{
				owner: UserId,
			},
			{
				new: true,
			}
		)
			.populate('pages', '-__v')
			.select('-__v -owner')
		return res.status(200).json({
			status: 'Success',
			message: 'Page was editted successfully.',
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
