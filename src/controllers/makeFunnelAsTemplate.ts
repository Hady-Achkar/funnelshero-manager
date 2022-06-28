import {Request, Response} from 'express'
import {Funnels, Templates} from '../models'

export default async (req: Request, res: Response) => {
	try {
		const {funnelId, title, category, thumbnail} = req.body

		if (!funnelId) {
			return res.status(404).json({message: 'Missing funnelId'})
		}

		const _funnel = await Funnels.findById(funnelId)

		if (!_funnel) {
			return res.status(404).json({message: 'Failed to find funnel'})
		}

		const _template = await Templates.create({
			title,
			category,
			thumbnail,
			pages: _funnel.pages,
			menus: _funnel.menus,
		})

		return res
			.status(200)
			.json({
				message: 'Template was created successfully',
				template: _template._id,
			})
	} catch (error) {
		if (error instanceof Error) {
			return res.status(500).json({
				message: error.message,
			})
		}
	}
}
