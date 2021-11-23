import axios from "axios";
export * from "./ApiStores";
export * from "./ApiCustomers";
export * from "./ApiDriver";

export const AxiosInstance = axios.create({
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

  export const Products = `/products`;
  export const Product = (id: string) => `${Products}/${id}`;

  export const Drivers = `/drivers`;
  export const Driver = (id: string) => `${Drivers}/${id}`;

  export const Orders = `/orders`;
  export const Order = (id: string) => `${Orders}/${id}`;

  export const AcceptOrder = "/drivers/accept-order";
  export const DeliverOrder = "/drivers/order-delivered";
}

export async function getAllEntities() {
  try {
    const cResponse = AxiosInstance.get(API.Customers);
    const sReponse = AxiosInstance.get(API.Stores);
    const dResponse = AxiosInstance.get(API.Drivers);

    const resPromise = await Promise.all([cResponse, sReponse, dResponse]);
    const isSuccess = resPromise.every((res) => res.status === 200);

    if (isSuccess) {
      const result = {
        customers: resPromise[0].data.Items,
        stores: resPromise[1].data.Items,
        drivers: resPromise[2].data.Items,
      };
      console.log(result);

      return result;
    } else {
      return Promise.reject();
    }
  } catch (e) {
    return Promise.reject();
  }
}
