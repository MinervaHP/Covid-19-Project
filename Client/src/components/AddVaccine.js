import Form from 'react-bootstrap/Form';
import React from 'react';
import { useState } from 'react';
import DateTimePicker from 'react-datetime-picker';
import { Button } from 'react-bootstrap';
import { useLocation } from 'react-router-dom';
import MemberService from '../services/MemberService';

const AddVaccine = () => {
  const [state, setState] = useState({
    vaccinationDate: new Date(),
    manufacturer: null
  });
  const location = useLocation();

  const handleSubmit = e => {
    e.preventDefault();
    console.log(location.state.id);
    MemberService.addVaccine(location.state.id, state).then((response) => {
      if (response.status === 200) {
        alert("Vaccination added successfully");
        document.getElementById("reset-form").reset();
      }
    },
      (error) => {
        alert('An error has occurred while processing request');
      });
  };
  return (
    <Form style={{ width: '40%', textAlign: 'center', marginLeft: 'auto', marginRight: 'auto', marginTop: '5%', border: '1px solid black',borderRadius:'10%' }}
      onSubmit={handleSubmit}>
      <Form.Group className="mb-3" >
        <h1>Add Vaccine</h1>
        <Form.Label>Vaccination Date</Form.Label>

        <div >
          <DateTimePicker maxDate={new Date()} format='dd/MM/yyyy'
            onChange={(value) => setState({ ...state, vaccinationDate: value })} value={state.vaccinationDate} />
        </div>
        <Form.Group className="mb-3" style={{ width: '56%', textAlign: 'center', marginLeft: 'auto', marginRight: 'auto' }}>
          <Form.Label >Manufacturer</Form.Label>
          <Form.Select name='manufacturer' onChange={(e) => setState({ ...state, manufacturer: e.target.value })}>
            <option>Moderna</option>
            <option>Pfizer</option>
            <option>Astra Zeneca</option>
            <option>Novavax</option>
            <option>Sputnik</option>
            <option>Johnson And Johnson</option>
            <option>Serum Institute Of India</option>
            <option>Sinopharm</option>
            <option> Sinawak</option>
            <option>Bharat Biotech</option>
          </Form.Select>
        </Form.Group>

      </Form.Group>
      <div className="d-grid gap-2" style={{ marginTop: '20px', width: '50%', marginLeft: 'auto', marginRight: 'auto' }}>
        <Button variant="success" type="submit" size="lg">
          Add
        </Button>
      </div>
    </Form>

  )
}

export default AddVaccine