import React from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import ViewMembers from './ViewMembers';
import { Routes, Route } from 'react-router-dom';
import Member from './Member';
import AddVaccine from './AddVaccine';
import CovidInfo from './CovidInfo';



const Home = () => {
    return (
        <div>
            <p style={{
                fontSize: 'xx-large', marginLeft: '4%', textShadow: '2px 2px 5px green',
                fontWeight: 'bold'
            }}>Welcome to The COVID-19 Information Management System</p>

            <Routes>
                <Route path="/" element={<ViewMembers />} />
                <Route path="/member" element={<Member />} />
                <Route path="/addVaccine" element={<AddVaccine />} />
            <Route path="/covidInfo" element={<CovidInfo />} />


            </Routes>
        </div>
    )
}

export default Home