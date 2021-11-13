import axios from "axios";
import { LatLng } from "../types";

const AxiosInstance = axios.create({
  baseURL: "https://jjwb0esgdb.execute-api.ap-south-1.amazonaws.com",
  headers: {
    "Access-Control-Allow-Origin": "*",
  },
});

export namespace API {
  export const Stores = "/stores";
  export const Store = (id: string) => `${Stores}/${id}`;
  export const Customers = `/customers`;
  export const Customer = (id: string) => `${Customers}/${id}`;
}

export async function getAllCustomers() {
  try {
    const response = await AxiosInstance.get(API.Customers);
    console.log(response);

    if (response.status === 200) {
      const body = response.data;
      const items = body.Items;
      return items;
    } else {
      return Promise.reject();
    }
  } catch (e) {
    return Promise.reject();
  }
}

export async function createCustomer(name: string, location: LatLng) {
  try {
    const body = {
      id: name,
      location,
    };
    const response = await AxiosInstance.post(API.Customers, body, {
      headers: {
        "Access-Control-Allow-Origin": "*",
      },
    });
    return response.status === 200 ? Promise.resolve : Promise.reject;
  } catch (e) {
    console.log(e);

    return Promise.reject();
  }
}

export async function deleteCustomer(customerId: string) {
  try {
    const response = await AxiosInstance.delete(API.Customer(customerId));
    return response.status === 200 ? Promise.resolve : Promise.reject;
  } catch (e) {
    return Promise.reject();
  }
}
