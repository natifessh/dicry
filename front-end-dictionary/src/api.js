import axios from 'axios'

const url="loca"
export const api=axios.create({
    baseURL:"https://dicry.onrender.com",
    headers:{
        "Content-Type":"application/json"
    }
})