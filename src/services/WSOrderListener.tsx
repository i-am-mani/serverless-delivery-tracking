import * as React from "react";
import { Order } from "../types";


export function useOrderListener(orderId: string | null | undefined) {
  const [order, setOrder] = React.useState<Order>();

  React.useEffect(() => {
    if (orderId == null) return;
    const socket = new WebSocket(
      `wss://bhiqni77f8.execute-api.ap-south-1.amazonaws.com/production?collectionId=${orderId}`
    );
    socket.onopen = () => {
      socket.send(
        JSON.stringify({
          action: "default",
          id: orderId,
        })
      );
    };
    socket.onmessage = (event) => {
      if (event.data === "") return;
      console.log(event);
      const data = JSON.parse(event.data);
      setOrder(data);
    };
    socket.onclose = () => {
      console.log("Connection Closed");
    };

    return () => {
      socket.close();
    };
  }, [orderId]);

  return [order];
}
