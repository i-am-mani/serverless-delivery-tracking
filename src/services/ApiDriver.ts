import { LatLng } from "../types";
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
    return response.status === 200 ? Promise.resolve : Promise.reject;
  } catch (e) {
    console.log(e);

    return Promise.reject();
  }
}
