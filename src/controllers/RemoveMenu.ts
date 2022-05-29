import {Request, Response} from 'express'
import {AuthedUser, IMenu} from '../types'
import {isValidObjectId} from 'mongoose'
import {Funnels} from '../models'

export const RemoveMenu = async (req: AuthedUser, res: Response) => {
	try {
		const {funnelId, menuId} = req.query
		const {_id: UserId} = req.user
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
		if (!menuId) {
			return res.status(400).json({
				status: 'Failure',
				errors: [
					{
						name: 'missing menuId',
						field: 'menuId',
					},
				],
				requestTime: new Date().toISOString(),
			})
		}
		if (!isValidObjectId(menuId)) {
			return res.status(400).json({
				status: 'Failure',
				errors: [
					{
						name: 'wrong menuId format',
						field: 'menuId',
					},
				],
				requestTime: new Date().toISOString(),
			})
		}
		const oldFunnel = await Funnels.findById(funnelId)
		if (!oldFunnel) {
			return res.status(400).json({
				status: 'Failure',
				message: 'funnel was not found',
				funnel: null,
				requestTime: new Date().toISOString(),
			})
		}
		if (oldFunnel?.owner != UserId) {
			return res.status(403).json({
				status: 'Failure',
				message: 'You are not authorized to take such an action',
				requestTime: new Date().toISOString(),
			})
		}
		const {menus} = oldFunnel
		//@ts-ignore
		const menuToBeDeleted = menus.find((item: IMenu) => item?._id == menuId)
		if (!menuToBeDeleted) {
			return res.status(404).json({
				status: 'Failure',
				errors: [
					{
						name: 'missing menuToBeDeleted',
						field: 'menuToBeDeleted',
					},
				],
				requestTime: new Date().toISOString(),
			})
		}
		//@ts-ignore
		oldFunnel.menus.$pop({_id: menuId})
		await oldFunnel.save()
		const updatedFunnel = await Funnels.findById(funnelId)
			.populate('pages', '-__v')
			.populate({
				path: 'publish',
				populate: {
					path: 'pages',
					select: '-__v',
				},
			})
			.select('-__v -owner')
		return res.status(200).json({
			status: 'Success',
			message: 'Menu was deleted successfully.',
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
