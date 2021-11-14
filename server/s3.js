const aws = require('aws-sdk');
const dotenv = require('dotenv');
const crypto = require('crypto');
const { promisify } = require('util');
const { raw } = require('express');

const randomBytes = promisify(crypto.randomBytes);


dotenv.config();

const region = "us-east-1";
const bucketName = "recipe-app-photos";
const accessKeyId = process.env.AWS_ACCESS_KEY_ID;
const secretAccessKey = process.env.AWS_SECRET_ACESS_KEY;

// Create AWS S3 Export
const awsS3 = {
	s3: new aws.S3({
		region: region,
		accessKeyId: accessKeyId,
		secretAccessKey: secretAccessKey,
		signatureVersion: 'v4'
	}),

	// Generate url to upload image
	async generateUploadUrl() {
		// Image name is random hex digits
		const rawBytes =  await randomBytes(16);
		const imageName = rawBytes.toString('hex');

		const params = ({
			Bucket: bucketName,
			Key: imageName
		});

		const uploadUrl = await this.s3.getSignedUrlPromise('putObject', params);
		return { uploadUrl, imageName };
	},

	// Generate url to get image
	async generateGetUrl(objectName) {
		const params = ({
			Bucket: bucketName,
			Key: objectName
		});

		const objectUrl = this.s3.getSignedUrl('getObject', params);
		return objectUrl;
	}


}
module.exports = awsS3;