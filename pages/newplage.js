import React from "react";
import { useAppContext, AppContext } from "../context/state";

export default function test() {
  const { sharedState, updateSharedState } = useAppContext(AppContext);

  return (
    <div>
      <p>{sharedState}</p>
      <p>testing</p>
      <button onClick={() => updateSharedState("hello mars")}>test</button>
    </div>
  );
}
