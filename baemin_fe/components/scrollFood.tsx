"use client";
import { LeftOutlined, RightOutlined } from "@ant-design/icons";
import React, { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function ScrollBar({ items }: { items: any }) {
  const router = useRouter();
  const [currentIndex, setCurrentIndex] = useState(0);
  const containerRef = React.useRef<HTMLDivElement>(null);

  const handleNavigate = () => {
    router.push("/detailfood");
  };

  const handleNext = () => {
    if (containerRef.current) {
      if (items.items.length - 1 > currentIndex)
        setCurrentIndex(currentIndex + 1);
      containerRef.current.scrollBy({ left: 180, behavior: "smooth" });
    }
  };

  const handlePrev = () => {
    if (containerRef.current) {
      if (0 < currentIndex) setCurrentIndex(currentIndex - 1);
      containerRef.current.scrollBy({ left: -180, behavior: "smooth" });
    }
  };

  return (
    <div className="bg-white rounded-2xl w-full" style={{ height: "300px" }}>
      <div className="w-full h-full flex flex-col px-4 pt-4 pb-2">
        <div className="relative ml-3 text-xl font-bold mb-2">
          {items.title}
        </div>
        <div className="w-full relative h-full">
          {currentIndex > 0 && (
            <button
              onClick={handlePrev}
              className="absolute hover:text-beamin hover:bg-slate-50 bg-white top-20 left-1 w-8 h-8 rounded-full z-20"
            >
              <LeftOutlined />
            </button>
          )}
          <div
            ref={containerRef}
            className="scroll-container w-full h-full flex flex-row gap-3 overflow-x-auto"
          >
            {items.items.map((item: any, index: any) => (
              <div
                key={index}
                onClick={handleNavigate}
                className="group w-48 h-full cursor-pointer flex-shrink-0"
              >
                <div className="relative w-full h-2/3">
                  <Image
                    src={`http://localhost:3030/images/${item.image}`}
                    alt=""
                    fill
                    className="object-cover group-hover:brightness-75"
                  />
                </div>
                <div className="group-hover:bg-slate-50 w-full h-1/3 flex flex-col p-2 border border-beamin-50">
                  <div className="w-full truncate text-base">
                    <span>{item.name}</span>
                  </div>
                  <div className="w-full truncate text-sm text-gray-500">
                    <span>{item.address}</span>
                  </div>
                  <div className="w-full text-sm border-t border-beamin-50 mt-2">
                    <span>{item.kind}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
          {currentIndex < items.items.length - 1 && (
            <button
              onClick={handleNext}
              className="absolute hover:text-beamin hover:bg-slate-50 bg-white top-20 right-1 w-8 h-8 rounded-full z-20"
            >
              <RightOutlined />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
