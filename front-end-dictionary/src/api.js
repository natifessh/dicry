import axios from 'axios'

const url="loca"
export const api=axios.create({
    baseURL:"http://localhost:8080",
    headers:{
        "Content-Type":"application/json"
    }
})