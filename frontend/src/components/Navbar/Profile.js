import React, { useEffect, useState } from 'react';
import { auth } from './Firebase';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Button, Form, Container, Row, Col } from 'react-bootstrap';
import ToastContainer from 'react-toast';
import { toast } from 'react-toast';
import moment from 'moment';
import PDFHandler from './PDFHandler';
import './Profile.css';

const Profile = () => {
  const initialUser = {
    fname: '',
    lname: '',
    dob: '',
    address: '',
    phone: '',
    education: '',
    experience: '',
    skills: '',
  };

  const [user, setUser] = useState(initialUser);
  const [firebaseUser, setFirebaseUser] = useState(null);
  const [isExistingUser, setIsExistingUser] = useState(false);
  const navigate = useNavigate();

  const inputHandler = (e) => {
    const { name, value } = e.target;
    setUser({ ...user, [name]: value });
  };

  const dateFromDateString = (dateString) => moment(new Date(dateString)).format('YYYY-MM-DD');

  const submitForm = async (e) => {
    e.preventDefault();
    try {
      let response;
      if (isExistingUser) {
        response = await axios.put(`http://localhost:8000/api/user/update/${user._id}`, user);
      } else {
        response = await axios.post('http://localhost:8000/api/user/create', { ...user, email: firebaseUser.email });
      }
      toast.success(response.data.msg, { position: 'top-right' });
      navigate('/');
    } catch (error) {
      console.error(error);
      toast.error('Failed to save changes', { position: 'top-right' });
    }
  };

  useEffect(() => {
    const fetchUser = async (email) => {
      if (!email) return;
      try {
        const response = await axios.get(`http://localhost:8000/api/user/getuserbyemail?email=${email}`);
        console.log("SAMRIDDHI TIWAYUGUY:" ,response);
        if (response.data && Object.keys(response.data).length > 0) {
          const dob = response.data.dob ? dateFromDateString(response.data.dob) : '';
          setUser({ ...response.data, dob });
          setIsExistingUser(true);
        } else {
          setIsExistingUser(false);
        }
      } catch (error) {
        console.error('Error fetching user:', error);
        setIsExistingUser(false);
      }
    };

    const unsubscribe = auth.onAuthStateChanged((firebaseUser) => {
      if (firebaseUser) {
        setFirebaseUser(firebaseUser);
        fetchUser(firebaseUser.email);
      } else {
        navigate('/login');
      }
    });

    return () => unsubscribe();
  }, [navigate]);

  if (!firebaseUser) {
    return <div>Loading...</div>;
  }

  const fetchResumeData = async () => {
    try {
      const response = await axios.get(`http://localhost:8000/api/pdfdetails/getPDFsByEmployeeId/${user._id}`);
      if (response.data) {
        setUser((prevUser) => ({
          ...prevUser,
          ...response.data, // Populate with fetched resume data
        }));
        toast.success("Resume data applied!", { position: 'top-right' });
      } else {
        toast.error("No resume data found!", { position: 'top-right' });
      }
    } catch (error) {
      console.error("Error fetching resume data:", error);
      toast.error("Failed to fetch resume data!", { position: 'top-right' });
    }
  };

  const fetchResumeDataFromPDF = async () => {
    try {
      const response = await axios.get(`http://localhost:8000/api/pdfdetails/populate_data_by_resume/${firebaseUser.email}`);
      
      if (response.data) {
        setUser((prevUser) => ({
          ...prevUser,
          ...response.data.data, // Populate with fetched resume data
        }));
        // setUser({... response.data.data})
        console.log("RESPONSE DATA", response.data)
        console.log("MY USER", user)
        toast.success("Resume data applied!", { position: 'top-right' });
        // navigate('/profile');
      } else {
        toast.error("No resume data found!", { position: 'top-right' });
      }
     
    } catch (error) {
      console.error("Error fetching resume data:", error);
      toast.error("Failed to fetch resume data!", { position: 'top-right' });
    }
  };
  
 

  return (
    <>
      <Container className="profile-container">
        <video className="background-video" autoPlay loop muted>
          <source src="/videos/v4.mp4" type="video/mp4" />
        </video>

        <div className="profile-content">
        <Form onSubmit={submitForm} className="profile-content">
  <h2 className="text-center mb-4" style={{ fontWeight: 'bold', color: 'black' }}>
    Welcome, {firebaseUser.displayName}
  </h2>

  <div className="profile-image-container">
    <img src={firebaseUser.photoURL} alt="User Profile" className="profile-image" />
  </div>

  <div className="text-center mb-4" style={{ fontWeight: 'bold', color: 'black' }}>
    Email: {firebaseUser.email}
  </div>

  <Row className="mb-3">
    <Col md={6}>
      <Form.Group controlId="firstName">
        <Form.Label>First Name</Form.Label>
        <Form.Control
          type="text"
          placeholder="Enter first name"
          name="fname"
          value={user.fname}
          onChange={inputHandler}
          required
        />
      </Form.Group>
    </Col>
    <Col md={6}>
      <Form.Group controlId="lastName">
        <Form.Label>Last Name</Form.Label>
        <Form.Control
          type="text"
          placeholder="Enter last name"
          name="lname"
          value={user.lname}
          onChange={inputHandler}
          required
        />
      </Form.Group>
    </Col>
  </Row>

  <Row className="mb-3">
    <Col md={6}>
      <Form.Group controlId="dob">
        <Form.Label>Date of Birth</Form.Label>
        <Form.Control
          type="date"
          name="dob"
          value={user.dob}
          onChange={inputHandler}
          required
        />
      </Form.Group>
    </Col>
    <Col md={6}>
      <Form.Group controlId="address">
        <Form.Label>Address</Form.Label>
        <Form.Control
          type="text"
          placeholder="Enter address"
          name="address"
          value={user.address}
          onChange={inputHandler}
          required
        />
      </Form.Group>
    </Col>
  </Row>

  <Row className="mb-3">
    <Col md={6}>
      <Form.Group controlId="phone">
        <Form.Label>Phone</Form.Label>
        <Form.Control
          type="text"
          placeholder="Enter phone number"
          name="phone"
          value={user.phone}
          onChange={inputHandler}
          required
        />
      </Form.Group>
    </Col>
    <Col md={6}>
      <Form.Group controlId="education">
        <Form.Label>Education</Form.Label>
        <Form.Control
          type="text"
          placeholder="Enter highest education"
          name="education"
          value={user.education}
          onChange={inputHandler}
          required
        />
      </Form.Group>
    </Col>
  </Row>

  <Row className="mb-3">
    <Col md={6}>
      <Form.Group controlId="experience">
        <Form.Label>Experience (Years)</Form.Label>
        <Form.Control
          type="number"
          placeholder="Enter experience"
          name="experience"
          value={user.experience}
          onChange={inputHandler}
          required
        />
      </Form.Group>
    </Col>
    <Col md={6}>
      <Form.Group controlId="skills">
        <Form.Label>Skills</Form.Label>
        <Form.Control
          type="text"
          placeholder="Enter skills (comma-separated)"
          name="skills"
          value={user.skills}
          onChange={inputHandler}
          required
        />
      </Form.Group>
    </Col>
  </Row>

  <Row className="mb-3">
    <Col md={12}>
    <PDFHandler email = {firebaseUser.email} />
    </Col>
  </Row>

  <div className="d-flex justify-content-center mt-4">
    <Button type="submit" variant="primary" className="btn-3d">
      {isExistingUser ? 'Update Profile' : 'Create Profile'}
    </Button>
    <Button variant="primary" className="btn-3d" onClick={fetchResumeDataFromPDF}>
      Populate By Resume
    </Button>
  </div>
</Form>

        </div>
       
      </Container>
    </>
  );
};

export default Profile;
