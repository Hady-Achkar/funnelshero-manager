import {Request, Response} from 'express'
import {Templates} from '../models'
export default async (req: Request, res: Response) => {
	try {
		const _templates = await Templates.find({})

		if (!_templates || _templates.length === 0) {
			return res.status(404).json({message: 'No templates found'})
		}
		return res
			.status(200)
			.json({message: 'Templates were fetched successfully.', data: _templates})
	} catch (error) {
		if (error instanceof Error) {
			return res.status(500).json({
				message: error.message,
			})
		}
	}
}
