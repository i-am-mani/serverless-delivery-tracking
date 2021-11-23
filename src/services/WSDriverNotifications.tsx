import * as React from "react";
import { DriverNotification } from "../types";

export function useDriverNotificationListener() {
  const [notifications, setNotifications] = React.useState<
    DriverNotification[]
  >([]);

  React.useEffect(() => {
    const socket = new WebSocket(
      `wss://cw5fyyni88.execute-api.ap-south-1.amazonaws.com/production`
    );

    socket.onopen = () => {
      socket.send(
        JSON.stringify({
          action: "default",
        })
      );
    };

    socket.onmessage = (event) => {
      console.log(event);
      const data = JSON.parse(event.data);
      if (data.action === "default") {
        setNotifications(data.items);
      } else if (data.action === "DELETE") {
        const copy = notifications.filter((item) => item.id !== data.id);
        setNotifications(copy);
      } else if (data.action === "INSERT") {
        console.log("insert new order");
        console.log(data.data);
        

        setNotifications([...notifications, data.data]);
      }
    };

    socket.onclose = () => {
      console.log("Connection Closed");
    };

    return () => {
      socket.close();
    };
  }, []);

  return [notifications];
}
