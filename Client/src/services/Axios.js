import axios from 'axios';
const instance = axios.create({baseURL: 'https://localhost:7095/api'});
export default instance