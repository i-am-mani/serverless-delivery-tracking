import {
  faCaretSquareDown,
  faLocationArrow,
  faTimesCircle,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import clsx from "clsx";
import * as React from "react";
import { LatLng } from "../types";
import { MapMarker } from "./UniversalMap";
import UnstyledButton from "./UnstyledButton";

type Props = {
  panToLocation: (location: LatLng) => void;
  markers: MapMarker[];
  onDelete: (marker: MapMarker) => void;
};

export function EntitiesSection({ panToLocation, markers, onDelete }: Props) {
  console.log(markers);

  return (
    <div className={clsx("w-3/4 mx-auto rounded-lg shadow-md", "bg-white")}>
      <div className="grid grid-cols-3">
        <div className="min-h-sm">
          <p
            className={clsx(
              "px-6 py-3 font-bold text-center",
              "bg-gradient-to-r from-purple-400 to-yellow-400",
              "bg-clip-text text-transparent"
            )}
          >
            Customers
          </p>

          {markers.map((marker) => (
            <div className="relative flex w-full px-6 py-2 m-3 border rounded-lg">
              <div className="absolute -right-1 -top-1">
                <button onClick={() => onDelete(marker)}>
                  <FontAwesomeIcon
                    icon={faTimesCircle}
                    className="text-red-500"
                  />
                </button>
              </div>
              <p className="flex-1 tracking-wider text-center">{marker.id}</p>
              {/* <div className="flex items-center justify-center"> */}
              <UnstyledButton
                icon={faLocationArrow}
                placeholder="Go To Location"
                iconSize="sm"
                className="text-xs"
                onClick={() =>
                  panToLocation({ lat: marker.lat, lng: marker.lng })
                }
              />
              <UnstyledButton
                placeholder="Open"
                iconSize="sm"
                className="ml-2 text-xs"
                icon={faCaretSquareDown}
              />
              {/* </div> */}
            </div>
          ))}
        </div>

        <div className="min-h-sm">
          <p
            className={clsx(
              "px-6 py-3 font-bold text-center",
              "bg-gradient-to-r from-green-300 to-purple-400",
              "bg-clip-text text-transparent"
            )}
          >
            Drivers
          </p>
        </div>

        <div className="min-h-sm">
          <p
            className={clsx(
              "px-6 py-3 font-bold text-center",
              "bg-gradient-to-r from-rose-400 to-orange-300",
              "bg-clip-text text-transparent "
            )}
          >
            Stores
          </p>
        </div>
      </div>
    </div>
  );
}
