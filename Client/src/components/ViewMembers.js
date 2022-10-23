import React, { useState, useEffect } from 'react'
import { Button, Table } from 'react-bootstrap'
import MemberService from '../services/MemberService';
import { FaUserEdit, FaTrash, FaEye } from "react-icons/fa";
import { Routes, Route, useNavigate } from 'react-router-dom';
import Member from './Member';
import CovidInfo from './CovidInfo';


const ViewMembers = () => {
    const [members, setMembers] = useState([]);

    const navigate = useNavigate();
    const navigateToMember = (action, id) => {
        navigate('/member', { state: { action: action, id: id } })
    };
    const navigateToCovidInfo = () => {
        navigate('/covidInfo');
    };
    useEffect(function () {
        console.log('get members');
        MemberService.getAll().then((response) => {
            setMembers(response.data);
        }, (error) => {
            alert('Unable to retieve members from server');
            console.log(error);
        });
    }, []);

    const deleteMember = (id) => {
        if (window.confirm('Are you sure you want to delete?')) {
            MemberService.delete(id).then((response) => {
                debugger;
                if (response.status === 200) {
                    setMembers(members.filter(member => member.id !== id));
                }
            }, (error) => { console.log(error); });
        }
    };

    return (
        <div>
            <div>
                <Button variant='success' onClick={() => navigateToMember('add')}>Add a Member</Button>
            </div>
            <Table striped bordered hover variant="dark" style={{ width: '70%', textAlign: 'center', marginLeft: 'auto', marginRight: 'auto', marginTop: '1%' }}>
                <thead>
                    <tr>
                        <th>Id</th>
                        <th>First Name</th>
                        <th>Last Name</th>
                        <th>Address</th>
                        <th>Birth Date</th>
                        <th>Phone</th>
                        <th>Cellphone</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    {members.map((member) => {
                        return (
                            <tr key={member.id}>
                                <td>{member.id}</td>
                                <td>{member.firstName}</td>
                                <td>{member.lastName}</td>
                                <td>{member.address}</td>
                                <td>{member.dateOfBirth}</td>
                                <td>{member.phoneNumber}</td>
                                <td>{member.cellPhoneNumber}</td>
                                <td>
                                    <Button style={{ marginRight: '5px' }} variant='success' onClick={() => navigateToMember('update', member.id)}><FaUserEdit /></Button>
                                    <Button style={{ marginRight: '5px' }} variant='success' onClick={() => deleteMember(member.id)}><FaTrash /></Button>
                                    <Button style={{ marginRight: '5px' }} variant='success' onClick={() => navigateToMember('view', member.id)}><FaEye /></Button>
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </Table>
            <div>
                <Button variant='success' onClick={navigateToCovidInfo}>View Covid-19 information</Button>
            </div>

            <Routes>
                <Route path="/covidInfo" element={<CovidInfo />} />
                <Route path="/member" element={<Member />} />
            </Routes>

        </div>
    )
}

export default ViewMembers