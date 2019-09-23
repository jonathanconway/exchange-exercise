import axios from "axios";

import { PocketMap } from "./Exchange.types";

interface Response<T> {
  readonly data: T;
}


interface GetRatesData {
  readonly timestamp: number;
  readonly base: string;
  readonly rates: {
    [key: string]: number
  };
}


const OPEN_EXCHANGE_RATES_BASE_URI = "https://openexchangerates.org/api";

const getRates = async () => {
  // const uri = `${OPEN_EXCHANGE_RATES_BASE_URI}/latest.json?app_id=${process.env.REACT_APP_OPEN_EXCHANGE_RATES_APP_ID}`;
  const uri = "http://localhost:3000/data/get-rates-response.json";
  const response = (await axios.get(uri) as Response<GetRatesData>).data;

  return response;
};


const getPockets = async () => {
  const uri = `http://localhost:3000/data/get-pockets-response.json`;
  const response = (await axios.get(uri) as Response<PocketMap>).data;

  return response;
};


const http = { getRates, getPockets };

export default http;