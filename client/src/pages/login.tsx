import Image from "next/image";
import { useRouter } from "next/router";
import { FormEvent, useState } from "react";
import { io } from "socket.io-client";
import styles from "@/styles/style.module.css"
import ThemeButton from "./theme_button";

export const socket = io("http://localhost:5000", { transports: ["websocket"] });

const validateUsername = (username: string) => {
  // Check if the input contains only alphanumeric characters and does not exceed 10 characters
  return /^[A-Za-z0-9]{1,10}$/.test(username);
};

const Login = () => {
  const router = useRouter();
  const [username, setUsername] = useState<string>("");
  const [warning, setWarning] = useState<string>("");

  const handleLogin = (e: FormEvent<HTMLElement>) => {
    e.preventDefault();
    if (validateUsername(username)) {
      if (username) {
        socket.emit("register", {
          username: username,
        });
        router.push({ pathname: "/home", query: { username: username } });
        socket.emit("get-all-users");
      }
    } else {
      // Show warning if the username does not meet the criteria
      setWarning(
        "Name must contain only alphabet and number, and not exceed 10 characters."
      );
    }
  };

  return (
    <div className={`${styles.font} flex flex-1 flex-col items-center dark:bg-[#F3D0D7] bg-[#F6F5F2] w-screen h-screen justify-center`}>
      <div className="border border-[#F3D0D7] dark:from-[#F3D0D7] dark:to-[#cd8896] dark:border-[#cd8896] bg-gradient-to-r from-[#F6F5F2] to-[#F3D0D7] rounded-xl flex flex-col justify-center items-center px-12 py-16 relative">
        <div className="absolute top-3 right-3">
          <ThemeButton/>
        </div>

        <Image src="/barby-logo.png" alt="" width={200} height={100}></Image>
        <form
          className="w-max mt-10 flex flex-col justify-center items-center space-y-12"
          onSubmit={handleLogin}
        >
          <input
            type="text"
            className="focus:outline-none w-80 h-16 rounded-2xl dark:bg-[#F3D0D7] bg-[#F6F5F2] pl-5 text-gray-900 border-2 border-[#F3D0D7] dark:border-[#cd8896]"
            placeholder="Username"
            name="username"
            onChange={(e) => setUsername(e.target.value)}
          />
          <button
            type="submit"
            className="w-18 text-lg text-bold flex items-center justify-center h-12 w-60 bg-[#E240A2] rounded-full ml-5 text-[white]"
            name="Go"
          >
            Try it out !
          </button>
          {warning && <p className="mt-3 text-pink-800 dark:text-pink-900">{warning}</p>}
        </form>
      </div>
    </div>
  );
};
export default Login;
