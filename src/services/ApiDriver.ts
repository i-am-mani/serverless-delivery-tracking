import { DriverNotification, LatLng } from "../types";
import { API, AxiosInstance } from "./ApiEndpoints";

export async function createDriver(name: string, location: LatLng) {
  try {
    const body = {
      id: name,
      location,
    };
    const response = await AxiosInstance.post(API.Drivers, body, {
      headers: {
        "Access-Control-Allow-Origin": "*",
      },
    });
    return response.status === 200 ? Promise.resolve() : Promise.reject();
  } catch (e) {
    console.log(e);

    return Promise.reject();
  }
}

export async function getDriver(id: string) {
  try {
    const response = await AxiosInstance.get(API.Driver(id));
    console.log(response);

    return response.status === 200
      ? Promise.resolve(response.data.Item)
      : Promise.reject;
  } catch (e) {
    console.log(e);

    return Promise.reject();
  }
}

export async function updateDriverLocation(location: LatLng, driverId: string) {
  try {
    const body = {
      driverId,
      location,
    };
    const response = await AxiosInstance.put(API.Driver(driverId), body);
    return response.data;
  } catch (error) {
    return Promise.reject(error);
  }
}

export async function markOrderDelivered(driverId: string, orderId: string) {
  try {
    const body = {
      driverId,
      orderId,
    };
    const response = await AxiosInstance.post(API.DeliverOrder, body);
    return response.data;
  } catch (error) {
    return Promise.reject(error);
  }
}
