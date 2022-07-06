import {S3Client} from '../lib'
import multer from 'multer'
import {v4} from 'uuid'
import {S3 as AmazonS3} from 'aws-sdk'
import {Response, Request} from 'express'

export default async (req: Request, res: Response) => {
	try {
		const randomName = v4()
		let fileType = ''
		if (!req.files) {
			return res.status(404).json({
				status: 'Failure',
				message: 'File was not sent',
				requestTime: new Date().toISOString(),
			})
		}

		//@ts-ignore
		switch (req?.files?.file.mimetype) {
			case 'image/png':
				fileType = '.png'
				break
			case 'image/jpeg':
				fileType = '.jpg'
				break
			case 'model/stl':
				fileType = '.stl'
				break
			case 'application/pdf':
				fileType = '.pdf'
				break
			case 'application/octet-stream':
				fileType = '.stl'
				break
			default:
				break
		}
		const DIR = `Funnels-hero/assets/${randomName}${fileType}`
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
				//@ts-ignore
				Body: req?.files?.file?.data,
				//@ts-ignore
				ContentType: req?.files?.file?.mimetype,
				//@ts-ignore
				ContentEncoding: req?.files?.file?.encoding,
			}
			S3Client.upload(params, (err, _) => {
				if (err) {
					console.log('file error: ' + err)
				} else {
					console.log('uploaded file')
				}
			}).on('httpUploadProgress', (progress) => {
				let progressPercentage = Math.round(
					(progress.loaded / progress.total) * 100
				)
				if (progressPercentage === 100) {
					const {protocol} = S3Client.endpoint
					return res.status(200).json({
						status: 'Success',
						message: 'File uploaded successfully',
						file: `${protocol}//${process.env.AMAZON_S3_BUCKET}.s3.${process.env.AMAZON_REGION}.amazonaws.com/${DIR}`,
						requestTime: new Date().toISOString(),
					})
				}
			})
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
