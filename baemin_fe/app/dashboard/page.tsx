"use client";

import HeaderNav from "@/components/headerNav";
import ScrollBar from "@/components/scrollBar";
import ScrollFood from "@/components/scrollFood";
import axios from "axios";
import Image from "next/image";
import React, { useEffect, useState } from "react";

interface Item {
  name: string;
  image: string;
  description: string;
}

export default function Home() {
  const [items, setItems] = useState<Item[]>([]);
  const [bannerItems, setBannerItems] = useState<any[]>([]);
  const [todayFoods, setTodayFoods] = useState<any>();

  useEffect(() => {
    const fetchItemData = async () => {
      try {
        const response = await axios.get(
          "http://localhost:3030/food/get-food-types"
        );
        setItems(
          response.data.map((item: Item) => {
            return {
              name: item.name,
              image: item.image,
              description: item.description,
            };
          })
        );
      } catch (error) {
        console.error("Error fetching food types:", error);
      }
    };

    const fetchBannerData = async () => {
      try {
        const response = await axios.get(
          "http://localhost:3030/food/get-banners"
        );
        setBannerItems(
          response.data.map((item: any) => {
            return {
              id: item.id,
              name: item.name,
              url: item.url,
            };
          })
        );
      } catch (error) {
        console.error("Error fetching food types:", error);
      }
    };

    const fetchTodayFoodData = async () => {
      try {
        const response = await axios.get(
          "http://localhost:3030/food/get-foods-pagination?page=1&pageSize=5"
        );

        setTodayFoods({
          title: "Hôm Nay ăn gì",
          items: response.data.items.map((item: any) => {
            return {
              id: item.id,
              name: item.name,
              address: item.branch_foods[0].branches.address,
              image: item.image,
              kind: item.food_types.name,
            };
          }),
        });
      } catch (error) {
        console.error("Error fetching food types:", error);
      }
    };

    fetchItemData();
    fetchBannerData();
    fetchTodayFoodData();
  }, []);

  const TodayFood = {
    title: "Hôm Nay ăn gì",
    items: [
      {
        id: "1",
        name: " Gà Ủ Muối Hoa Tiêu - Food",
        adrress: "4A Đường Số 71, P. Tân Quy, Quận 7, TP. HCM",
        img: "/food/ga1.jpg",
        kind: "Quan An",
      },
      {
        id: "1",
        name: " Gà Ủ Muối Hoa Tiêu - Food",
        adrress: "4A Đường Số 71, P. Tân Quy, Quận 7, TP. HCM",
        img: "/food/ga1.jpg",
        kind: "Quan An",
      },
      {
        id: "1",
        name: " Gà Ủ Muối Hoa Tiêu - Food",
        adrress: "4A Đường Số 71, P. Tân Quy, Quận 7, TP. HCM",
        img: "/food/ga1.jpg",
        kind: "Quan An",
      },
      {
        id: "1",
        name: " Gà Ủ Muối Hoa Tiêu - Food",
        adrress: "4A Đường Số 71, P. Tân Quy, Quận 7, TP. HCM",
        img: "/food/ga1.jpg",
        kind: "Quan An",
      },
      {
        id: "1",
        name: " Gà Ủ Muối Hoa Tiêu - Food",
        adrress: "4A Đường Số 71, P. Tân Quy, Quận 7, TP. HCM",
        img: "/food/ga1.jpg",
        kind: "Quan An",
      },
      {
        id: "1",
        name: " Gà Ủ Muối Hoa Tiêu - Food",
        adrress: "4A Đường Số 71, P. Tân Quy, Quận 7, TP. HCM",
        img: "/food/ga1.jpg",
        kind: "Quan An",
      },
    ],
  };

  useEffect(() => {
    console.log("Updated todayFood state:", todayFoods);
  }, [todayFoods]);

  return (
    <>
      <div className="grid grid-cols-12 gap-4">
        <div className="col-span-3 pt-3 pl-8 pr-8  z-40">
          <div className="flex flex-col fixed  bg-white w-64 rounded-2xl  pl-3 pt-2  pb-5 gap-3  ">
            <span>Thực đơn </span>
            {items.map((item, index) => (
              <div
                key={index}
                className="flex flex-col gap-3 cursor-pointer hover:bg-slate-100"
              >
                <div className="flex flex-row items-center gap-1">
                  <Image
                    src={`http://localhost:3030/images/${item.image}`}
                    width={30}
                    height={30}
                    alt={item.description}
                  />
                  <span>{item.name}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="col-span-9 w-full  pt-3 pr-8 gap-3 flex flex-col">
          <ScrollBar items={bannerItems}></ScrollBar>
          {todayFoods && (
            <>
              <ScrollFood items={todayFoods}></ScrollFood>
              <ScrollFood items={todayFoods}></ScrollFood>
            </>
          )}
        </div>
      </div>
    </>
  );
}
