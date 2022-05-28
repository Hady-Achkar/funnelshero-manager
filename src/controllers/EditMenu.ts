import {Response} from 'express'
import {AuthUserBody, IMenu} from '../types'
import {isValidObjectId} from 'mongoose'
import {Funnels} from '../models'

export const EditMenu = async (
	req: AuthUserBody<IMenu>,
	res: Response,
) => {
	try {
		const {funnelId, menuId} = req.query
		const {_id: UserId} = req.user
		const {title, links} = req.body
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
		if (!links) {
			return res.status(400).json({
				status: 'Failure',
				errors: [
					{
						name: 'missing links',
						field: 'links',
					},
				],
				requestTime: new Date().toISOString(),
			})
		}
		if (!Array.isArray(links)) {
			return res.status(400).json({
				status: 'Failure',
				errors: [
					{
						name: 'links is not an array',
						field: 'links',
					},
				],
				requestTime: new Date().toISOString(),
			})
		}
		const validateLinksArray = links.map(item => {
			return !(!item.title || item.title === '' || !item.href || item.href === '')
		})
		if (validateLinksArray.includes(false)) {
			return res.status(400).json({
				status: 'Failure',
				errors: [
					{
						name: 'links attributes are not recognized',
						field: 'links',
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
		const oldMenu = menus.find((item: IMenu) => item?._id == menuId)
		if (!oldMenu) {
			return res.status(404).json({
				status: 'Failure',
				message: 'menu was not found',
				requestTime: new Date().toISOString(),
			})
		}
		const menuIndex = menus.indexOf(oldMenu)
		oldFunnel.menus[menuIndex].$set({
			links, title,
		})
		oldFunnel.save()
		const updatedFunnel = await Funnels.findById(funnelId).populate('pages', '-__v')
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
			message: 'Menu was edited successfully.',
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
