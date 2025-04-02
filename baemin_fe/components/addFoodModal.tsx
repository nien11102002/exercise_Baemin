import React, { Dispatch, FC, SetStateAction, useState } from "react";
import { Modal, Button, message } from "antd";
import Image from "next/image";
import axios from "axios";

interface FoodQuantityModalProps {
  isOpen: boolean;
  onClose: () => void;
  food: any;
}

const FoodQuantityModal: FC<FoodQuantityModalProps> = ({
  isOpen,
  onClose,
  food,
}) => {
  const [quantity, setQuantity] = useState(1);
  const branch_food_id = food.id;
  const increaseQuantity = () => setQuantity((prev) => Math.min(prev + 1, 99));
  const decreaseQuantity = () => setQuantity((prev) => Math.max(prev - 1, 1));

  const handleAddCart = async () => {
    const accessToken = localStorage.getItem("accessToken");

    if (!accessToken) {
      console.error("No access token found");
      return;
    }

    console.log({ branch_food_id, quantity, accessToken });

    try {
      const response = await axios.post(
        ` http://localhost:3030/cart/add-item`,
        { branch_food_id, quantity },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 200 || response.status === 201) {
        message.success("Successfully add to cart!");
        setQuantity(1);
        onClose();
      } else {
        message.error("Failed to add to cart.");
      }
    } catch (error) {
      console.error("Error fetching food types:", error);
    }
  };

  return (
    <Modal
      title="Adjust Quantity"
      open={isOpen}
      onCancel={onClose}
      onOk={handleAddCart}
      okText="Confirm"
      cancelText="Cancel"
    >
      <div key={food.id} className="flex flex-row my-2">
        <div className="w-[15%] relative h-16">
          <Image
            layout="fill"
            objectFit="cover"
            src={`http://localhost:3030/images/${food.foods.image}`}
            alt={food.foods.name}
          />
        </div>
        <div className="w-[60%] flex  items-center px-2">
          <span className="font-bold text-[#464646]">{food.foods.name}</span>
        </div>
        <div className="w-[15%] flex justify-center items-center">
          <span className="text-[#0288d1] font-bold text-base">
            {food.price * quantity}đ
          </span>
        </div>
      </div>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "10px",
        }}
      >
        <Button onClick={decreaseQuantity} disabled={quantity === 1}>
          -
        </Button>
        <span
          style={{ fontSize: "18px", minWidth: "40px", textAlign: "center" }}
        >
          {quantity}
        </span>
        <Button onClick={increaseQuantity} disabled={quantity === food.stock}>
          +
        </Button>
      </div>
    </Modal>
  );
};

export default FoodQuantityModal;
