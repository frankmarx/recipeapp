const express = require("express");
const cors = require("cors");
const { apiRouter } = require('./API Routes');

const app = express();
app.use(cors());
app.use(express.json());
app.use('/api', apiRouter);

app.listen(5000, () => {
	console.log("server started on port 5000");
});