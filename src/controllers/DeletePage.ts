import {Response, Request} from 'express'
import {Funnels, Pages} from '../models'

export const DeletePage = async (req: Request, res: Response) => {
	try {
		const {funnelId, pageId} = req.body
		if (!funnelId) {
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

		const _funnel = await Funnels.findById(funnelId)

		if (!_funnel) {
			return res.status(404).json({
				message: 'Funnel was not found',
			})
		}
		//@ts-ignore
		_funnel.pages.$pop({_id: pageId})

		await Pages.findByIdAndDelete(pageId)
		await _funnel?.save()
		return res.status(204).json({
			status: 'Success',
			message: 'Page was deleted successfully.',
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
