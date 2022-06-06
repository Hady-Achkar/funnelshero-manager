import {Funnels, OptSubmits} from '../models'
import {Response, Request} from 'express'
import nodemailer from 'nodemailer'
import path from 'path'
export const InsertNewOptSubmit = async (req: Request, res: Response) => {
	try {
		const {targetEmail, funnelId} = req.query
		console.log(funnelId)
		const {email, name, phone} = req.body
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
		if (!name || name === '') {
			return res.status(400).json({
				status: 'Failure',
				errors: [
					{
						name: 'missing name',
						field: 'name',
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

		const transporter = nodemailer.createTransport({
			service: 'gmail',
			host: 'smtp.gmail.com',
			port: 587,
			secure: false,
			auth: {
				user: 'funnelshero.email@gmail.com',
				pass: 'HadiAsh123',
			},
		})

		const html = `<div>Name: ${name}</div><br /><div>Email Address: ${email}</div><br /><div>Phone Number: ${phone}</div>`
		const info = await transporter.sendMail({
			from: '"Funnelshero" <funnelshero.email@gmail.com>', // sender address
			to: `${targetEmail}, hady.achkar@hotmail.com`, // list of receivers
			subject: 'New Lead!', // Subject line
			html: html, // html body
		})
		const _submit = await OptSubmits.create({
			email: email,
			fullname: name,
			phone: phone,
			funnel: funnelId,
		})

		if (!_submit) {
			return res.status(400).json({
				message: 'Bad Request',
			})
		}

		console.log(_submit)

		return res.status(204).json({
			message: 'Successfully added',
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
