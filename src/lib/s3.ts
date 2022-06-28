import AWS from 'aws-sdk'
import * as dotenv from 'dotenv'

dotenv.config()
const bucket = process.env.AMAZON_S3_BUCKET
const accessKeyId = process.env.AMAZON_ACCESS_KEY
const secretAccessKey = process.env.AMAZON_SECRET_ACCESS_KEY
const region = process.env.AMAZON_REGION
const client = () => {
    if (bucket && accessKeyId && secretAccessKey && region) {
        return new AWS.S3({
            accessKeyId,
            secretAccessKey,
            region,
        })
    } else {
        console.error(`Error: Redis environment variables were not found`);
        process.exit(1)
    }
}

export default client()
