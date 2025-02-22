"use client";
import { EyeInvisibleOutlined, EyeTwoTone } from "@ant-design/icons";
import { Input, message } from "antd";
import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

const Page: React.FC = () => {
  const router = useRouter();
  const [firstName, setFirstName] = useState<string>("");
  const [lastName, setLastName] = useState<string>("");
  const [account, setAccount] = useState<string>("");
  const [phoneNumber, setPhoneNumber] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [repassword, setRepassword] = useState<string>("");

  const registerHandle = async () => {
    if (
      !account ||
      !password ||
      !firstName ||
      !lastName ||
      !phoneNumber ||
      !email ||
      !repassword
    ) {
      message.error("Please enter all fields");
      return;
    }

    try {
      const response = await axios.post("http://localhost:3030/auth/register", {
        email,
        password,
        repassword,
        first_name: firstName,
        last_name: lastName,
        phone_number: phoneNumber,
        account,
      });

      if (response.status === 200 || response.status === 201) {
        const { accessToken, refreshToken } = response.data.tokens;

        localStorage.setItem("accessToken", accessToken);
        localStorage.setItem("refreshToken", refreshToken);

        message.success("Register successful");
        console.log("Tokens:", { accessToken, refreshToken });

        router.push("/dashboard");
      } else {
        message.error("Invalid username or password");
      }
    } catch (error) {
      console.log("Login Error:", error);
    }
  };

  const handleNavigate = () => {
    router.push("/login");
  };
  return (
    <>
      <div className="mt-28 w-1/3  bg-white border rounded-2xl flex flex-col p-5 gap-5 pb-8">
        <div className="flex justify-center items-center w-full text-beamin font-semibold text-[26px]">
          Đăng Kí
        </div>
        <div className="flex flex-row w-full gap-2">
          <Input
            placeholder="Họ "
            className="h-[40px]"
            value={firstName}
            onChange={(e) => {
              setFirstName(e.target.value);
            }}
          />
          <Input
            placeholder="Tên"
            className="h-[40px]"
            value={lastName}
            onChange={(e) => {
              setLastName(e.target.value);
            }}
          />
        </div>
        <div className="flex flex-col w-full gap-3">
          <Input
            placeholder="Tên đăng nhập"
            className="h-[40px]"
            value={account}
            onChange={(e) => {
              setAccount(e.target.value);
            }}
          />
        </div>
        <div className="flex flex-col w-full gap-3">
          <Input
            placeholder="Số điện thoại"
            className="h-[40px]"
            value={phoneNumber}
            onChange={(e) => {
              setPhoneNumber(e.target.value);
            }}
          />
        </div>
        <div className="flex flex-col w-full gap-3">
          <Input
            placeholder="Email"
            className="h-[40px]"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
            }}
          />
        </div>
        <div className="flex flex-col w-full ">
          <Input.Password
            placeholder="Mật khẩu"
            className="h-[40px]"
            iconRender={(visible) =>
              visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
            }
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
            }}
          />
        </div>
        <div className="flex flex-col w-full ">
          <Input.Password
            placeholder="Nhập lại mật khẩu"
            className="h-[40px]"
            iconRender={(visible) =>
              visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
            }
            value={repassword}
            onChange={(e) => {
              setRepassword(e.target.value);
            }}
          />
        </div>
        <div className="flex flex-col w-full">
          <button
            className="w-full h-[40px] uppercase text-white bg-beamin rounded-lg"
            onClick={registerHandle}
          >
            Đăng Kí
          </button>
        </div>
        <div className="flex items-center justify-center gap-1">
          <span className="text-gray-600">Bạn đã có tài khoản?</span>
          <Link className="text-beamin cursor-pointer" href={"/login"}>
            {" "}
            Đăng nhập
          </Link>
        </div>
      </div>
    </>
  );
};
export default Page;
