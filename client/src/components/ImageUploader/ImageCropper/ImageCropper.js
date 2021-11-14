import React from "react";
import Cropper from "cropperjs";
import "cropperjs/dist/cropper.min.css";


class ImageCropper extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			imageOriginal: this.props.src,
			imageCropped: '',
			imageElement: React.createRef()
		}
	}

	

	async componentDidMount() {
		const cropper = new Cropper(this.state.imageElement.current, {
			zoomable: true,
			scalable: false,
			aspectRatio: 1,
			crop: () => {
				const canvas = cropper.getCroppedCanvas();
				this.setState({ imageCropped: canvas });
			}
		});
	}

	render() {
		return (
			<div className="crop-img-container">
				<img ref={this.state.imageElement} src={this.state.imageOriginal}></img>
				<button className="cropButton" onClick={(e) => {
					// Send image to uploader
					this.props.UploaderCallBack(this.state.imageCropped);
					e.preventDefault();
				}}>Submit</button>
			</div>
		);
	};
}

export default ImageCropper;