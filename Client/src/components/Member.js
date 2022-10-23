import React, { useEffect } from 'react'
import { useLocation } from 'react-router-dom';
import { useState, useRef } from "react";
import 'bootstrap/dist/css/bootstrap.css';
import Table from 'react-bootstrap/Table';
import isIsraeliIdValid from 'israeli-id-validator';
import { Button, Form } from 'react-bootstrap';
import MemberService from '../services/MemberService';
import DateTimePicker from 'react-datetime-picker';
import { useNavigate } from 'react-router-dom';
const Member = () => {
    const location = useLocation();
    const action = useRef(location.state.action);
    const memberId = useRef(location.state.id);

    const navigate = useNavigate();
    const navigateToAddVaccine = () => {
        navigate('/addVaccine', { state: { id: memberId.current } });
    };


    const phoneReg = RegExp(
        /^(?:(?:(\+?972|\(\+?972\)|\+?\(972\))(?:\s|\.|-)?([1-9]\d?))|(0[23489]{1})|(0[57]{1}[0-9]))(?:\s|\.|-)?([^0\D]{1}\d{2}(?:\s|\.|-)?\d{4})$/
    );
    const cellPhoneReg = RegExp(
        /^0(5[^7]|[2-4]|[8-9]|7[0-9])[0-9]{7}$/
    );

    const [state, setState] = useState({
        id: '',
        firstName: '',
        lastName: '',
        address: '',
        phoneNumber: '',
        cellPhoneNumber: '',
        dateOfBirth: undefined,
        recoveryDate: undefined,
        positiveResultDate: undefined,
        vaccinations: [],
        formErrors: {
            id: "",
            firstName: "",
            lastName: "",
            address: "",
            phone: "",
            cellPhone: "",
        }
    });

    const formValid = ({ formErrors, ...rest }) => {
        let valid = true;

        // validate form errors being empty
        Object.values(formErrors).forEach(val => {
            val.length > 0 && (valid = false);
        });

        // validate the form was filled out
        Object.values(rest).forEach(val => {
            val === null && (valid = false);
        });

        return valid;
    };

    const handleSubmit = e => {
        e.preventDefault();

        if (formValid(state)) {
            console.log(`
              --SUBMITTING--
              ID: ${state.id}
              First Name: ${state.firstName}
              Last Name: ${state.lastName}
              Address: ${state.address}
              Date Of Birth: ${state.dateOfBirth}
            
            `);
            if (action.current === 'add') {
               
                MemberService.add(state).then((response) => {
                    if (response.status === 200) {
                        alert("Member successfully created");
                        document.getElementById("reset-form").reset();
                        navigate('/');
                        
                    }
                },
                    (error) => {
                        if (error.status === 409) {
                            alert("Member with same id already exists");
                        }
                        else {
                            alert("Problem adding member");
                        }
                    });
            }
            else if (action.current === 'update') {
                MemberService.update(state).then((response) => {
                    if (response.status === 200) {
                        alert("Member successfully updated");
                        document.getElementById("reset-form").reset();
                        navigate('/');
                    }
                },
                    () => {
                        alert("Problem updating member")
                    })
            }


        } else {
            console.error("FORM INVALID - DISPLAY ERROR MESSAGE");
        }
    };
    const { formErrors } = state;
    const handleChange = e => {
        e.preventDefault();
        const { name, value } = e.target;
        let formErrors = { ...state.formErrors };

        switch (name) {
            case "firstName":
                formErrors.firstName =
                    value.length < 2 ? "The first name must contain at least 2 characters " : "";
                break;
            case "lastName":
                formErrors.lastName =
                    value.length < 2 ? "The last name must contain at least 2 characters" : "";
                break;
            case "id":

                formErrors.id =
                    isIsraeliIdValid(value) ? "" : "Invalid id number";
                break;
            case "phoneNumber":
                formErrors.phone = phoneReg.test(value) ? "" : "Invalid phone number"
                break;
            case "cellPhoneNumber":
                formErrors.cellPhone = cellPhoneReg.test(value) ? "" : "Invalid cell phone number"
                break;
            default:
                break;
        }

        setState({ ...state, [name]: value, formErrors }, () => console.log(state));
    }
    useEffect(function () {
        if (action.current !== 'add') {
            MemberService.getOne(memberId.current).then((response) => {
                //Convert dates to JavaScript Date objects
                response.data.dateOfBirth = new Date(response.data.dateOfBirth);
                response.data.recoveryDate = new Date(response.data.recoveryDate);
                response.data.positiveResultDate = new Date(response.data.positiveResultDate);
                setState({
                    ...response.data, formErrors: {
                        id: '',
                        firstName: '',
                        lastName: '',
                        address: '',
                        phone: '',
                        cellPhone: ''
                    }
                });
            }, (error) => {
                alert('Unable to retieve member from server');
                console.log(error);
            });
        }

    }, []);
    return (
        <div className="wrapper">
            <div className="form-wrapper">
                <h1>Member Details</h1>
                <Form id="reset-form" onSubmit={handleSubmit} noValidate
                    style={{ width: '70%', marginRight: 'auto', marginLeft: 'auto', textAlign: 'left' }}>
                    <fieldset disabled={action.current === 'view' ? 'disabled' : ''}>
                        <Form.Group >
                            <Form.Label htmlFor="id"> Id</Form.Label>
                            <Form.Control
                                value={state.id}
                                className={formErrors.id.length > 0 ? "error" : null}
                                type="text"
                                name="id"
                                noValidate
                                required
                                onChange={handleChange}
                            />
                            {formErrors.id.length > 0 && (
                                <Form.Text className="errorMessage">{formErrors.id}</Form.Text>
                            )}
                        </Form.Group>
                        <Form.Group className="firstName">
                            <Form.Label htmlFor="firstName"> First Name</Form.Label>
                            <Form.Control
                                className={formErrors.firstName.length > 0 ? "error" : null}
                                value={state.firstName}
                                type="text"
                                name="firstName"
                                noValidate
                                required
                                onChange={handleChange}
                            />
                            {formErrors.firstName.length > 0 && (
                                <Form.Text className="errorMessage">{formErrors.firstName}</Form.Text>
                            )}
                        </Form.Group>
                        <Form.Group className="lastName">
                            <Form.Label htmlFor="lastName">Last Name</Form.Label>
                            <Form.Control
                                className={formErrors.lastName.length > 0 ? "error" : null}
                                value={state.lastName}
                                type="text"
                                name="lastName"
                                noValidate
                                required
                                onChange={handleChange}
                            />
                            {formErrors.lastName.length > 0 && (
                                <Form.Text className="errorMessage">{formErrors.lastName}</Form.Text>
                            )}
                        </Form.Group>

                        <Form.Group className="address">
                            <Form.Label htmlFor="address" style={{ display: "block" }}>Address </Form.Label>
                            <Form.Control
                                className={formErrors.address.length > 0 ? "error" : null}
                                value={state.address}
                                type="text"
                                name="address"
                                noValidate
                                required
                                onChange={handleChange}
                            />
                            {formErrors.address.length > 0 && (
                                <Form.Text className="errorMessage">{formErrors.address}</Form.Text>
                            )}
                        </Form.Group>
                        <Form.Group className="dateOfBirth">
                            <Form.Label htmlFor="dateOfBirth">Date Of Birth</Form.Label>

                            <div >
                                <DateTimePicker name='dateOfBirth' maxDate={new Date()}
                                    format='dd/MM/yyyy' onChange={(value) => setState({ ...state, dateOfBirth: value })} value={state.dateOfBirth} />
                            </div>



                        </Form.Group>
                        <Form.Group className="phoneNumber">
                            <Form.Label htmlFor="phoneNumber">Phone Number</Form.Label>
                            <Form.Control
                                className={formErrors.phone.length > 0 ? "error" : null}
                                value={state.phoneNumber}
                                type="text"
                                name="phoneNumber"
                                noValidate
                                required
                                onChange={handleChange}
                            />
                            {formErrors.phone.length > 0 && (
                                <Form.Text className="errorMessage">{formErrors.phone}</Form.Text>
                            )}
                        </Form.Group>

                        <Form.Group className="cellPhoneNumber">
                            <Form.Label htmlFor="cellPhoneNumber">Cell Phone Number</Form.Label>
                            <Form.Control
                                className={formErrors.cellPhone.length > 0 ? "error" : null}
                                value={state.cellPhoneNumber}
                                type="text"
                                name="cellPhoneNumber"
                                noValidate
                                required
                                onChange={handleChange}
                            />
                            {formErrors.cellPhone.length > 0 && (
                                <Form.Text className="errorMessage">{formErrors.cellPhone}</Form.Text>
                            )}


                            <Form.Group className="positiveResultDate">
                                <Form.Label htmlFor="positiveResultDate">Positive Result Date </Form.Label>
                                <div >
                                    <DateTimePicker name='positiveResultDate' maxDate={state.recoveryDate} 
                                        format='dd/MM/yyyy' onChange={(value) => setState({ ...state, positiveResultDate: value })} value={state.positiveResultDate} />
                                </div>
                            </Form.Group>
                            <Form.Group className="recoveryDate">
                                <Form.Label htmlFor="recoveryDate">Recovery Date </Form.Label>
                                <div >
                                    <DateTimePicker name='recoveryDate' maxDate={new Date()}
                                        format='dd/MM/yyyy' onChange={(value) => setState({ ...state, recoveryDate: value })} value={state.recoveryDate} />
                                </div>
                            </Form.Group>
                        </Form.Group>
                        {action.current !== 'add' &&
                            <Form.Group style={{ width: '70%', textAlign: 'center', marginLeft: 'auto', marginRight: 'auto', marginTop: '5%' }}>
                                <Table striped bordered hover variant="light" >
                                    <thead>
                                        <tr>
                                            <th>Vaccination Date</th>
                                            <th>Vaccine Manufacturer</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {state.vaccinations.length === 0 &&
                                            <tr><td colSpan={2}>No Data</td></tr>
                                        }
                                        {state.vaccinations.map((vaccine, i) => {
                                            return (
                                                <tr key={i}>
                                                    <td>{vaccine.vaccinationDate}</td>
                                                    <td>{vaccine.manufacturer}</td>
                                                </tr>
                                            )
                                        })}
                                    </tbody>

                                </Table>
                                {state.vaccinations.length < 4 &&
                                    <Button variant="success" type="submit" size="lg" onClick={navigateToAddVaccine}>
                                        Add Vaccine
                                    </Button>
                                }

                            </Form.Group>
                        }
                   { action.current !== 'view' &&  <div className="d-grid gap-2" style={{ marginTop: '20px', marginBottom: '40px' }}>
                            <Button variant="success" type="submit" size="lg">
                                Submit
                            </Button>
                        </div>} 
                    </fieldset>
                </Form >
            </div>
        </div>






    )
}

export default Member