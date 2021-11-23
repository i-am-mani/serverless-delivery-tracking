import { LatLng, Product, StoreItem } from "../types";
import { API, AxiosInstance } from "./ApiEndpoints";

// function to generate random short id
function makeid(length: number) {
  var result = "";
  var characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  var charactersLength = characters.length;
  for (var i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}

type OrderItem = {
  product: Product;
  qty: number;
};
export async function createOrder(
  customerId: string,
  storeId: string,
  items: OrderItem[],
  path: string
) {
  try {
    const order = {
      id: makeid(5),
      customerId,
      storeId,
      driverId: null, // populated on order acceptance
      path,
      items,
      currentLocation: null, // will be updated when driver accepts the Order
      deliveryStatus: "pending",
    };

    const notification = {
      id: makeid(5),
      storeId, // FROM
      customerId, // TO
      orderId: order.id, // ORDER
      creationTime: new Date().toISOString(),
    };

    const body = {
      order,
      notification,
    };

    const response = await AxiosInstance.post(API.Orders, body);
    console.log(response);
    return response.data;
  } catch (e) {
    console.log(e);
    return Promise.reject(e);
  }
}

export async function driverAcceptOrder(
  orderId: string,
  driverId: string,
  notificationId: string,
  driverLocation: LatLng
) {
  try {
    const body = {
      orderId,
      driverId,
      notificationId,
      driverLocation,
    };
    const response = await AxiosInstance.post(API.AcceptOrder, body);
    return response.data;
  } catch (error) {
    return Promise.reject(error);
  }
}

export async function getOrderWithIds(ids: string[]) {
  try {
    const promises = ids.map((id) => AxiosInstance.get(API.Order(id)));
    const response = await Promise.all(promises);
    const isSuccess = response.every((r) => r.status === 200);
    return isSuccess ? response.map((res) => res.data) : null;
  } catch (e) {
    console.log(e);
    return Promise.reject(e);
  }
}

export async function updateOrderLocation(location: LatLng, orderId: string) {
  try {
    const body = {
      orderId,
      location,
    };
    const response = await AxiosInstance.put(API.Orders, body);
    return response.data;
  } catch (error) {
    return Promise.reject(error);
  }
}
