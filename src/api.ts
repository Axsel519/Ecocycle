import axios from "axios";

// المنفذ 3000 أو نفس منفذ الباك إند لديك
const API = axios.create({
  baseURL: "http://localhost:3000",
  headers: {
    "Content-Type": "application/json",
  },
});

export default API;
