import * as React from "react";
import { Driver, LatLng, mapsAPIKEY } from "../../types";
import { GoogleMap, Marker, useLoadScript } from "@react-google-maps/api";
import { useOrderListener } from "../../services/WSOrderListener";
import imDelivery from "../../resource/delivery.png";
import { updateOrderLocation } from "../../services/ApiOrders";
import {
  markOrderDelivered,
  updateDriverLocation,
} from "../../services/ApiDriver";
import { toast } from "react-toastify";
import UnstyledButton from "../../components/UnstyledButton";
import { faCheckSquare } from "@fortawesome/free-solid-svg-icons";

const options = {
  disableDefaultUI: true,
  zoomControl: true,
};

const mapContainerStyle = {
  height: "400px",
  width: "70%",
};

type Props = {
  driver: Driver | undefined | null;
};

function DriverMapView({ driver }: Props) {
  const mapRef = React.useRef<any>(null); // GoogleMap

  const libraries: any[] = React.useMemo(() => ["directions"], []);
  const [liveOrder] = useOrderListener(driver?.activeOrderId);
  const [isMapLoaded, setMapLoaded] = React.useState(false);
  const [isPolylinePlotted, setPolylinePlotted] = React.useState(false);

  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: mapsAPIKEY,
    libraries,
  });

  const onMapLoad = React.useCallback((map) => {
    mapRef.current = map;
    setMapLoaded(true);
  }, []);

  React.useEffect(() => {
    if (liveOrder != null && isMapLoaded && isPolylinePlotted === false) {
      toast.info("Inside UseEffect conditional");
      const encodedPath = liveOrder.path;
      var bounds = new google.maps.LatLngBounds();
      var path = google.maps.geometry.encoding.decodePath(encodedPath);
      console.log(path);
      for (var i = 0; i < path.length; i++) {
        bounds.extend(path[i]);
      }

      var polyline = new google.maps.Polyline({
        path: path,
        strokeColor: "#3ED24E",
        strokeOpacity: 0.3,
        strokeWeight: 5,
        map: mapRef.current,
        fillColor: "#3ED24E",
        fillOpacity: 0.35,
        // strokeColor: "#0000FF",
        // strokeOpacity: 1.0,
        // strokeWeight: 2
      } as any);
      polyline.setMap(mapRef.current);
      mapRef.current.fitBounds(bounds);
      setPolylinePlotted(true);
    }
  }, [isLoaded, liveOrder, driver, isMapLoaded, isPolylinePlotted]);

  const onMapClick = (e: google.maps.MapMouseEvent) => {
    // update location on Order as well as Driver
    const latlng = e.latLng;
    if (latlng) {
      const location = {
        lat: latlng.lat(),
        lng: latlng.lng(),
      };
      if (liveOrder && driver) {
        updateOrderLocation(location, liveOrder.id);
        updateDriverLocation(location, driver.id);
      }
    }
  };

  const confirmDelivery = async () => {
    if (liveOrder && driver) {
      try {
        markOrderDelivered(driver.id, liveOrder.id);
        toast.success("Order marked as delivered");
      } catch (e) {
        toast.error("Failed to mark order delivered");
      }
    }
  };

  return (
    <div>
      {liveOrder == null && (
        <div className="flex justify-center">
          <div
            style={mapContainerStyle}
            className="flex flex-col justify-center bg-gray-100 rounded-lg shadow-sm"
          >
            <p className="text-lg font-bold text-center text-opacity-70">
              No Active Orders to track
            </p>
          </div>
        </div>
      )}

      {isLoaded && liveOrder && (
        <div>
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
              {liveOrder.currentLocation && (
                <Marker
                  position={{
                    lat: liveOrder.currentLocation.lat,
                    lng: liveOrder.currentLocation.lng,
                  }}
                  icon={{
                    url: imDelivery,
                    scaledSize: new google.maps.Size(24, 24),
                    origin: new google.maps.Point(0, 0),
                    anchor: new google.maps.Point(0, 32),
                  }}
                />
              )}
            </GoogleMap>
          </div>
          <div className="flex items-center justify-center my-4">
            <UnstyledButton
              placeholder="Confirm Delivered"
              className="text-emerald-700 bg-lime-400"
              icon={faCheckSquare}
              onClick={confirmDelivery}
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default DriverMapView;
