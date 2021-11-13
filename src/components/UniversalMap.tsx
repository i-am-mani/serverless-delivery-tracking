import { GoogleMap, Marker, useLoadScript } from "@react-google-maps/api";
import * as React from "react";
import { toast } from "react-toastify";
import { LatLng, mapsAPIKEY } from "../types";
import { EntitiesSection } from "./EntitiesSection";
import MapIconSelector, { IconType } from "./MapIconSelector";

const defaultProps = {
  center: {
    lat: 10.99835602,
    lng: 77.01502627,
  },
  zoom: 11,
};

const options = {
  disableDefaultUI: true,
  zoomControl: true,
};

const mapContainerStyle = {
  height: "400px",
  width: "70%",
};

export type MapMarker = {
  lat: number;
  lng: number;
  type: IconType;
  id: string;
  icon: any;
};

type Props = {
  markers: MapMarker[];
  addCustomer: (id: string, lat: number, lng: number) => void;
  addDriver: (id: string, lat: number, lng: number) => void;
  addStore: (id: string, lat: number, lng: number) => void;
  deleteMarker: (marker: MapMarker) => void;
};

// const libraries: any[] = ["places"];
function UniversalMap({
  markers,
  addCustomer,
  deleteMarker,
  addDriver,
  addStore,
}: Props) {
  const mapRef = React.useRef<any>(null); // GoogleMap
  //   const [markers, setMarkers] = React.useState<MapMarker[]>([]); // Markers->Cust|Driver|Store
  const inputNameRef = React.createRef<HTMLInputElement>();

  //   React.useEffect(() => {
  //     setMarkers([...initMarkers]);
  //   }, [initMarkers]);

  const onMapLoad = React.useCallback((map) => {
    mapRef.current = map;
  }, []);

  const libraries = React.useMemo(() => [], []);

  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: mapsAPIKEY,
    libraries,
  });

  const [activeMapIcon, setActiveMapIcon] =
    React.useState<IconType>("customer");

  const onMapClick = React.useCallback(
    async (props: google.maps.MapMouseEvent) => {
      const latlng = props.latLng;
      const ref = inputNameRef.current;
      if (ref) {
        const name = ref.value;
        if (!name) {
          toast.error("Please enter id/name");
        }
        if (latlng) {
          if (activeMapIcon === "customer") {
            addCustomer(name, latlng.lat(), latlng.lng());
          } else if (activeMapIcon === "driver") {
            addDriver(name, latlng.lat(), latlng.lng());
          } else if (activeMapIcon === "store") {
            addStore(name, latlng.lat(), latlng.lng());
          }
          ref.value = "";
        }
      }
    },
    [inputNameRef]
  );

  const panToLocation = (location: LatLng) => {
    mapRef.current.panTo({ lat: location.lat, lng: location.lng });
    mapRef.current.setZoom(16);
  };

  return (
    <div>
      {isLoaded && (
        <div className="flex justify-center">
          <GoogleMap
            onLoad={onMapLoad}
            id="map"
            mapContainerStyle={mapContainerStyle}
            zoom={18}
            center={{ lat: 19.023754732270234, lng: 72.85019307154047 }}
            options={options}
            onClick={onMapClick}
          >
            {markers.map((marker) => (
              <Marker
                key={marker.lat}
                icon={{
                  url: marker.icon,
                  scaledSize: new google.maps.Size(24, 24),
                  origin: new google.maps.Point(0, 0),
                  anchor: new google.maps.Point(0, 32),
                }}
                position={{ lat: marker.lat, lng: marker.lng }}
                title={marker.id}
              />
            ))}
          </GoogleMap>
          <div></div>
        </div>
      )}
      <div className="flex flex-col items-center justify-center">
        <MapIconSelector
          selected={activeMapIcon}
          setSelected={(iconType) => setActiveMapIcon(iconType)}
        />
        <div>
          <input
            ref={inputNameRef}
            type="text"
            className="p-2 bg-gray-100 rounded-lg shadow-sm ring-0 ring-lime-400 focus:ring-2 focus:bg-lime-100"
            placeholder="ID/Name"
          />
        </div>
      </div>
      <div className="my-12">
        <EntitiesSection
          panToLocation={panToLocation}
          markers={markers}
          onDelete={deleteMarker}
        />
      </div>
    </div>
  );
}

export default UniversalMap;
