import React from 'react';
import './imagecropmodal.css';
import ReactImageCrop from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';
import { check, times } from '../icon';
import { imagetoCanvas } from '../helpers/imagehelper';

class ImageCropModal extends React.Component {

    constructor(props) {
        super(props);
        this.imageRef = null;
        this.cropContainer = React.createRef(null);
        this.state = {
            imgSrc: null,
            crop: {
                unit: 'px'
            }
        }
    }

    componentDidMount() {
        // extract the file
        const { imageSrc } = this.props;
        const reader = new FileReader();
        reader.addEventListener("load", () => {
            this.setState({ imgSrc: reader.result })
        }, false);
        // create a base64 image file
        reader.readAsDataURL(imageSrc);
    }

    setImageRef = elem => this.imageRef = elem;

    // handlers for imagecrop utilities
    handleOnImageLoaded = (image) => {
        this.setImageRef(image);
        this.imageRef.style.maxHeight = this.cropContainer.current.getBoundingClientRect().height + 'px';
        this.setState({
            crop: { 
                height: image.height - 20, 
                width: image.width - 20, 
                unit: "px",
                x: 10,
                y: 10
            }
        });
        return false;
    }

    handleOnImageError = (e) => {
        console.log("could not load the image");
    }

    handleOnCropChange = (crop) => {
        this.setState({ crop: crop })
    }

    handleOnCropComplete = (crop, pixelCrop) => {
        // console.log(crop, pixelCrop);
        this.setState({ crop: crop })
    }

    // handler for crop components
    handleCropApproval = () => {
        const { canvasRef } = this.props;
        if (canvasRef && canvasRef.current) {
            imagetoCanvas(canvasRef.current, this.imageRef, this.state.crop)
            this.props.onCropResult(true);
        } else { this.props.onCropResult(false) }
        this.handleExit();
    }

    handleExit = () => {
        this.props.onExit()
    }



    render() {
        return (
            <main className="image-modal">
                <div className="image-crop-bx">
                    <div className="modal-toolbar">
                        <span onClick={this.handleExit}>{ times }</span>
                        <span onClick={this.handleCropApproval}>{ check }</span>
                    </div>
                    <div className="modal-crop-bx" ref={this.cropContainer}>
                        <ReactImageCrop 
                            src={this.state.imgSrc} 
                            crop={this.state.crop}
                            onImageLoaded={this.handleOnImageLoaded}
                            onImageError={this.handleOnImageError}
                            onChange={this.handleOnCropChange}
                            onComplete={this.handleOnCropComplete} />
                    </div>
                    
                </div>
            </main>
        )
    }
}

export default ImageCropModal;