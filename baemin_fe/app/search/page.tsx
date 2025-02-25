"use client";

import { ShoppingCartOutlined } from "@ant-design/icons";
import React, { useEffect, useState } from "react";
import TypeSelector from "./type";
import AreaSelector from "./area";
import FilterSelector from "./filter";
import ResultFood from "./result";
import { useSearchParams } from "next/navigation";
import axios from "axios";

interface Item {
  id: number;
  name: string;
  address: string;
  image: string;
  kind: string;
}

const Page: React.FC = () => {
  const searchParams = useSearchParams();
  const keyword = searchParams?.get("keyword");

  const [items, setItems] = useState<Item[]>([]);

  useEffect(() => {
    const fetchItemData = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3030/food/search-food?keyword=${keyword}`
        );
        console.log({ keyword });
        console.log({ response });
        // setItems(
        //   response.data.map((item: Item) => {
        //     return {
        //       id:item.id,
        //       name: item.name,
        //       img: item.image,
        //       address: item.address,
        //       kind:item.
        //     };
        // })
        // );
      } catch (error) {
        console.error("Error fetching food types:", error);
      }
    };
    fetchItemData();
  }, []);

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
