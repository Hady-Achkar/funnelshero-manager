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

		const _funnel = await Funnels.findById(funnelId)

		if (!_funnel) return res.status(404).json({message: 'funnel was not found'})

		// await Promise.all(
		// 	_funnel.pages.forEach((page) => {
		// 		await Pages.create()
		// 	})
		// )

		const newFunnel = await Funnels.create({
			title,
			category: _funnel.category,
			pages: _funnel.pages,
			owner: _funnel.owner,
			menus: _funnel.menus,
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
