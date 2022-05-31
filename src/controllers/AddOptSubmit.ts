import {Funnels, OptSubmits} from '../models'
import {Response, Request} from 'express'
import nodemailer from 'nodemailer'
import path from 'path'
export const InsertNewOptSubmit = async (req: Request, res: Response) => {
	try {
		const {targetEmail} = req.query
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
			to: `${targetEmail}`, // list of receivers
			subject: 'New Lead!', // Subject line
			html: html, // html body
		})

		console.log('Message sent: %s', info.messageId)
		// Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

		// Preview only available when sending through an Ethereal account
		console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info))
		return res.send(`<!DOCTYPE html>
		<html lang="en">
			<head>
				<meta charset="UTF-8" />
				<meta http-equiv="X-UA-Compatible" content="IE=edge" />
				<script src="https://cdn.tailwindcss.com"></script>
				<meta name="viewport" content="width=device-width, initial-scale=1.0" />
				<title>Thank you</title>
			</head>
			<body>
				<div style="min-height: 100vh bg-indigo-50">
					<div class="mx-auto my-auto">
						<h1 class="text-3xl font-bold text-indigo-800">Thank You!</h1>
					</div>
				</div>
			</body>
		</html>`)
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
