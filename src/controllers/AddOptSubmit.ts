import {Funnels, OptSubmits} from '../models'
import {Response} from 'express'
import {CustomRequest, AddOptSubmits} from '../types'
export const InsertNewOptSubmit = async (
	req: CustomRequest<AddOptSubmits>,
	res: Response
) => {
	try {
		const {email, fullname, funnelTitle, phone} = req.body
		if (!email || email === '') {
			return res.status(400).json({
				status: 'Failure',
				errors: [
					{
						name: 'missing email',
						field: 'email',
					},
				],
				requestTime: new Date().toISOString(),
			})
		}
		if (!fullname || fullname === '') {
			return res.status(400).json({
				status: 'Failure',
				errors: [
					{
						name: 'missing fullname',
						field: 'fullname',
					},
				],
				requestTime: new Date().toISOString(),
			})
		}
		if (!phone || phone === '') {
			return res.status(400).json({
				status: 'Failure',
				errors: [
					{
						name: 'missing phone',
						field: 'phone',
					},
				],
				requestTime: new Date().toISOString(),
			})
		}
		if (!funnelTitle || funnelTitle === '') {
			return res.status(400).json({
				status: 'Failure',
				errors: [
					{
						name: 'missing funnelTitle',
						field: 'funnelTitle',
					},
				],
				requestTime: new Date().toISOString(),
			})
		}
		const _verifyFunnel = await Funnels.findOne({
			title: funnelTitle,
		})
		if (!_verifyFunnel) {
			return res.status(404).json({
				status: 'Failure',
				message: 'Funnel was not found',
				requestTime: new Date().toISOString(),
			})
		}
		await OptSubmits.create({
			email,
			fullname,
			funnel: _verifyFunnel._id,
			phone,
		})
		return res.status(204).json({
			status: 'Success',
			message: 'OptSubmit was created successfully',
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
