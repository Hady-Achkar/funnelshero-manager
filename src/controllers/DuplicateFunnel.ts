import {Request, Response} from 'express'
import {Funnels, Pages} from '../models'

export default async (req: Request, res: Response) => {
	try {
		const {funnelId, title} = req.body

		if (!funnelId || funnelId === '') {
			return res.status(404).json({
				message: 'funnelId is missing',
			})
		}

		if (!title || title === '') {
			return res.status(404).json({
				message: 'title is missing',
			})
		}

		const _funnel = await Funnels.findById(funnelId).populate('pages')

		if (!_funnel) return res.status(404).json({message: 'funnel was not found'})

		const getIds = async (arr: any[]) => {
			const pagesIds = await Promise.all(
				arr.map((item) =>
					Pages.create({
						title: item.title,
						data: item.data,
					})
				)
			)
			return pagesIds
		}

		const _pages = await Promise.resolve(getIds(_funnel.pages))

		let funnelPages: any[] = []
		_pages.map((page) => {
			funnelPages.push(page._id)
		})

		const newFunnel = await Funnels.create({
			category: _funnel.category,
			title,
			owner: _funnel.owner,
			pages: funnelPages,
			contactEmail: _funnel.contactEmail,
		})

		if (!newFunnel) {
			return res.status(404).json({message: 'funnel was not found'})
		}

		return res.status(200).json({
			message: 'Funnel was created successfully',
			data: newFunnel,
			status: 'Success',
		})
	} catch (error) {
		if (error instanceof Error) {
			return res.status(500).json({message: error.message})
		}
		return res.status(500).json({message: 'Internal Server Error'})
	}
}
