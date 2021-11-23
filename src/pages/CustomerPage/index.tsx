import { faCarAlt } from "@fortawesome/free-solid-svg-icons";
import { useLoadScript } from "@react-google-maps/api";
import clsx from "clsx";
import * as React from "react";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import UnstyledButton from "../../components/UnstyledButton";
import { getCustomer } from "../../services/ApiCustomers";
import { createOrder, getOrderWithIds } from "../../services/ApiOrders";
import { getAllStores } from "../../services/ApiStores";
import { useStoreListener } from "../../services/WSStoreListener";
import {
  Customer,
  mapsAPIKEY,
  Order,
  Product,
  Store,
  StoreItem,
} from "../../types";
import { QuantityPicker } from "../StorePage";
import CustomerMapView from "./CustomerMapView";

type CartProps = {
  store: Store | undefined | null;
  customer: Customer | undefined;
};

type CartItem = {
  product: Product;
  stock: number;
  qty: number;
};

const libraries: any[] = ["directions"];
function CustomerCart({ store, customer }: CartProps) {
  const [productsQty, setProductsQty] = React.useState<CartItem[]>([]);
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: mapsAPIKEY,
    libraries,
  });

  React.useEffect(() => {
    if (store) {
      const qtys = store.products.map((si) => ({
        product: si.product,
        stock: si.stock,
        qty: 0,
      }));
      setProductsQty(qtys);
    }
  }, [store]);

  const onDecrement = (storeItem: StoreItem) => {
    const copy = [...productsQty];
    const existingSI = copy.find(
      (si) => si.product.id === storeItem.product.id
    );
    if (existingSI && existingSI.qty > 0) {
      existingSI.qty -= 1;
      setProductsQty(copy);
    }
  };

  const onIncrement = (storeItem: StoreItem) => {
    const copy = [...productsQty];
    const existingSI = copy.find(
      (si) => si.product.id === storeItem.product.id
    );

    if (existingSI && existingSI.qty < existingSI.stock) {
      existingSI.qty += 1;
      setProductsQty(copy);
      console.log("incremented");
    }
  };

  const onSubmit = async () => {
    if (isLoaded) {
      if (customer && store) {
        const custId = customer.id;
        const storeId = store.id;
        const customerLocation = customer.location;
        const storeLocation = store.location;
        const items = productsQty.map((si) => ({
          product: si.product,
          qty: si.qty,
        }));
        const directionsService = new google.maps.DirectionsService();

        directionsService
          .route({
            destination: {
              lng: customerLocation.lng,
              lat: customerLocation.lat,
            },
            origin: {
              lng: storeLocation.lng,
              lat: storeLocation.lat,
            },
            travelMode: google.maps.TravelMode.DRIVING,
          })
          .then((response) => {
            console.log("Google maps Direction");
            console.log(response);
            const path = response.routes[0].overview_polyline;
            createOrder(custId, storeId, items, path);
          })
          .catch((e) => {
            console.log(e);

            window.alert("Directions request failed due to ");
          });
      }
    } else {
      toast.error("Hold on! map API hasn't loaded yet!");
    }
  };

  return (
    <div>
      <div className="my-4 divide-y">
        {productsQty &&
          productsQty.map((storeItem, idx) => (
            <div className="flex p-2 mx-2" key={idx}>
              <div className="flex-1">
                <p className="font-bold">
                  {storeItem.product.id} - ({storeItem.stock})
                </p>
                <p className="text-xs">₹{storeItem.product.price}</p>
              </div>
              <div>
                <QuantityPicker
                  count={storeItem.qty}
                  decrement={() => onDecrement(storeItem)}
                  increment={() => {
                    onIncrement(storeItem);
                  }}
                />
              </div>
            </div>
          ))}

        <button
          className={clsx(
            "w-full py-4 font-bold rounded-b-lg",
            "bg-gradient-to-r from-green-400 to-emerald-400"
          )}
          onClick={onSubmit}
        >
          Place Order
        </button>
      </div>
    </div>
  );
}

function CustomerPage() {
  const param = useParams();
  const customerId = param.customer_id;
  const [customer, setCustomer] = React.useState<Customer>();
  const [customerOrders, setCustomerOrders] = React.useState<Order[]>();
  const [allStores, setAllStores] = React.useState<Store[]>();
  const [selectedStore, setSelectedStore] = React.useState<Store>();
  const [store] = useStoreListener(selectedStore?.id);
  const [selectedOrder, setSelectedOrder] = React.useState<Order>();

  React.useEffect(() => {
    getAllStores().then((res) => {
      setAllStores(res);
    });
  }, []);

  // React.useEffect(() => {
  //   console.log("Select Store: ");

  //   console.log(selectedStore);
  // }, [selectedStore]);

  React.useEffect(() => {
    if (customerId != null && customer == null) {
      getCustomer(customerId).then(async (cust) => {
        setCustomer(cust);

        const orderIds = cust.orderIds;
        if (orderIds && orderIds.length > 0) {
          const response = (await getOrderWithIds(orderIds)) as Order[];
          if (response != null) {
            setCustomerOrders(response);
          }
        }
      });
    }
  }, [customer, customerId]);

  console.log({ source: "Customer Index", store: store });

  return (
    <div>
      <p className="my-4 font-bold text-center">
        Customer Page {`${customer && " | " + customer.id}`}
      </p>

      <CustomerMapView
        order={selectedOrder}
        customerLocation={customer?.location}
      />

      <div className="flex w-4/6 mx-auto space-x-4">
        <div className="flex-1 p-4 bg-white rounded-lg shadow-lg min-h-md">
          <div className="flex justify-between px-4">
            <p className="mt-2 font-bold tracking-wider">Store</p>
            <select
              onChange={(event) => {
                if (
                  allStores != null &&
                  event.target.value != null &&
                  event.target.value.length > 0
                ) {
                  setSelectedStore(
                    allStores.find((store) => store.id === event.target.value)
                  );
                }
              }}
            >
              <option value="">Select</option>
              {allStores &&
                allStores.length > 0 &&
                allStores.map((store) => (
                  <option value={store.id}>{store.id}</option>
                ))}
            </select>
          </div>
          <CustomerCart store={store} customer={customer} />
        </div>

        <div className="flex-1 p-4 bg-white rounded-lg shadow-lg min-h-md">
          <p className="mt-2 font-bold tracking-wider">Customer Orders</p>
          {customer == null ||
          (customer.orderIds != null && customer.orderIds.length === 0) ? (
            <p className="mx-auto text-xl font-bold text-center opacity-40 my-14">
              No Orders Found
            </p>
          ) : (
            <div>
              {customerOrders &&
                customerOrders.map((order) => (
                  <div
                    className="w-full px-4 py-2 border rounded-lg"
                    key={order.id}
                  >
                    <div className="flex">
                      <div className="flex-1 space-y-3">
                        <p className="text-xs font-bold">Order Id</p>
                        <p>{order.id}</p>
                      </div>
                      <div className="flex-1 space-y-3">
                        <p className="text-xs font-bold">Store Id</p>
                        <p>{order.storeId}</p>
                      </div>
                      <div className="flex-1 space-y-3">
                        <p className="text-xs font-bold">Customer Id</p>
                        <p>{order.customerId}</p>
                      </div>
                    </div>
                    {order.deliveryStatus === "pending" && (
                      <UnstyledButton
                        icon={faCarAlt}
                        placeholder="Track Order"
                        onClick={() => {
                          setSelectedOrder(order);
                        }}
                        className="w-full mt-2"
                      />
                    )}
                  </div>
                ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default CustomerPage;
