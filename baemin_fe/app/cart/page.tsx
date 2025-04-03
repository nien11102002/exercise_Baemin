"use client";

import HeaderNav from "@/components/headerNav";
import ScrollBar from "@/components/scrollBar";
import ScrollFood from "@/components/scrollFood";
import { ShoppingCartOutlined } from "@ant-design/icons";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import DetailsCart from "./detailsCart";
import { Button, message } from "antd";
import axios from "axios";
import { useCartStore } from "@/store/cartStore";

export default function Home() {
  const accessToken = localStorage.getItem("accessToken");

  const [selectedStore, setSelectedStore] = useState<any>();
  const [cartItems, setCartItems] = useState<any[]>([]);
  const [selectedStoreName, setSelectedStoreName] = useState<string>("");
  const [totalPrice, setTotalPrice] = useState<number>(0);

  useEffect(() => {
    const getCartItems = async () => {
      try {
        if (!accessToken) {
          console.error("No access token found");
          return;
        }
        const response = await axios.get(
          ` http://localhost:3030/cart/get-cart-items`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
              "Content-Type": "application/json",
            },
          }
        );

        console.log(response.data);
        setCartItems(response.data);
      } catch (error) {
        console.error("Error fetching food types:", error);
      }
    };
    getCartItems();
  }, []);

  const handleStoreSelect = (
    branchId: number,
    storeName: string,
    totalPay: number
  ) => {
    setSelectedStore(branchId);
    if (!branchId) {
      setSelectedStoreName("");
      setTotalPrice(0);
    } else {
      setSelectedStoreName(storeName);
      setTotalPrice(totalPay);
    }
  };

  const handleRemoveCartItem = async (cartItemId: number) => {
    const response = await axios.delete(
      ` http://localhost:3030/cart/${cartItemId}`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      }
    );

    if (response.status === 200 || response.status === 201) {
      message.success("Successfully remove !");
      setCartItems((prevCart) => {
        return prevCart
          .map((store) => ({
            ...store,
            items: store.items.filter((item: any) => item.id !== cartItemId),
          }))
          .filter((store) => store.items.length > 0);
      });
    } else {
      message.error("Failed to remove.");
    }
  };

  const handleConfirm = () => {
    if (selectedStore) {
      const storeData = cartItems.find(
        (store) => store.branchId === selectedStore
      );

      console.log({ storeData });

      if (storeData) {
        useCartStore.getState().setSelectedStore(selectedStore, storeData);
      }
    }
  };

  return (
    <>
      <div className="flex flex-row w-full h-20 bg-white ">
        <div className="w-1/2 h-full flex flex-row  items-center gap-3">
          <div className="ml-10 text-4xl  text-beamin font-bold">
            <ShoppingCartOutlined />
          </div>
          <div className="text-2xl  text-beamin ">|</div>
          <div className="text-3xl  text-beamin font-bold">Giỏ hàng</div>
        </div>
        <div className="w-1/2 h-full flex   items-center gap-3"></div>
      </div>
      <div className="mt-4 px-16 flex flex-col gap-4  pb-16 rounded-md">
        <div className=" w-full h-16  bg-white  grid grid-cols-12">
          <div className="pl-8  col-span-4 flex items-center flex-row gap-5">
            {/* <input
              id="default-checkbox"
              type="checkbox"
              value=""
              className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded   dark:ring-offset-gray-800 "
            /> */}
            <span className="text-base font-normal pl-56"> Món Ăn</span>
          </div>
          <div className="col-span-2 flex items-center justify-center flex-row gap-3">
            <span className="text-base font-normal  text-gray-600">
              Đơn giá
            </span>
          </div>
          <div className="col-span-2 flex items-center justify-center flex-row gap-3">
            <span className="text-base font-normal  text-gray-600">
              Số lượng
            </span>
          </div>
          <div className="col-span-2 flex items-center justify-center flex-row gap-3">
            <span className="text-base font-normal  text-gray-600">
              Số tiền
            </span>
          </div>
          <div className="col-span-2 flex items-center justify-center flex-row gap-3">
            <span className="text-base font-normal  text-gray-600">
              Thao tác
            </span>
          </div>
        </div>
        <DetailsCart
          Details={cartItems}
          selectedStore={selectedStore}
          onStoreItemsSelect={handleStoreSelect}
          onRemoveCartItem={handleRemoveCartItem}
        />
        <div className=" flex flex-row fixed bottom-0  w-[90.6%]  mr-16  h-16 bg-white items-center  ">
          <div className="flex flex-row gap-2 w-1/2 h-full items-center ml-10">
            {/* <div className="cursor-pointer hover:text-red-600 ">Hủy</div> */}
            <div> Quán Đã chọn: </div>
            <div> {selectedStoreName}</div>
          </div>
          <div className="flex flex-row gap-2 w-1/2 h-full items-center justify-end pr-2">
            <div className=""> Tổng thanh toán:</div>
            <div className="text-red-600">₫{totalPrice} </div>
            <div>
              <Button
                onClick={handleConfirm}
                href={selectedStore ? `/checkout` : "#"}
                style={{
                  background: selectedStore ? "#3AC5C9" : "#ccc",
                  color: "white",
                  pointerEvents: selectedStore ? "auto" : "none",
                }}
                className="bg-beamin text-white w-40 h-10 rounded-md hover:brightness-105"
                disabled={!selectedStore}
              >
                Thanh toán
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
