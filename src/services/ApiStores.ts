import { LatLng, Store } from "../types";
import { API, AxiosInstance } from "./ApiEndpoints";

export async function getAllStores() {
  try {
    const response = await AxiosInstance.get(API.Stores);

    if (response.status === 200) {
      const body = response.data;
      const items = body.Items;
      console.log(response);

      return items;
    } else {
      return Promise.reject();
    }
  } catch (e) {
    return Promise.reject();
  }
}

export async function createStore(name: string, location: LatLng) {
  try {
    const body = {
      id: name,
      location,
    };
    const response = await AxiosInstance.post(API.Stores, body, {
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

export async function getStore(id: string) {
  try {
    const response = await AxiosInstance.get(API.Store(id));
    console.log(response);

    if (response.status === 200) {
      const body = response.data;
      const item = body.Item;
      const store: Store = {
        id: item.id,
        location: item.location,
        products: item.products ? item.products : [],
      };
      return store;
    } else {
      return Promise.reject();
    }
  } catch (e) {
    return Promise.reject();
  }
}

export async function deleteStore(customerId: string) {
  try {
    const response = await AxiosInstance.delete(API.Store(customerId));
    return response.status === 200 ? Promise.resolve : Promise.reject;
  } catch (e) {
    return Promise.reject();
  }
}

export async function fetchAllProducts() {
  try {
    const response = await AxiosInstance.get(API.Products);

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

export async function updateStoreProducts(store: Store) {
  try {
    const response = await AxiosInstance.put(API.Store(store.id), store);
    return response.status === 200 ? Promise.resolve : Promise.reject;
  } catch (e) {
    return Promise.reject();
  }
}
