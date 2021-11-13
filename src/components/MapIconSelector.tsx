import * as React from "react";
import imStore from "../resource/store.png";
import imDelivery from "../resource/delivery.png";
import imUser from "../resource/user.png";
import clsx from "clsx";

export type IconType = "customer" | "driver" | "store";

type ItemProps = {
  isSelected: boolean;
  onClick: () => void;
  name: string;
  icon: any;
};

function IconItem({ icon, isSelected, name, onClick }: ItemProps) {
  return (
    <div
      className={clsx(
        "min-w-sm",
        "inline-flex flex-col items-center justify-center p-3 space-y-1 shadow-l",
        isSelected && "text-lime-600 shadow-lg rounded-lg"
      )}
      onClick={onClick}
    >
      <img src={icon} alt="user selection" className="w-10 h-10" />
      <p className="text-sm font-bold tracking-wider">{name}</p>
    </div>
  );
}

type MapIconSelectorProps = {
  selected: IconType;
  setSelected: (type: IconType) => void;
};

function MapIconSelector({ setSelected, selected }: MapIconSelectorProps) {
  return (
    <div className="flex items-center justify-center my-4">
      <div className="inline-block px-6 py-3 mx-auto space-x-3 bg-white divide-x rounded-lg shadow-md">
        <IconItem
          icon={imUser}
          isSelected={selected === "customer"}
          name="Customer"
          onClick={() => setSelected("customer")}
        />
        <IconItem
          icon={imStore}
          isSelected={selected === "store"}
          name="Store"
          onClick={() => setSelected("store")}
        />
        <IconItem
          icon={imDelivery}
          isSelected={selected === "driver"}
          name="Driver"
          onClick={() => setSelected("driver")}
        />
      </div>
    </div>
  );
}
export default MapIconSelector;
