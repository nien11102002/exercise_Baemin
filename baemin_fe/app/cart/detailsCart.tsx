import { Button } from "antd";
import { Butterfly_Kids } from "next/font/google";
import Image from "next/image";
import React, { useState } from "react";

export default function DetailsCart({
  Details,
  selectedStore,
  onStoreItemsSelect,
  onRemoveCartItem,
}: {
  Details: any[];
  selectedStore: number | null;
  onStoreItemsSelect: (
    storeId: number,
    storeName: string,
    totalPrice: number
  ) => void;
  onRemoveCartItem: (branchFoodId: number) => void;
}) {
  const [storeTotalPrice, setStoreTotalPrice] = useState(0);

  return (
    <>
      {Details.map((store, index) => (
        <div className="w-full flex flex-col  bg-white rounded-md ">
          <div className=" flex flex-row my-7 ml-8 items-center gap-3">
            <input
              id="default-checkbox"
              type="checkbox"
              checked={selectedStore === store.branchId}
              onChange={() => {
                const totalStorePrice = store.items.reduce(
                  (acc: number, item: any) => acc + item.totalPrice,
                  0
                );
                onStoreItemsSelect(
                  selectedStore === store.branchId ? null : store.branchId,
                  store.name,
                  totalStorePrice
                );
              }}
              className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded   dark:ring-offset-gray-800 "
            />
            <span className="text-base font-normal"> {store.name}</span>
            <div className=" bg-beamin p-1 rounded-md">
              {store.quandoitac && (
                <span className="text-sm font-normal text-white">
                  Quán đối tác
                </span>
              )}
            </div>
          </div>
          <div className=" w-full border-t border-b border-solid border-gray-600 py-3">
            {store.items.map((item: any, index: any) => (
              <div
                key={item.id}
                className={
                  index === store.items.length - 1
                    ? "w-full grid grid-cols-12"
                    : "w-full grid grid-cols-12 border-b border-solid border-x-gray-300"
                }
              >
                <div className="pl-8  col-span-4 flex items-center flex-row gap-3">
                  <div className="relative h-36 w-36">
                    <Image
                      layout="fill"
                      objectFit="cover"
                      className="w-[50px]"
                      src={`http://localhost:3030/images/${item.img}`}
                      alt={""}
                    />
                  </div>
                  <div className="flex flex-col gap-3">
                    <span className="text-base ">{item.foodName}</span>
                    <span className="text-sm text-gray-600">
                      {item.description}
                    </span>
                  </div>
                </div>
                <div className="col-span-2 flex items-center justify-center flex-row gap-3">
                  ₫{item.unitPrice}
                </div>
                <div className="col-span-2 flex items-center justify-center flex-row gap-3">
                  <div
                    id="quantity"
                    className="w-16 text-center border border-gray-300 rounded"
                  >
                    {item.quantity}
                  </div>
                </div>
                <div className="col-span-2 flex items-center justify-center flex-row gap-3">
                  ₫{item.totalPrice}
                </div>
                <div
                  className="col-span-2 flex items-center justify-center flex-row gap-3"
                  onClick={() => onRemoveCartItem(item.id)}
                >
                  <span className=" hover:text-red-600 cursor-pointer">
                    Xóa
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </>
  );
}
