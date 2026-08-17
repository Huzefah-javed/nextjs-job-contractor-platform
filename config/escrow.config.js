import axios from "axios";

export const escrowApi = axios.create({
  baseURL: "https://api.escrow-sandbox.com/2017-09-01",
  auth: {
    username: process.env.ESCROW_USERNAME,
    password: process.env.ESCROW_PASSWORD,
  },
});
