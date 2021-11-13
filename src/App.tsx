import React from "react";
import logo from "./logo.svg";
import "./App.css";
import UniversalMap, { MapMarker } from "./components/UniversalMap";
import { Customer } from "./types";
import {
  createCustomer,
  deleteCustomer,
  getAllCustomers,
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

function App() {
  const [customers, setCustomers] = React.useState<Customer[]>([]);
  const [markers, setMarkers] = React.useState<MapMarker[]>([]);

  React.useEffect(() => {
    getAllCustomers().then((res) => {
      setCustomers(res);
      setMarkers(res.map(customerTMarker));
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
      setCustomers([
        ...customers,
        { id, location: { lat, lng }, orderIds: [] },
      ]);
      toast.success("Customer Created");
    });
  };

  const onDeleteMarker = (marker: MapMarker) => {
    if (marker.type === "customer") {
      deleteCustomer(marker.id).then(() => {
        setMarkers(markers.filter((m) => m.id !== marker.id));
        setCustomers(customers.filter((c) => c.id !== marker.id));
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
          markers={markers}
          deleteMarker={onDeleteMarker}
        />
      </div>
    </div>
  );
}

export default App;
