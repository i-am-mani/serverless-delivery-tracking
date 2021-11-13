import React from "react";
import "./App.css";
import UniversalMap, { MapMarker } from "./components/UniversalMap";
import { Customer } from "./types";
import {
  createCustomer,
  createDriver,
  createStore,
  deleteCustomer,
  getAllEntities,
} from "./services/ApiEndpoints";
import imStore from "./resource/store.png";
import imDelivery from "./resource/delivery.png";
import imUser from "./resource/user.png";
import { toast } from "react-toastify";

const customerTMarker = (customer: Customer) => {
  return {
    id: customer.id,
    lat: customer.location.lat,
    lng: customer.location.lng,
    type: "customer",
    icon: imUser,
  };
};

const storeTMarker = (customer: Customer) => {
  return {
    id: customer.id,
    lat: customer.location.lat,
    lng: customer.location.lng,
    type: "store",
    icon: imStore,
  };
};

const deliveryTMarker = (customer: Customer) => {
  return {
    id: customer.id,
    lat: customer.location.lat,
    lng: customer.location.lng,
    type: "driver",
    icon: imDelivery,
  };
};

function App() {
  const [markers, setMarkers] = React.useState<MapMarker[]>([]);

  React.useEffect(() => {
    getAllEntities().then((res) => {
      const cMarkers = res.customers.map(customerTMarker);
      const sMarkers = res.stores.map(storeTMarker);
      const dMarkers = res.drivers.map(deliveryTMarker);
      setMarkers([...cMarkers, ...sMarkers, ...dMarkers]);
    });
  }, []);

  const onAddCustomer = (id: string, lat: number, lng: number) => {
    const marker: MapMarker = {
      id: id,
      lat: lat,
      lng: lng,
      type: "customer",
      icon: imUser,
    };

    createCustomer(id, {
      lat: lat,
      lng: lng,
    }).then(() => {
      const copy = [...markers];
      copy.push(marker);
      setMarkers(copy);
      toast.success("Customer Created");
    });
  };

  const onAddDriver = (id: string, lat: number, lng: number) => {
    const marker: MapMarker = {
      id: id,
      lat: lat,
      lng: lng,
      type: "driver",
      icon: imDelivery,
    };

    createDriver(id, {
      lat: lat,
      lng: lng,
    }).then(() => {
      const copy = [...markers];
      copy.push(marker);
      setMarkers(copy);
      toast.success("Driver Created");
    });
  };

  const onAddStore = (id: string, lat: number, lng: number) => {
    const marker: MapMarker = {
      id: id,
      lat: lat,
      lng: lng,
      type: "store",
      icon: imStore,
    };

    createStore(id, {
      lat: lat,
      lng: lng,
    }).then(() => {
      const copy = [...markers];
      copy.push(marker);
      setMarkers(copy);
      toast.success("Store Created");
    });
  };

  const onDeleteMarker = (marker: MapMarker) => {
    if (marker.type === "customer") {
      deleteCustomer(marker.id).then(() => {
        setMarkers(markers.filter((m) => m.id !== marker.id));
      });
    }
  };

  return (
    <div className="w-full min-h-screen overflow-hidden bg-white">
      <header className="App-header"></header>
      <p className="m-3 text-lg font-bold text-center">
        Delivery Route Optimisation
      </p>
      <div className="w-full">
        <UniversalMap
          addCustomer={onAddCustomer}
          addDriver={onAddDriver}
          addStore={onAddStore}
          markers={markers}
          deleteMarker={onDeleteMarker}
        />
      </div>
    </div>
  );
}

export default App;
