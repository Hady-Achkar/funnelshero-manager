import {Request, Response} from 'express'
import {Funnels, Templates, Users} from '../models'

export default async (req: Request, res: Response) => {
	try {
		const {templateId, title} = req.body
		//@ts-ignore
		const {_id: UserId} = req.user

		if (!templateId || templateId === '') {
			return res.status(400).json({message: 'templateId was not found'})
		}
		const _owner = await Users.findById(UserId)
		const _template = await Templates.findById(templateId)

		if (!_owner) {
			return res.status(404).json({message: 'User was not found'})
		}
		if (!_template) {
			return res.status(404).json({message: 'Template was not found'})
		}
		const toBeCreatedFunnel = await Funnels.create({
			category: _template.category,
			title,
			image: _template.image,
			owner: _owner._id,
			pages: _template.pages,
			contactEmail: _owner.email,
			publish: {
				pages: _template.pages,
			},
		})

		if (!toBeCreatedFunnel) {
			return res.status(500).json({message: 'Unable to create funnel'})
		}

		const _funnel = await Funnels.findById(toBeCreatedFunnel._id)
			.populate('pages', '-__v')
			.populate({
				path: 'publish',
				populate: {
					path: 'pages',
					select: '-__v',
				},
			})
			.select('-__v -owner')

		return res
			.status(200)
			.json({message: 'Funnel was created successfully', funnel: _funnel})
	} catch (error) {
		if (error instanceof Error) {
			return res.status(500).json({
				message: error.message,
			})
		}
	}
}
