import React from 'react';
import { download, file, handUp } from './icon';
import './App.css';
import ImageCropModal from './components/ImageCropModal';
import { downloadImage, base64StringtoFile } from './helpers/imagehelper';

const App = () => {
  const canvasRef = React.useRef(null);
  const [ imageInput, setImageInput ] = React.useState(null);
  const [ fileProps, setFileProps ] = React.useState({ name: null, type: null })
  const [ showCanvas, setShowCanvas ] = React.useState(false);

  const handleModalExit = () => {
    setImageInput(null)
  }

  const handleModalCropApproval = (valid) => {
    setShowCanvas(valid)
  }

  const handleInput = (e) => {
    console.log(e.target.files)
    const { name, type } = e.target.files[0];
    const supportedFormats = ['image/jpg','image/gif','image/png', 'image/jpeg'];
    let file = (e.target.files ? e.target.files[0] :e.target.value || undefined);

    if (file && file.type) {
      if (supportedFormats.indexOf(file.type) < 0) {
        alert('Only Images Supported!');
      }
      else {
        setImageInput(e.target.files[0])
        setFileProps({ name: name.replace(" ", "_"), type })
      }
    }
  }

  const handleFileDownload = () => {
    if (fileProps && (fileProps.name && fileProps.type)) {
      const imageData = canvasRef.current.toDataURL(fileProps.type);
      const fileName = `${fileProps.name}.${fileProps.type.split("/")[1]}`;
      downloadImage(imageData, fileName)
    }
  }

  const consoleLogFile = () => {
    if (fileProps && (fileProps.name && fileProps.type)) {
      const imageData = canvasRef.current.toDataURL(fileProps.type);
      const fileName = `${fileProps.name}.${fileProps.type.split("/")[1]}`;
      const newFile = base64StringtoFile(imageData, fileName);
      console.log(newFile)
    }
  }

  const uploadBox = (
    <div className="upload-bx">
      <input type="file" onInput={handleInput} accept="image/gif, image/jpeg, image/png, image/jpg" />
      <span>{ handUp }</span>
      <span>Upload</span>
    </div>
  );

  const ImageViewBox = (
    <div><canvas ref={canvasRef}></canvas></div>
  );

  const ImageCropModalBox = (
    <ImageCropModal 
        imageSrc={imageInput}
        canvasRef={canvasRef}
        onExit={handleModalExit}
        onCropResult={handleModalCropApproval} ></ImageCropModal>
    )

  return (
    <div className="App">
    {
      !showCanvas ? (imageInput ? ImageCropModalBox : uploadBox) : <></>
    } 
    <div className={`result-bx ${showCanvas ? 'show' : ''}`}>
      { ImageViewBox }
      <div className="crop-util"> 
        <button onClick={() => {
          setShowCanvas(false);
          setFileProps({ name: null, type: null })
        }}>clear</button>
        <span onClick={handleFileDownload}>{ download }</span>
        <span onClick={consoleLogFile}>{ file }</span>
      </div>
    </div>
    </div>
  );
}

export default App;
