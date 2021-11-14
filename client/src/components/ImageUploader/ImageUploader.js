import React from "react";
import ImageCropper from "./ImageCropper/ImageCropper";
import './ImageUploader.css';

import BackIcon from './BackIcon.png';
import uploadIcon from './UploadIcon.png';

class ImageUploader extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			index: props.photoIndex,
			open: props.open,
			imageFileOrig: '',
			imageOriginal: '',
			imageCropped: ''
		}
	}

	handleCallBack = (childData) => {
		console.log("in callback parent");
		this.setState({imageCropped: null, imageOriginal: null});
		// Send photo to AddRecipe
		this.props.onNewPhoto(childData.toDataURL("image/png"));
	}

	componentDidUpdate(prevProps) {
		if (prevProps.open !== this.props.open) {
			this.setState({open: this.props.open});
		}
	}


	render() {
		return (this.state.open) ? (
			<div className="imgUploadContainer" key={this.state.index}>
				<div className="imgUploadContent">
					<button className="closeButton" onClick={this.props.onClose}><img src={BackIcon}></img></button>
					{!(this.state.imageOriginal || this.state.imageCropped) && 
						<div className="imgInputContent">
							<input 
							className="hiddenFileInput"
							title=" "
							ref="file"
							type="file"
							name="test"
							id="imgInput"
							multiple={false}
							onChange={e => {
								if(!e.target.files || e.target.files.length === 0) {
									return
								}
								let file = e.target.files[0];
								const url = URL.createObjectURL(file);
								console.log(this.state.index);
								this.setState({imageFileOrig: file, imageOriginal: url});
							}}
						></input>
						<label htmlFor="imgInput" className="fileInput">
							<img src={uploadIcon}></img>
						</label>
					</div>}
					<div className="imgPreview">
						{this.state.imageOriginal && <ImageCropper src={this.state.imageOriginal} UploaderCallBack={this.handleCallBack}/>}
					</div>
				</div>
			</div>
		) : null;
	};
}

export default ImageUploader;