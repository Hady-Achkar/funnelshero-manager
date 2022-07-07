import {Request, Response} from 'express'
import {Funnels, Pages} from '../models'

export default async (req: Request, res: Response) => {
	try {
		const {funnelId, pageId} = req.body

		if (!funnelId || funnelId === '') {
			return res.status(400).json({message: 'funnelId was not found'})
		}

		if (!pageId || pageId === '') {
			return res.status(400).json({message: 'pageId was not found'})
		}

		const _funnel = await Funnels.findById(funnelId)
		const _page = await Pages.findById(pageId)

		if (!_page) {
			return res.status(404).json({message: 'page was not found'})
		}
		if (!_funnel) {
			return res.status(404).json({message: 'funnel was not found'})
		}
		const newPage = await Pages.create({
			title: `${_page}(copy)`,
			data: _page.data,
		})

		const updatedFunnel = await Funnels.findByIdAndUpdate(
			funnelId,
			{$push: {pages: newPage._id}},
			{new: true}
		)

		return res
			.status(200)
			.json({message: 'page was added successfully', funnel: updatedFunnel})
	} catch (error) {
		if (error instanceof Error) {
			return res.status(500).json({
				message: error.message,
			})
		}
	}
}
