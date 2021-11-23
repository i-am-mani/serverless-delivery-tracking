import {
  faMinusCircle,
  faPlusCircle,
  faSync,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import clsx from "clsx";
import * as React from "react";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import HistoryBackButton from "../components/BackButton";
import {
  fetchAllProducts,
  getStore,
  updateStoreProducts,
} from "../services/ApiStores";
import { Product, Store, StoreItem } from "../types";

type Props = {
  count: number;
  decrement: () => void;
  increment: () => void;
};

export function QuantityPicker({ count, decrement, increment }: Props) {
  return (
    <div className="flex space-x-1">
      <button onClick={decrement}>
        <FontAwesomeIcon icon={faMinusCircle} />
      </button>
      <p className="px-2 py-1 border rounded-lg">{count}</p>
      <button onClick={increment}>
        <FontAwesomeIcon icon={faPlusCircle} />
      </button>
    </div>
  );
}

function StorePage() {
  const params = useParams();
  const storeId = params.store_id;
  const [store, setStore] = React.useState<Store>();

  React.useEffect(() => {
    if (storeId != null && store == null) {
      getStore(storeId).then((store) => {
        setStore(store);
      });
    }
  }, [store, storeId]);

  const syncProducts = async () => {
    if (store) {
      const allProduct = (await fetchAllProducts()) as Product[];
      const storeProducts = store?.products || [];
      const newProducts: StoreItem[] = allProduct
        .filter((product) => {
          return (
            storeProducts.find(
              (storeProduct) => storeProduct.product.id === product.id
            ) == null
          );
        })
        .map((product) => ({
          product,
          stock: 0,
        }));

      if (newProducts.length > 0) {
        const newStoreItems = [...storeProducts, ...newProducts];
        setStore({ ...store, products: newStoreItems });
      }
    } else {
      toast.info("Try again...");
    }
  };

  const updateStore = async () => {
    if (store) {
      const pr = updateStoreProducts(store);
      toast.promise(pr, {
        success: "Store Products Updated Successfully",
        error: "Error updating store products",
        pending: "Updating...",
      });
    }
  };

  return (
    <div className="relative w-full h-screen">
      <div className="absolute top-4 left-4">
        <HistoryBackButton />
      </div>
      <p className="my-4 text-center">{store && store.id}</p>
      <div className="mx-auto rounded-lg shadow-lg w-80 min-h-md">
        <div className="flex border-b-2">
          <p className="flex-1 p-4 font-bold">Products Stock</p>
          <button className="px-5" onClick={syncProducts}>
            <FontAwesomeIcon icon={faSync} />
          </button>
        </div>

        <div className="my-4 divide-y">
          {store &&
            store.products.map((storeItem) => (
              <div className="flex p-2 mx-2">
                <div className="flex-1">
                  <p className="font-bold">{storeItem.product.id}</p>
                  <p className="text-xs">₹{storeItem.product.price}</p>
                </div>
                <div>
                  <QuantityPicker
                    count={storeItem.stock}
                    decrement={() => {
                      setStore({
                        ...store,
                        products: store.products.map((si) => {
                          if (si.product.id === storeItem.product.id) {
                            return {
                              ...si,
                              stock: si.stock - 1,
                            };
                          }
                          return si;
                        }),
                      });
                    }}
                    increment={() => {
                      setStore({
                        ...store,
                        products: store.products.map((si) => {
                          if (si.product.id === storeItem.product.id) {
                            return {
                              ...si,
                              stock: si.stock + 1,
                            };
                          }
                          return si;
                        }),
                      });
                    }}
                  />
                </div>
              </div>
            ))}
        </div>

        <button
          className={clsx(
            "w-full py-4 font-bold rounded-b-lg",
            "bg-gradient-to-r from-green-400 to-emerald-400"
          )}
          onClick={updateStore}
        >
          Update
        </button>
      </div>
    </div>
  );
}

export default StorePage;
