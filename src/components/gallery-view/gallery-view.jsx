import { useState, useEffect } from 'react';
import { Card, Button, Container, Row, Col, Form } from 'react-bootstrap';


export const GalleryView = () => {
  const [images, setImages] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);

  useEffect(() => {
    fetchImages();
  }, []);

  const fetchImages = () => {
    fetch('http://ALB-CCex-1735832636.us-west-1.elb.amazonaws.com/images') 
      .then((response) => response.json())
      .then((data) => {
        setImages(data.slice(1)); //for some reason, first item in array is "resized-images/" without anything
      })
      .catch((error) => {
        console.error('Error fetching images:', error);
      });
  };

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };
  

  const handleUpload = () => {
    //if no file is selected in the form  
    if (!selectedFile) {
      alert('Please select a file');
      return;
    }

    const formData = new FormData();
    formData.append('image', selectedFile);

    fetch('http://ALB-CCex-1735832636.us-west-1.elb.amazonaws.com/upload', {
      method: 'POST',
      body: formData,
    })
      .then((response) => {
        if (response.ok) {
          alert('File uploaded successfully');
          window.location.reload(); // Refresh page
        } else {
          alert('Failed to upload file');
        }
      })
      .catch((error) => {
        console.error('Error uploading file:', error);
        alert('Failed to upload file');
      });
  };

  const handleDownload = (fileName) => {
    window.open(`http://ALB-CCex-1735832636.us-west-1.elb.amazonaws.com/download/${fileName.Key.replace('resized-images/', '')}`); 
  };


  const handleFullView = (fileName) => {
    window.open(`http://ALB-CCex-1735832636.us-west-1.elb.amazonaws.com/images/${fileName.Key.replace('resized-images/', '')}`);
  };
  


  return (
    <div>
      <h1>Image Gallery</h1>
      <Row>
        <Col md={6}>
          <Form.Group>
          <Form.Control type="file" onChange={handleFileChange} />
          </Form.Group>
          <Button onClick={handleUpload}>Upload</Button>
        </Col>
      </Row>
      <Row className="mt-4">
      {images.map((image, index) => {
        // Remove resized-images/, I think because mapping uses the prefix for gallery
  //const fileName = image.Key.replace('resized-images/', ''); 
  
  return (
    <Col key={index} md={4} className="mb-3">
      <Card style={{ width: '18rem' }}>
        {/* Need to change data back into images */}
        <div className='gallery-image'>
          <Card.Img variant="top" src={`data:image/png;base64,${image.Data}`} />
          </div>
        <Card.Body>
        <Button onClick={() => handleFullView(image)}>Full View</Button>
          <Button onClick={() => handleDownload(image)}>Download</Button>
        </Card.Body>
      </Card>
    </Col>
  );
})}

      </Row>
    </div>
  );
};
