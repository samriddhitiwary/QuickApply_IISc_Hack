import React, { useEffect, useState } from "react";
import axios from "axios";
import { Button, Form } from "react-bootstrap";
import "./PDFHandler.css";

const PDFHandler = () => {
  const [allResumes, setAllResumes] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadedResumeId, setUploadedResumeId] = useState(null);
  const userData = JSON.parse(sessionStorage.getItem("userdata"));
  const employeeId = userData ? userData._id : null;

  useEffect(() => {
    const fetchResumes = async () => {
      try {
        if (employeeId) {
          const response = await fetch(
            `http://localhost:8000/api/pdfdetails/getPDFsByEmployeeId/${employeeId}`
          );
          const data = await response.json();
          if (data && data.data) {
            setAllResumes(data.data);
          }
        }
      } catch (error) {
        console.error("Error fetching resumes:", error);
      }
    };

    fetchResumes();
  }, [employeeId]);

  const handleOpenPDFModal = async (employeeId) => {
    if (employeeId) {
      try {
        const response = await axios.get(
          `http://localhost:8000/api/pdfdetails/getPDFsByEmployeeId/${employeeId}`,
          { responseType: "arraybuffer" }
        );
        const blob = new Blob([response.data], { type: "application/pdf" });
        const link = window.URL.createObjectURL(blob);
        window.open(link, "", "height=650,width=840");
      } catch (error) {
        console.error("Error fetching resume PDF:", error);
      }
    }
  };

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      alert("Please select a file to upload");
      return;
    }
    const formData = new FormData();
    formData.append("file", selectedFile);
    formData.append("employeeId", employeeId);
    
    try {
      const response = await axios.post("http://localhost:8000/api/pdfdetails/create", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      alert("Resume uploaded successfully");
      setUploadedResumeId(response.data.resumeId);
      window.location.reload();
    } catch (error) {
      console.error("Error uploading resume:", error);
    }
  };

  return (
    <div className="table-container">
      <Form.Group>
        <Form.Control type="file" accept="application/pdf" onChange={handleFileChange} />
        <Button onClick={handleUpload} className="upload-btn">Upload Resume</Button>
        {uploadedResumeId && (
          <Button onClick={() => handleOpenPDFModal(uploadedResumeId)} className="view-uploaded-btn">
            View Uploaded Resume
          </Button>
        )}
      </Form.Group>
      {allResumes.length > 0 ? (
        <table className="table">
          <thead>
            <tr>
              <th>Employee Name</th>
              <th>Date</th>
              <th>Resume</th>
            </tr>
          </thead>
          <tbody>
            {allResumes.map((resume) => (
              <tr key={resume._id}>
                <td>{resume.EmplyeeName}</td>
                <td>{new Date(resume.date).toLocaleDateString()}</td>
                <td>
                  <Button onClick={() => handleOpenPDFModal(employeeId._id)}>
                    View Resume
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p className="no-data">No resumes found.</p>
      )}
    </div>
  );
};

export default PDFHandler;
