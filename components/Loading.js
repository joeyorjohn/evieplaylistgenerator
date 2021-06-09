import React from "react";

export default function Loading() {
  return (
    <div className="bg-gray w-screen h-screen flex">
      <div className="m-auto">
        <div>
          <img className="m-auto mb-4" src="/images/loading.gif" />
          <p className="text-white">Calculating your score...</p>
        </div>
      </div>
    </div>
  );
}
