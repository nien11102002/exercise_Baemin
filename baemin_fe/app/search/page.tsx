"use client";

import { ShoppingCartOutlined } from "@ant-design/icons";
import React, { useEffect, useState } from "react";
import TypeSelector from "./type";
import AreaSelector from "./area";
import FilterSelector from "./filter";
import ResultFood from "./result";
import { useSearchParams } from "next/navigation";
import axios from "axios";

const Page: React.FC = () => {
  const searchParams = useSearchParams();
  const keyword = searchParams?.get("keyword");

  const [items, setItems] = useState<any[]>([]);

  useEffect(() => {
    const fetchItemData = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3030/food/search-food?keyword=${keyword}`
        );
        // console.log({ keyword });
        // console.log(response.data);
        setItems(
          response.data.items.map((item: any) => {
            return {
              id: item.branch_food_id,
              name: item.food_name,
              img: item.food_image,
              address: item.branch_address,
              kind: item.food_type_name,
              branch_id: item.branch_id,
            };
          })
        );
      } catch (error) {
        console.error("Error fetching food types:", error);
      }
    };
    fetchItemData();
  }, [keyword]);

  return (
    <>
      <div className="w-full flex flex-row justify-between items-center border-b border-solid">
        <div className="flex flex-row gap-3">
          <AreaSelector />
          <TypeSelector />
        </div>
        <div className="flex items-center justify-center ">
          <FilterSelector></FilterSelector>
        </div>
      </div>
      <div className="my-3 flex flex-row"></div>
      <ResultFood items={items} />
    </>
  );
};
export default Page;
