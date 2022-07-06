//@ts-nocheck
import {S3Client} from '../lib'
import multer from 'multer'
import {v4} from 'uuid'
import {S3 as AmazonS3} from 'aws-sdk'
import {Request, Response} from 'express'

export const UploadFile = async (req: Request, res: Response) => {
	try {
		const {type} = req.query

		//@ts-ignore
		const {_id: UserId} = req.user
		if (!type || type === '') {
			return res.status(400).json({
				status: 'Failure',
				message: 'Bad request, type was not found',
				requestTime: new Date().toISOString(),
			})
		}
		const randomName = v4()
		let fileType = ''
		if (!req.files) {
			return res.status(404).json({
				status: 'Failure',
				message: 'File was not sent',
				requestTime: new Date().toISOString(),
			})
		}

		switch (req?.files?.file.mimetype) {
			case 'image/png':
				fileType = '.png'
				break
			case 'image/jpeg':
				fileType = '.jpg'
				break
			default:
				break
		}
		const DIR = `Data/manager/${UserId}/${randomName}${fileType}`

		let upload = multer().single('file')

		upload(req, res, function (err) {
			if (err instanceof multer.MulterError) {
				console.log('Multer Error Occured when uploading file : ' + err)
				return err
			} else if (err) {
				console.log('error while uploading in file  : ' + err)
				return err
			}

			const params: AmazonS3.PutObjectRequest = {
				Bucket: process.env.AMAZON_S3_BUCKET || '',
				Key: `${DIR}`,
				Body: req?.files?.file?.data,
				ContentType: req?.files?.file?.mimetype,
				ContentEncoding: req?.files?.file?.encoding,
			}

			S3Client.upload(params, (err, _) => {
				if (err) {
					console.log('file error: ' + err)
				} else {
					console.log('uploaded file')
				}
			})
		})
		const {protocol} = S3Client.endpoint
		return res.status(200).json({
			status: 'Success',
			message: 'File uploaded successfully',
			file: `${protocol}//${process.env.AMAZON_S3_BUCKET}.s3.${process.env.AMAZON_REGION}.amazonaws.com/${DIR}`,
			requestTime: new Date().toISOString(),
		})
	} catch (error) {
		return res.status(500).json({
			message: 'Internal Server Error',
			error: error.message,
			requestTime: new Date().toISOString(),
		})
	}
}
