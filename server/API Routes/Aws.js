const { Router } = require('express');

const awsS3 = require('../s3');
const awsRouter = Router();
const pool = require("../db");

awsRouter.get("/s3Url", async (req, res) => {
	try {
		const { uploadUrl, imageName } = await awsS3.generateUploadUrl();
		res.json({ uploadUrl, imageName });
	}
	catch(err) {
		console.log(err.message);
	}
});

awsRouter.get("/s3Url/:objName", async (req, res) => {
	try {
		const { objName } = req.params;
		const objUrl = await awsS3.generateGetUrl(objName);
		res.json({objUrl});
	}
	catch(err) {
		console.log(err.message);
	}
})



module.exports = {
	awsRouter,
};
