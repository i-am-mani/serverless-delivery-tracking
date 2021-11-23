import * as React from "react";
import { LatLng, mapsAPIKEY, Order } from "../../types";
import { GoogleMap, Marker, useLoadScript } from "@react-google-maps/api";
import imUser from "../../resource/user.png";
import imDelivery from "../../resource/delivery.png";
import { useOrderListener } from "../../services/WSOrderListener";

const options = {
  disableDefaultUI: true,
  zoomControl: true,
};

const mapContainerStyle = {
  height: "400px",
  width: "70%",
};

type Props = {
  order: Order | undefined | null;
  customerLocation: LatLng | undefined | null;
};

function CustomerMapView({ order, customerLocation }: Props) {
  const mapRef = React.useRef<any>(null); // GoogleMap

  const libraries: any[] = React.useMemo(() => ["directions"], []);
  const [liveOrder] = useOrderListener(order?.id);
  const [isMapLoaded, setMapLoaded] = React.useState(false);
  const [isPolylinePlotted, setPolylinePlotted] = React.useState(false);

  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: mapsAPIKEY,
    libraries,
  });

  // TODO open web socket to order

  React.useEffect(() => {
    if (order && isMapLoaded && isPolylinePlotted === false) {
      const encodedPath = order.path;
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
  }, [isLoaded, isMapLoaded, isPolylinePlotted, order]);

  const onMapLoad = React.useCallback((map) => {
    mapRef.current = map;
    setMapLoaded(true);
  }, []);

  const onMapClick = () => {};

  return (
    <div className="my-4">
      {order == null && (
        <div className="flex justify-center">
          <div
            style={mapContainerStyle}
            className="flex flex-col justify-center bg-gray-100 rounded-lg shadow-sm"
          >
            <p className="text-lg font-bold text-center text-opacity-70">
              Select Order to begin tracking.
            </p>
          </div>
        </div>
      )}
      {order && isLoaded && (
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
              {customerLocation && (
                <Marker
                  position={{
                    lat: customerLocation.lat,
                    lng: customerLocation.lng,
                  }}
                  icon={{
                    url: imUser,
                    scaledSize: new google.maps.Size(24, 24),
                    origin: new google.maps.Point(0, 0),
                    anchor: new google.maps.Point(0, 32),
                  }}
                />
              )}

              {liveOrder && liveOrder.currentLocation && (
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
            <div></div>
          </div>
          {order.driverId == null && (
            <div className="mx-auto my-4 border rounded-lg w-min">
              <p className="px-4 py-1 font-bold text-center text-red-400 text-opacity-60 whitespace-nowrap">
                Status: Assigning Driver for Delivery
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default CustomerMapView;
