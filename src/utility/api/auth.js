import axios from 'axios';

const apiUrl = 'http://localhost:5000/api';

export async function authRequest(username, password) {
    try {
        const response = await axios.post(`${apiUrl}/auth/`, { username, password });
        return response;
    } catch (error) {
        throw error;
    }
}