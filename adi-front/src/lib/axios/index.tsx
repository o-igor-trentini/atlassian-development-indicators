import Axios from 'axios';

export const backendApi = Axios.create({
    baseURL: process.env.NEXT_PUBLIC_BACK_API_URL,
    withCredentials: false,
});
