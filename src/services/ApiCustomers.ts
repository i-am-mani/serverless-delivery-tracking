import { LatLng } from "../types";
import { API, AxiosInstance } from "./ApiEndpoints";

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

export async function getCustomer(id: string) {
  try {
    const response = await AxiosInstance.get(API.Customer(id));
    return response.status === 200
      ? Promise.resolve(response.data.Item)
      : Promise.reject;
  } catch (e) {
    console.log(e);

    return Promise.reject();
  }
}
