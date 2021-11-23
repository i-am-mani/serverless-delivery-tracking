import * as React from "react";
import { Store } from "../types";

export function useStoreListener(storeId: string | null | undefined) {
  const [store, setStore] = React.useState<Store>();

  React.useEffect(() => {
    if (storeId == null) return;
    const socket = new WebSocket(
      `wss://hbvhy417vf.execute-api.ap-south-1.amazonaws.com/production?collectionId=${storeId}`
    );
    socket.onopen = () => {
      socket.send(
        JSON.stringify({
          action: "default",
          name: "stores",
          id: storeId,
        })
      );
    };
    socket.onmessage = (event) => {
      if (event.data === "") return;
      console.log(event);
      const data = JSON.parse(event.data);
      setStore(data);
    };
    socket.onclose = () => {
      console.log("Connection Closed");
    };

    return () => {
      socket.close();
    };
  }, [storeId]);

  return [store];
}
