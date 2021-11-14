import React from "react";
import { Formik, Field, Form, FieldArray } from "formik";
import { Redirect } from "react-router-dom";
import './AddRecipe.css';


import AddRecipeHeader from "./AddRecipeHeader";
import ImageUploader from "../ImageUploader/ImageUploader";
import photoIcon from './photos.png'
import AddRecipeSubmitting from "./AddRecipeSubmitting";


class AddRecipe extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			// Id of recipe created
			newRecipeId: '',
			// Allows submit
			formComplete: true,
			// Takes user to recipe after creation
			submitted: false,
			submitting: false,
			uploadPlace: '',
			username: this.props.user,
			// Holds boolean for each component photo upload popup
			compPhotoUploadOpen: [false],
			// Main photo upload popup
			mainPhotoUploadOpen: false,
			mainPhoto: null,
			compPhotos: [null]
		}
	}
	dataURItoBlob(dataURI) {
    var binary = atob(dataURI.split(',')[1]);
    var array = [];
    for(var i = 0; i < binary.length; i++) {
        array.push(binary.charCodeAt(i));
    }
    return new Blob([new Uint8Array(array)], {type: 'image/jpeg'});
}

	render() {
		return (
			<div>
				{/* Once submitted Redirect */}
				{this.state.submitted ? <Redirect to={`/post/${this.state.newRecipeId}`} /> : 
				// Main Form
				<Formik 
					initialValues={{ 
						recipeName: '',
						recipePhotoName: '',
						timeToCook: '',
						yield: '',
						instructions: [{
							stepNum: 1,
							instruction: ''
						}],
						components: [{
							componentName: '',
							componentPhotoName: '', 
							componentInstructions: [{
								stepNum: 1,
								instruction: ''
							}],
							componentIngredients: [{
								amount: '',
								ingredient: ''
							}]
							}]}}
					onSubmit={ async (data, { setSubmitting }) =>  {
						// Set submitting disables submit button after first click
						setSubmitting(true);
						this.setState({ submitting: true, uploadPlace: 'AWS S3 Bucket' });
						if (this.state.mainPhoto) {
							// Upload Main Photo
							// Get AWS S3 main photo upload URL
							const response = await fetch("http://localhost:5000/api/aws/s3Url");
							const resJson = await response.json();
							// Update photo name in formik data
							data.recipePhotoName = resJson.imageName;
							// Turn photo to blob for upload
							const blob = this.dataURItoBlob(this.state.mainPhoto);
							// Upload image to s3 bucket
							const putImg = await fetch(resJson.uploadUrl, {
								method: "PUT",
								headers: {
									"Content-Type": "multipart/form-data"
								},
								body: blob
							});
						}
						// Upload Component photos
						for (let i = 0; i < this.state.compPhotos.length; i++) {
							if(this.state.compPhotos[i]) {
								// Get AWS S3 component photo upload URL
								const response = await fetch("http://localhost:5000/api/aws/s3Url");
								const resJson = await response.json();
								// Update photo name in formik data
								data.components[i].componentPhotoName = resJson.imageName;
								// Turn photo to blob for upload
								const blob = this.dataURItoBlob(this.state.compPhotos[i]);
								// Upload image to s3 bucket
								const putImg = await fetch(resJson.uploadUrl, {
									method: "PUT",
									headers: {
										"Content-Type": "multipart/form-data"
									},
									body: blob
								});
							}
						}
						this.setState({ uploadPlace: 'Postgres DataBase'});
						// Send to database
						const dbUrl = "http://localhost:5000/api/recipes/newPost/" + this.state.username;
						const dataBaseResponse = await fetch(dbUrl, {
							method: "POST",
							headers: { "Content-Type": "application/json" },
							body: JSON.stringify(data)
						});
						const dbResData = await dataBaseResponse.json()
						console.log(dbResData);


						// Set state to redirect
						this.setState({ submitted: true, newRecipeId: dbResData.recipeId, submitting: false });
						setSubmitting(false);
				}}>
					{({ values, isSubmitting }) => (
					<Form className="addRecipe_container">
						<AddRecipeHeader auth={this.state.username}/>
						<Field className="recipeNameInput" name="recipeName" type="input" placeholder="Recipe Name"/>
						{/* Main photo upload Button / Main photo Preview*/}
						{(!this.state.mainPhoto) ? 
							(<button className="recipePhotoInput" type="button" onClick={() => {
								this.setState({mainPhotoUploadOpen: true});
							}}> 
								<img src={photoIcon}></img>
							</button>) : (
								// Photo preview
							<div className="mainPhotoPrev">
								<img src={this.state.mainPhoto}></img>
							</div>
						)}
						{/* Main Image Uploader Popup */}
						<ImageUploader 
							open={this.state.mainPhotoUploadOpen} 
							onClose={() => this.setState({mainPhotoUploadOpen: false})}
							// After submitting picture, close popup and set the mainPhoto state
							onNewPhoto={(childData) => {
								this.setState(prevState => ({ mainPhotoUploadOpen: false,  mainPhoto: childData }));
							}}/>
						<Field className="recipeTimeInput" name="timeToCook" type="input" placeholder="Time to Cook"/>
						<Field className="recipeYieldInput" name="yield" type="input" placeholder="Yield"/>
						<h2 id="instructions">Instructions</h2>
						<FieldArray name="instructions">
							{arrayHelpers => (
								<div className="addRecipe_instructionsContainer">
									{/* Map Each instruction in formik values */}
									{values.instructions.map((instruction, insIndex) => {
										// Get name of instruction for formik field
										const instructionIns = `instructions.${insIndex}.instruction`;
										return (
											<div className="instructionsInputCont" key={insIndex}>
												<h3 className="stepNum">{`Step ${instruction.stepNum}:`}</h3>
												<Field className="instructionsInput" name={instructionIns} type="textarea" placeholder="Instruction" 
													// Clicking the last instruction will add a new one
													onClick={() => (values.instructions.length == insIndex + 1) ? (
														arrayHelpers.push({
														stepNum: values.instructions.length + 1,
														instruction: ''
														})
														) : {}}>
												</Field>
												{/* Delete from formik values using arrayHelpers.pop */}
												{((values.instructions.length == insIndex + 1) && (instruction.stepNum != 1)) ? (<button 
												className="deleteButton" 
												onClick={() => arrayHelpers.pop()}>-</button>) :(<div className="deleteHidden"></div>)}	
											</div>
										);
									})}
								</div>
							)}
						</FieldArray>
						<h2 id="components">Components</h2>
						<FieldArray name="components"> 
							{arrayHelpers => (
								<div className="addRecipe_componentContainer">
									{values.components.map((component, index) => {
										const compName = `components.${index}.componentName`;
										const compIngreds = `components.${index}.componentIngredients`;
										const compInstructs = `components.${index}.componentInstructions`;
										return (
											<div className="componentFieldContainer"key={index}>
												<div className="compNameInput" >
													<Field className="compNameField" name={compName} type="input" placeholder="Component Name"></Field>
													{/* Delete Component Button.  Can only delete last component */}
													{((values.components.length == index + 1) && (index != 0)) ? 
														(<button 
															type="button"
															className="deleteButton" 
															onClick={() => {
																// Update formik values
																arrayHelpers.pop();
																// Remove last element of compPhotoUploadOpen and compPhotos
																let newOpenArr = this.state.compPhotoUploadOpen.slice(0, -1);
																let newPhotoArr = this.state.compPhotos.slice(0, -1);
																this.setState({ compPhotoOpen: newOpenArr, compPhotos: newPhotoArr });
														}}>-</button>) : 
														(<div className="deleteHidden"></div>)}	
												</div>
												{/* Upload component photo button / preview.  Available if Photo doesn't exist */}
												{(!this.state.compPhotos[index]) ? 
													(<button className="compPhotoInput" type="button" onClick={() => {
														let tempOpenArr = this.state.compPhotoUploadOpen;
														// Use index from mapping to update compPhotoUploadOpen array
														tempOpenArr[index] = true;							
														this.setState({ compPhotoUploadOpen: tempOpenArr });
													}}>
														<img src={photoIcon}></img>
													</button>) : 
													// Preview
													(<div className="compPhotoPrev">
														<img src={this.state.compPhotos[index]}></img>
													</div>)}
												{/* Upload component photo popup.  Uses compPhotoUploadOpen array */}
												<ImageUploader 
													photoIndex={index}
													open={this.state.compPhotoUploadOpen[index]} 
													onClose={() => {
														// Use index from mapping to update compPhotoUploadOpen
														let tempOpenArray = this.state.compPhotoUploadOpen;
														tempOpenArray[index] = false;
														this.setState({ compPhotoUploadOpen: tempOpenArray });
													}}
													onNewPhoto={(childData) => {
														// Use index from mapping to update compPhotos and close popup
														const tempCompPhotos = this.state.compPhotos;
														tempCompPhotos[index] = childData;
														let tempOpenArray = this.state.compPhotoUploadOpen;
														tempOpenArray[index] = false;
														this.setState(prevState => ({ compPhotoUploadOpen: tempOpenArray, compPhotos: tempCompPhotos }));
													}}/>
												<h3 id="ingredients">Ingredients</h3>
												<FieldArray name={compIngreds}>
													{arrayHelpersIng => (
														<div className="addRecipe_componentIngredientsContainer">
															{component.componentIngredients.map((componentIngredient, ingIndex) => {
																const compIngredientIng = `${compIngreds}.${ingIndex}.ingredient`;
																const compIngredientAmount = `${compIngreds}.${ingIndex}.amount`;
																return (
																	<div className="ingredInputCont" key={ingIndex}>
																		<Field className="amountInput" name={compIngredientAmount} type="input" placeholder="Amount"></Field>
																		<Field className="ingredientInput" name={compIngredientIng} type="input" placeholder="Ingredient" onClick={() => (component.componentIngredients.length == ingIndex + 1) ? (
																			arrayHelpersIng.push({
																			amount: '',
																			ingredient: ''
																			})) : {}}>
																		</Field>	
																		{((component.componentIngredients.length == ingIndex + 1) && (ingIndex != 0)) ? (<button 
																		className="deleteButton" 
																		onClick={() => arrayHelpersIng.pop()}>-</button>) :(<div className="deleteHidden"></div>)}	
																	</div>
																);
															})}
														</div>
													)}
												</FieldArray>
												<h3 id="instructionsComp">Instructions</h3>
												<FieldArray name={compInstructs}>
													{arrayHelpersIns => (
														<div className="addRecipe_compInstructionsContainer">
															{component.componentInstructions.map((componentInstruction, insIndex) => {
																const compInstructionIns = `${compInstructs}.${insIndex}.instruction`;
																return (
																	<div className="instructionsInputCont" key={insIndex}>
																		<h3 className="stepNum">{`Step ${componentInstruction.stepNum}:`}</h3>
																		<Field className="compInstructionsInput" name={compInstructionIns} type="input" placeholder="Instruction" onClick={() => (component.componentInstructions.length == insIndex + 1) ? (
																			arrayHelpersIns.push({
																				stepNum: values.components[index].componentInstructions.length + 1,
																				instruction: ''
																			})) : {}}></Field>
																		{((component.componentInstructions.length == insIndex + 1) && (insIndex != 0)) ? (<button 
																		className="deleteButton" 
																		onClick={() => arrayHelpersIns.pop()}>-</button>) :(<div className="deleteHidden"></div>)}
																	</div>
																);
															})}
														</div>
													)}
												</FieldArray>
											</div>
										);
									})}
									{/* Add Component Button */}
									<button type="button" className="addCompButton" onClick={() => {
										// Add to Formik data with arrayHelpers
										arrayHelpers.push({
											componentName: '',
											componentPhotoName: '', 
											componentIngredients: [{
												amount: '',
												ingredient: ''
											}],
											componentInstructions: [{
												stepNum: 1,
												instruction: ''
											}]});
											// append null to compPhotos array and false to compPhotoUploadOpen array
											this.setState(prevState => ({ compPhotos: [...prevState.compPhotos, null], compPhotoUploadOpen: [...prevState.compPhotoUploadOpen, false]}));
									}}>
										Add Component
									</button>
								</div>
						)}
						</FieldArray>
						<button className="submitButton" disabled={isSubmitting && this.state.formComplete} type="submit">Submit</button>
						<AddRecipeSubmitting open={this.state.submitting} place={this.state.uploadPlace}/>
						{/* <pre>{JSON.stringify(values, null, 2)}</pre> */}
					</Form>
					
				)}</Formik>}

				</div>
		);
	};
}

export default AddRecipe;