import React, { useEffect, useState } from 'react';
import { Form } from 'react-bootstrap';
import MemberService from '../services/MemberService';
import { LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

const CovidInfo = () => {
    const [unvaccinatedCount, setUnvaccinatedCount] = useState(0);
    const [sickMembersData, setSickMembersData] = useState([]);
    useEffect(function () {
        MemberService.getUnvaccinatedMembersCount().then((response) => {
            setUnvaccinatedCount(response.data);
        }, (error) => {
            alert('Unable to retieve data from server');
            console.log(error);
        });
        MemberService.getSickMembersForMonth().then((response) => {
            setSickMembersData(response.data);
        }, (error) => {
            alert('Unable to retieve data from server');
            console.log(error);
        });
    }, []);

    return (
        <div>
            <h3>Sick Members in Last Month</h3>
            <ResponsiveContainer width="95%" height={300}>
                <LineChart data={sickMembersData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                    <Line type="monotone" dataKey="sick members" stroke="#8884d8" />
                    <CartesianGrid stroke="#ccc" strokeDasharray="5 5" />
                    <XAxis dataKey="name" />
                    <YAxis allowDecimals={false} />
                    <Tooltip />
                </LineChart>
            </ResponsiveContainer>
            <h3>Unvaccinated Members</h3>
            <Form.Control type="text"
                style={{ width: '20%', textAlign: 'center', marginLeft: 'auto', marginRight: 'auto' }}
                value={unvaccinatedCount} disabled></Form.Control>
        </div>
    )
}

export default CovidInfo