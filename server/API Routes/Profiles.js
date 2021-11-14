const { Router } = require('express');

const profilesRouter = Router();
const pool = require("../db");

// Add user

profilesRouter.post("/new", async (req, res) => {
	try {
		const { email, firstName, lastName, password, username } = req.body;
		console.log(req.body);
		const displayName = firstName + " " + lastName;
		const newAccount = await pool.query(
			"INSERT INTO account (email, displayname, password, username) VALUES ($1, $2, $3, $4);",
			[email, displayName, password, username]
		);
		res.json(username);
	}
	catch(err) {
		console.log(err.message);
	}
});

// Get user info

profilesRouter.get("/:accId", async (req, res) => {
	try {
		const { accId } = req.params;
		const userInfo = await pool.query(
			"SELECT username, email, displayname, photoname, followingcount, followercount, recipecount FROM account WHERE accountid = $1;",
			[accId]
		);
		res.json(userInfo.rows[0]);
	}
	catch(err) {
		console.log(err.message);
	}
});

profilesRouter.get("/usr/:username", async (req, res) => {
	try {
		const { username } = req.params;
		const userInfo = await pool.query(
			"SELECT password, username, accountid, email, displayname, photoname FROM account WHERE username = $1;",
			[username]
		);

		let retInfo = userInfo.rows[0];
		// If username exists get recipe and follower numbers
		if (userInfo.rows[0]) {

			const followerCount = await pool.query(
				"SELECT COUNT(*) FROM follower WHERE followee = $1;",
				[userInfo.rows[0].accountid]
			);
	
			const followingCount  = await pool.query(
				"SELECT COUNT(*) FROM follower WHERE follower = $1;",
				[userInfo.rows[0].accountid]
			);
	
			const recipeCount = await pool.query(
				"SELECT COUNT(*) FROM recipe WHERE authorid = $1;",
				[userInfo.rows[0].accountid]
			);

			retInfo.followercount = followerCount.rows[0].count;
			retInfo.followingcount = followingCount.rows[0].count;
			retInfo.recipecount = recipeCount.rows[0].count;
			res.json(retInfo);
		}
		// If username does not exist return wrong username object
		else {
			res.json({usernameWrong: true});
		}
	}
	catch(err) {
		console.log(err.message);
	}
});

// Get recipe list

profilesRouter.get("/usr/:username/recipeList", async (req, res) => {
	try {
		const { username } = req.params;
		const userIDQuery = await pool.query(
			"SELECT accountid FROM account WHERE username = $1;",
			[username]
		);
		userID = userIDQuery.rows[0].accountid;

		// Get list of recipe IDs
		const recIdList = await pool.query(
			"SELECT recipeid FROM recipe WHERE authorid = $1;",
			[userID]
		);
		recipeIDs = recIdList.rows;

		// Initialize return list
		retList = [];

		for (let recId of recipeIDs) {
			const componentIDs = await pool.query(
				"SELECT componentid FROM component WHERE recipeid = $1;",
				[recId.recipeid]
			);
		
			compIdArray = componentIDs.rows;

			// Initialize component array
				
			componentArray = [];
			
			for (let compIdObj of compIdArray) {
				const compId = compIdObj.componentid;
				const compInfo = await pool.query(
					"SELECT name, photoname FROM component WHERE componentid = $1;",
					[compId]
				);

				const ingreds = await pool.query(
					"SELECT ingredient, amount FROM componentingredients WHERE componentid = $1;",
					[compId]
				);

				const instructs = await pool.query(
					"SELECT instructions, stepnum FROM componentinstruction WHERE componentid = $1;",
					[compId]
				);
				// Create component object and push to component array

				const tempComp = {
					name: compInfo.rows[0].name,
					compPhotoName: compInfo.rows[0].photoname,
					ingreds: ingreds.rows,
					instructs: instructs.rows
				};
				componentArray.push(tempComp);
			}
	
			const recipeInstructions = await pool.query(
				"SELECT stepnum, instructions FROM instruction WHERE recipeid = $1;",
				[recId.recipeid]
			);

			const recipeInfo = await pool.query(
				"SELECT name, authorid, mainphotoname, timetocook, yeild, public FROM recipe WHERE recipeid = $1;",
				[recId.recipeid]
			);

			// Create recipe object and push to return list

			const retRecipe = {
				recipeID: recId.recipeid,
				recipeName: recipeInfo.rows[0].name,
				authorID: recipeInfo.rows[0].authorid,
				mainPhotoName: recipeInfo.rows[0].mainphotoname,
				public: recipeInfo.rows[0].public,
				timeToCook: recipeInfo.rows[0].timetocook,
				yield: recipeInfo.rows[0].yeild,
				instructions: recipeInstructions.rows,
				components: componentArray
			}
			retList.push(retRecipe);
		}
		res.json(retList);
	}
	catch(err) {
		console.log(err.message);
	}
});

// Follow a user

profilesRouter.post("/follow", async (req, res) => {
	try {
		const { follower, followee } = req.body;
		const newFollow = await pool.query(
			"INSERT INTO follower (follower, followee) VALUES ($1, $2);",
			[follower, followee]
		);
		res.json(follower);
	}
	catch(err) {
		console.log(err.message);
	}
});

// Unfollow a user

profilesRouter.delete("/unfollow/:follower/:followee", async (req, res) => {
	try {
		const { follower, followee } = req.params;
		console.log(req.params);
		const unFollow = await pool.query(
			"DELETE FROM follower WHERE follower = $1 AND followee = $2",
			[follower, followee]
		);
		console.log(unFollow);
		res.json(unFollow);
	}
	catch(err) {

	}
});

// Get Following

profilesRouter.get("/following/:follower/:followee", async (req, res) => {
	try {
		console.log(req.params);
		const { follower, followee } = req.params;
		
		const unFollow = await pool.query(
			"SELECT * FROM follower WHERE follower = $1 AND followee = $2",
			[follower, followee]
		);
		let following = false;
		// If entry extists, the user is following them
		if(unFollow.rows[0]) {
			following = true;
		}
		res.json({following});
	}
	catch(err) {
		console.log(err.message);
	}
});




module.exports = {
	profilesRouter,
};
