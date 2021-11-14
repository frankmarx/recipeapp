const { Router } = require('express');

const recipesRouter = Router();
const pool = require("../db");

// Get Recipe Info

recipesRouter.get("/:recId", async (req, res) => {
	try {
		const { recId } = req.params;

		const componentIDs = await pool.query(
			"SELECT componentid FROM component WHERE recipeid = $1;",
			[recId]
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

			// Create temporary component

			const tempComp = {
				name: compInfo.rows[0].name,
				compPhotoName: compInfo.rows[0].photoname,
				ingreds: ingreds.rows,
				instructs: instructs.rows
			};
			// Push component to array
			componentArray.push(tempComp);
		}
		const recipeInstructions = await pool.query(
			"SELECT stepnum, instructions FROM instruction WHERE recipeid = $1;",
			[recId]
		);
		const recipeInfo = await pool.query(
			"SELECT name, authorid, mainphotoname, timetocook, yeild, public, timeposted FROM recipe WHERE recipeid = $1;",
			[recId]
		);
		// Create recipe object

		const retRecipe = {
			recipeID: recId,
			recipeName: recipeInfo.rows[0].name,
			authorID: recipeInfo.rows[0].authorid,
			mainPhotoName: recipeInfo.rows[0].mainphotoname,
			public: recipeInfo.rows[0].public,
			timeToCook: recipeInfo.rows[0].timetocook,
			yield: recipeInfo.rows[0].yeild,
			timePosted: recipeInfo.rows[0].timeposted,
			instructions: recipeInstructions.rows,
			components: componentArray
		}
		res.json(retRecipe);
	}
	catch(err) {
		console.log(err.message);
	}
});

// Add new recipe

recipesRouter.post("/newPost/:username", async (req, res) => {
	try {
		const { username } = req.params;
		const recipe = req.body;

		const userInfo = await pool.query(
			"SELECT accountid FROM account WHERE username = $1;",
			[username]
		);

		const accountId = userInfo.rows[0].accountid;
		const currTime = new Date().getTime();

		// Add Recipe Entry
		const insertRec = await pool.query(
			"INSERT INTO recipe (name, authorid, mainphotoname, public, timetocook, yeild, timeposted) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING recipeid;",
			[recipe.recipeName, accountId, recipe.recipePhotoName, true, recipe.timeToCook, recipe.yield, currTime]
		);

		const recipeId = insertRec.rows[0].recipeid;
		// Add Instructions
		for (let ins of recipe.instructions) {
			// Add Instruction Entry
			const insertIns = await pool.query(
				"INSERT INTO instruction (recipeid, stepnum, instructions) VALUES ($1, $2, $3);",
				[recipeId, ins.stepNum, ins.instruction]
			);
		}

		// Add Components
		for (let comp of recipe.components) {

			// Add Component Entry
			const insertComp = await pool.query(
				"INSERT INTO component (name, recipeid, photoname) VALUES ($1, $2, $3) RETURNING componentid;",
				[comp.componentName, recipeId, comp.componentPhotoName]
			);
			const componentID = insertComp.rows[0].componentid;

			// Add Component Instructions
			for (let compIns of comp.componentInstructions) {
				// Add Instruction Entry
				const insertCompIns = await pool.query(
					"INSERT INTO componentinstruction (componentid, stepnum, instructions) VALUES ($1, $2, $3);",
					[componentID, compIns.stepNum, compIns.instruction]
				);
			}

			// Add Component Ingredients
			for (let compIng of comp.componentIngredients) {
				// Add Ingredient Entry
				const insertCompIng = await pool.query(
					"INSERT INTO componentingredients (componentid, ingredient, amount) VALUES ($1, $2, $3);",
					[componentID, compIng.ingredient, compIng.amount]
				);
			}
		}

		// Return recipeId
		console.log(recipeId);
		res.json({recipeId});
	}
	catch(err) {
		console.log(err.message);
	}
});

// Add component to recipe

recipesRouter.post("/:id/component", async (req, res) => {
	try {
		const { id } = req.params;
		const { name, componentNum } = req.body;
		const newComponent = await pool.query(
			"INSERT INTO component (name, recipeid, componentnum) VALUES ($1, $2, $3);",
			[name, id, componentNum]
		);
		res.json(newComponent);
	}
	catch(err) {
		console.log(err.message);
	}
});
 
// Add instruction to component

recipesRouter.post("/:id/component/:compId/componentinstruction", async (req, res) => {
	try {
		const { compId } = req.params;
		const { stepNum, instruction } = req.body;
		const newComponentInstruction = await pool.query(
			"INSERT INTO componentinstruction (componentid, stepnum, instructions) VALUES ($1, $2, $3);",
			[compId, stepNum, instruction]
		);
		res.json(newComponentInstruction);
	}
	catch(err) {
		console.log(err.message);
	}
});

// Add ingredient to component

recipesRouter.post("/:id/component/:compId/componentingredients", async (req, res) => {
	try {
		const { compId } = req.params;
		const { ingredient, amount } = req.body;
		const newComponentIngredient = await pool.query(
			"INSERT INTO componentingredients (componentid, ingredient, amount) VALUES ($1, $2, $3);",
			[compId, ingredient, amount]
		);
		res.json(newComponentIngredient);
	}
	catch(err) {
		console.log(err.message);
	}
});



module.exports = {
	recipesRouter,
};