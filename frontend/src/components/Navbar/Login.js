import React, { useState } from "react";
import { auth, provider } from "./Firebase";
import { signInWithPopup, signInWithEmailAndPassword } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { Button, Modal, Form, Spinner, Container, Row, Col } from "react-bootstrap";
import { FaGoogle } from "react-icons/fa";

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showModal, setShowModal] = useState(true);

  const handleGoogleLogin = async () => {
    try {
      setLoading(true);
      await signInWithPopup(auth, provider);
      navigate("/profile");
    } catch (error) {
      console.error("Error during Google login:", error);
      setError("Failed to login with Google.");
    } finally {
      setLoading(false);
    }
  };

  const handleEmailLogin = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      await signInWithEmailAndPassword(auth, email, password);
      navigate("/profile");
    } catch (error) {
      console.error("Error during email login:", error);
      setError("Invalid email or password.");
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => setShowModal(false);

  return (
    <Modal show={showModal} onHide={handleClose} centered backdrop="static" keyboard={false} className="login-modal">
      <Modal.Header closeButton className="border-0">
        <Modal.Title className="w-100 text-center fw-bold">Welcome Back! 🚀</Modal.Title>
      </Modal.Header>
      <Modal.Body className="px-4 pb-4">
        <Container>
          <Row className="justify-content-center">
            <Col md={10}>
              {error && <div className="alert alert-danger text-center">{error}</div>}
              <Form onSubmit={handleEmailLogin}>
                <Form.Group className="mb-3">
                  <Form.Label className="fw-semibold">Email Address</Form.Label>
                  <Form.Control
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    required
                    className="shadow-sm"
                  />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label className="fw-semibold">Password</Form.Label>
                  <Form.Control
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    required
                    className="shadow-sm"
                  />
                </Form.Group>
                <Button variant="success" type="submit" disabled={loading} className="w-100 shadow">
                  {loading ? <Spinner animation="border" size="sm" /> : "Login"}
                </Button>
              </Form>
              <div className="text-center my-3 fw-semibold">OR</div>
              <Button variant="outline-dark" onClick={handleGoogleLogin} disabled={loading} className="w-100 shadow">
                {loading ? (
                  <Spinner animation="border" size="sm" />
                ) : (
                  <>
                    <FaGoogle className="me-2" /> Login with Google
                  </>
                )}
              </Button>
            </Col>
          </Row>
        </Container>
      </Modal.Body>
      <Modal.Footer className="border-0 d-flex justify-content-center">
        <small className="text-muted">
          Don't have an account? <a href="/signup" className="text-decoration-none fw-semibold">Sign up</a>
        </small>
      </Modal.Footer>
    </Modal>
  );
};

export default Login;
