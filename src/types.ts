export const mapsAPIKEY = "AIzaSyDQlNpE52LPHxZXconi-Mog0oxs_q9F0_o";

export type LatLng = {
  lat: number;
  lng: number;
};

export type Customer = {
  id: string;
  orderIds: string[];
  location: LatLng;
};

export type Product = {
  id: string;
  price: number;
};

export type StoreItem = {
  product: Product;
  stock: number;
};

export type Store = {
  id: string;
  products: StoreItem[];
  location: LatLng;
};

export type Driver = {
  id: string;
  currentLocation: LatLng;
  activeOrderId: string | null;
  orderIds: string[];
};

export type OrderItem = {
  product: Product;
  quantity: number;
};

export type Order = {
  id: string;
  driverId: string;
  customerId: string;
  storeId: string;
  path: any;
  items: OrderItem[];
  currentLocation: LatLng;
  deliveryStatus: "pending" | "delivered";
};

export type DriverNotification = {
  id: string;
  storeId: string;
  customerId: string;
  orderId: string;
  creationTime: string;
};
