import { faCheckCircle } from "@fortawesome/free-solid-svg-icons";
import * as React from "react";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import UnstyledButton from "../../components/UnstyledButton";
import { getDriver } from "../../services/ApiDriver";
import { driverAcceptOrder } from "../../services/ApiOrders";
import { useDriverNotificationListener } from "../../services/WSDriverNotifications";
import { Driver, DriverNotification } from "../../types";
import DriverMapView from "./DriverMapView";

function DriverPage() {
  const param = useParams();
  const driverId = param.driver_id;
  const [driver, setDriver] = React.useState<Driver>();
  const [notifications] = useDriverNotificationListener();

  React.useEffect(() => {
    if (driverId != null && driver == null) {
      getDriver(driverId).then((nDriver) => {
        console.log(nDriver);
        setDriver(nDriver);
      });
    }
  }, [driver, driverId]);

  const acceptOrder = async (notification: DriverNotification) => {
    if (driver != null) {
      try {
        const response = await driverAcceptOrder(
          notification.orderId,
          driver.id,
          notification.id,
          driver.currentLocation
        );
        toast.success("Accepted!");
      } catch (e) {
        toast.error("Failed to accept order");
      }
    }
  };

  return (
    <div>
      <p className="my-4 font-bold text-center">
        Driver Page {`${driver && " | " + driver.id}`}
      </p>

      <DriverMapView driver={driver}/>

      <div className="flex w-4/6 mx-auto space-x-4">
        <div className="flex-1 p-4 bg-white rounded-lg shadow-lg min-h-md">
          <p className="my-4 font-bold tracking-wider">Driver Orders</p>
          {(driver == null || driver.orderIds.length === 0) && (
            <p className="mx-auto text-xl font-bold text-center opacity-40 my-14">
              No Orders Found
            </p>
          )}
        </div>

        <div className="flex-1 p-4 bg-white rounded-lg shadow-lg min-h-md">
          <p className="my-4 font-bold tracking-wider">Live Orders</p>
          {notifications &&
            notifications.map((notification) => (
              <div key={notification.id} className="p-2 rounded-md shadow-md">
                <div className="flex p-2 space-y-1 border rounded-lg justify-evenly">
                  <div className="space-y-1">
                    <p className="text-xs font-bold text-center">Customer</p>
                    <p className="text-sm text-center">
                      {notification.customerId}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs font-bold text-center">Store</p>
                    <p className="text-sm text-center">
                      {notification.storeId}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs font-bold text-center">OrderID</p>
                    <p className="text-sm text-center">
                      {notification.orderId}
                    </p>
                  </div>
                </div>
                <p className="py-2 text-xs tracking-widest text-center">
                  {notification.creationTime}
                </p>
                <UnstyledButton
                  icon={faCheckCircle}
                  placeholder="Select Job"
                  onClick={() => {
                    acceptOrder(notification);
                  }}
                  disabled={driver == null || driver.activeOrderId != null}
                  className="w-full text-center bg-lime-400 text-emerald-700"
                />
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}

export default DriverPage;
