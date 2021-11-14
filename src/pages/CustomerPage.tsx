import * as React from "react";
import { useParams } from "react-router-dom";

function CustomerPage() {
  const param = useParams();
  return <div>CustomerPage - {param.customer_id}</div>;
}

export default CustomerPage;
