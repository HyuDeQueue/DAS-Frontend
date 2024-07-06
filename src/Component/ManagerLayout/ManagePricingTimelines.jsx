import React, { useEffect, useState } from "react";
import axios from "axios";
import { Modal, Button, Form } from "react-bootstrap";
import "../ManagerLayout/ManagePricingTimeline.css";
import { SERVICES_URL } from "../../utils/apiEndPoints";
import Spinner from "../Spinner/Spinner";

const ServiceModal = ({ show, handleClose, handleSubmit, formValues, handleInputChange }) => {
  return (
    <Modal show={show} onHide={handleClose} className="custom-modal">
      <Modal.Header closeButton>
        <Modal.Title>{formValues.serviceId ? "Edit Service" : "Add Service"}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit}>
          <Form.Group controlId="formServiceName">
            <Form.Label>Name</Form.Label>
            <Form.Control
              type="text"
              name="serviceName"
              value={formValues.serviceName}
              onChange={handleInputChange}
              required
            />
          </Form.Group>
          <Form.Group controlId="formServiceDescription">
            <Form.Label>Description</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              name="serviceDescription"
              value={formValues.serviceDescription}
              onChange={handleInputChange}
              required
            />
          </Form.Group>
          <Form.Group controlId="formServiceStatus">
            <Form.Label>Status</Form.Label>
            <Form.Control
              type="text"
              name="serviceStatus"
              value={formValues.serviceStatus}
              onChange={handleInputChange}
              required
            />
          </Form.Group>
          <Form.Group controlId="formServicePrice">
            <Form.Label>Price</Form.Label>
            <Form.Control
              type="number"
              name="servicePrice"
              value={formValues.servicePrice}
              onChange={handleInputChange}
              required
            />
          </Form.Group>
          <Form.Group controlId="formServiceTime">
            <Form.Label>Time</Form.Label>
            <Form.Control
              type="number"
              name="serviceTime"
              value={formValues.serviceTime}
              onChange={handleInputChange}
              required
            />
          </Form.Group>
          <div className="modal-footer">
            <Button variant="primary" type="submit">
              Save
            </Button>
            <Button variant="secondary" onClick={handleClose}>
              Cancel
            </Button>
          </div>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

const ManageOrderTimelines = () => {
  const [loading, setLoading] = useState(true);
  const [services, setServices] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [formValues, setFormValues] = useState({
    serviceId: "",
    serviceName: "",
    serviceDescription: "",
    serviceStatus: "",
    servicePrice: "",
    serviceTime: "",
  });

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await axios.get(SERVICES_URL);
        setServices(response.data);
      } catch (error) {
        console.error("Error fetching the services:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, []);

  const editService = (service) => {
    setFormValues({
      serviceId: service.serviceId,
      serviceName: service.serviceName,
      serviceDescription: service.serviceDescription,
      serviceStatus: service.serviceStatus,
      servicePrice: service.servicePrice,
      serviceTime: service.serviceTime,
    });
    setShowModal(true);
  };

  const addService = () => {
    setFormValues({
      serviceId: "",
      serviceName: "",
      serviceDescription: "",
      serviceStatus: "",
      servicePrice: "",
      serviceTime: "",
    });
    setShowModal(true);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormValues((prevValues) => ({
      ...prevValues,
      [name]: value,
    }));
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    const confirmMessage = formValues.serviceId ? "Bạn có chắc chắn muốn lưu các thay đổi này?" : "Bạn có chắc chắn muốn thêm dịch vụ này?";
    if (window.confirm(confirmMessage)) {
      try {
        if (formValues.serviceId) {
          await axios.put(`${SERVICES_URL}/${formValues.serviceId}`, formValues);
          setServices((prevServices) =>
            prevServices.map((service) =>
              service.serviceId === formValues.serviceId ? formValues : service
            )
          );
        } else {
          const response = await axios.post(SERVICES_URL, formValues);
          setServices((prevServices) => [...prevServices, response.data]);
        }
        setShowModal(false);
        setFormValues({
          serviceId: "",
          serviceName: "",
          serviceDescription: "",
          serviceStatus: "",
          servicePrice: "",
          serviceTime: "",
        });
      } catch (error) {
        console.error("Error saving the service:", error);
      }
    }
  };

  const handleCloseModal = () => {
    if (window.confirm("Bạn muốn dừng chỉnh sửa thông tin dịch vụ?")) {
      setShowModal(false);
    }
  };

  if (loading) {
    return (
      <div className="loading-indicator">
        <Spinner />
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="max-w-full mx-auto p-4">
        <h4 className="text-lg font-semibold text-gray-800 mb-4">
          Manage Assessment Services
        </h4>
        <Button
          className="mb-4"
          variant="success"
          onClick={addService}
        >
          Add Service
        </Button>
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white rounded-lg shadow overflow-hidden">
            <thead className="bg-blue-600 text-white">
              <tr>
                <th className="py-4 px-4 text-center align-middle">ID</th>
                <th className="py-4 px-4 text-center align-middle">Name</th>
                <th className="py-4 px-4 text-center align-middle">Description</th>
                <th className="py-4 px-4 text-center align-middle">Status</th>
                <th className="py-4 px-4 text-center align-middle">Price</th>
                <th className="py-4 px-4 text-center align-middle">Time</th>
                <th className="py-4 px-4 text-center align-middle">Action</th>
              </tr>
            </thead>
            <tbody className="text-gray-700">
              {services.map((service) => (
                <tr key={service.serviceId}>
                  <td className="py-4 px-4 text-center align-middle">
                    {service.serviceId}
                  </td>
                  <td className="py-4 px-4 text-center align-middle">
                    {service.serviceName}
                  </td>
                  <td className="py-4 px-4 text-center align-middle" dangerouslySetInnerHTML={{ __html: service.serviceDescription }}>
                  </td>
                  <td className="py-4 px-4 text-center align-middle">
                    {service.serviceStatus}
                  </td>
                  <td className="py-4 px-4 text-center align-middle">
                    {service.servicePrice} VND
                  </td>
                  <td className="py-4 px-4 text-center align-middle">
                    {service.serviceTime} h
                  </td>
                  <td className="py-4 px-4 text-center align-middle">
                    <Button
                      variant="primary"
                      onClick={() => editService(service)}
                    >
                      Edit
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <ServiceModal
        show={showModal}
        handleClose={handleCloseModal}
        handleSubmit={handleFormSubmit}
        formValues={formValues}
        handleInputChange={handleInputChange}
      />
    </div>
  );
};

export default ManageOrderTimelines;
