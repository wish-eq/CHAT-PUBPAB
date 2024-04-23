type SidebarMenuProps = {
  setPage: (page: string) => void;
  currentPage: string;
};

import LogoutIcon from "@mui/icons-material/Logout";
import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import GroupIcon from "@mui/icons-material/Group";
import PersonIcon from "@mui/icons-material/Person";
import { useRouter } from "next/router";
import ChatIcon from "@mui/icons-material/Chat";
import styles from "@/styles/style.module.css";
import ThemeButton from "../theme_button";
import ReviewModal from "../Component/ReviewModal";

const SidebarMenu = ({ setPage, currentPage }: SidebarMenuProps) => {
  const [room, setRoom] = useState("all-chats");
  const [profileURL, setProfileURL] = useState("");

  const router = useRouter();
  const { username } = router.query;
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  const accountButtonRef = useRef<HTMLButtonElement | null>(null);
  const handleClickOutside = (event: MouseEvent) => {
    if (
      dropdownRef.current &&
      !dropdownRef.current.contains(event.target as Node) &&
      accountButtonRef.current &&
      !accountButtonRef.current.contains(event.target as Node)
    ) {
      setDropdownVisible(false);
    }
  };

  const handleLogout = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    router.push("/login");
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropdownRef]);

  const [isWriteReviewModal, setIsWriteReviewModal] = useState(false);

  const closeWriteReviewModal = () => {
    setIsWriteReviewModal(false);
  };
  const openWriteReviewModal = () => {
    setIsWriteReviewModal(true);
  };

  const handleSetProfileURL = (newURL: string) => {
    setProfileURL(newURL);
    closeWriteReviewModal();
  };

  return (
    <div
      className={`${styles.font} relative w-64 space-y-5 bg-gradient-to-r  border-gray-500 from-[#F3D0D7] to-[#F6F5F2]
     dark:from-[#F3D0D7] dark:to-[#cd8896] flex text-gray-800 flex-col justify-start items-center font-roboto`}
    >
      <ReviewModal
        isOpen={isWriteReviewModal}
        closeModal={closeWriteReviewModal}
        title="Choose your avatar !"
      >
        <div className="flex flex-col justify-center items-center p-8 space-y-8">
          <div className="flex flex-row justify-center items-center space-x-2">
            <Image
              src={`/Frame--0.png`}
              alt=""
              width={125}
              height={125}
              className={" hover:bg-pink-100 rounded-3xl p-4 "}
              onClick={() => handleSetProfileURL("/Frame--0.png")}
            />
            <Image
              src={`/barby-2.png`}
              alt=""
              width={125}
              height={125}
              className={" hover:bg-pink-100 rounded-3xl p-4 "}
              onClick={() => handleSetProfileURL("/barby-2.png")}
            />
            <Image
              src={`/barby-3.png`}
              alt=""
              width={125}
              height={125}
              className={" hover:bg-pink-100 rounded-3xl p-4 "}
              onClick={() => handleSetProfileURL("/barby-3.png")}
            />
          </div>
          <div className="flex flex-row justify-center items-center space-x-2">
            <Image
              src={`/barby-7.png`}
              alt=""
              width={125}
              height={125}
              className={" hover:bg-pink-100 rounded-3xl p-4 "}
              onClick={() => handleSetProfileURL("/barby-7.png")}
            />
            <Image
              src={`/barby-8.png`}
              alt=""
              width={125}
              height={125}
              className={" hover:bg-pink-100 rounded-3xl p-4 "}
              onClick={() => handleSetProfileURL("/barby-8.png")}
            />
            <Image
              src={`/barby-9.png`}
              alt=""
              width={125}
              height={125}
              className={" hover:bg-pink-100 rounded-3xl p-4 "}
              onClick={() => handleSetProfileURL("/barby-9.png")}
            />
          </div>
          <div className="flex flex-row justify-center items-center space-x-2">
            <Image
              src={`/barby-4.png`}
              alt=""
              width={125}
              height={125}
              className={" hover:bg-pink-100 rounded-3xl p-4 "}
              onClick={() => handleSetProfileURL("/barby-4.png")}
            />
            <Image
              src={`/barby-5.png`}
              alt=""
              width={125}
              height={125}
              className={" hover:bg-pink-100 rounded-3xl p-4 "}
              onClick={() => handleSetProfileURL("/barby-5.png")}
            />
            <Image
              src={`/barby-6.png`}
              alt=""
              width={125}
              height={125}
              className={" hover:bg-pink-100 rounded-3xl p-4 "}
              onClick={() => handleSetProfileURL("/barby-6.png")}
            />
          </div>
        </div>
      </ReviewModal>
      <div className="absolute top-4 right-3">
        <ThemeButton />
      </div>

      <div className="pt-10">
        <Image src="/barby-logo.png" alt="" width={150} height={75}></Image>
      </div>

      <div
        className="hover:bg-pink-100 px-4 py-2 rounded-lg cursor-pointer"
        onClick={openWriteReviewModal}
      >
        <Image
          src={profileURL || "/Frame--0.png"}
          alt=""
          width={70}
          height={60}
        />
        <p className="text-xl text-center text-gray-800 mt-2">{username}</p>
      </div>

      <div className="mb-8">
        <button
          type="button"
          name="friends"
          className={`flex flex-col items-center justify-center w-20 h-20 rounded-xl hover:text-pink-600 ${
            room === "friends"
              ? "text-pink-600 bg-pink-100 dark:bg-pink-50"
              : "hover:text-pink-600 dark:hover:text-pink-100"
          } transition duration-250`}
          onClick={() => {
            setPage("friends");
            setRoom("friends");
            console.log("friends");
          }}
        >
          <PersonIcon className="h-8 w-8" />
          <span className="text-sm font-medium">Friends</span>
        </button>
      </div>
      <div className="mb-8">
        <button
          type="button"
          name="groups"
          className={`flex flex-col items-center justify-center w-20 h-20 rounded-xl hover:text-pink-600 ${
            room === "groups"
              ? "text-pink-600 bg-pink-100 dark:bg-pink-50"
              : "hover:text-pink-600 dark:hover:text-pink-100"
          } transition duration-250`}
          onClick={() => {
            setPage("groups");
            setRoom("groups");
            console.log("groups");
          }}
        >
          <GroupIcon className="h-10 w-10" />
          <span className="text-sm font-medium">Groups</span>
        </button>
      </div>

      <div className="mb-12">
        <button
          type="button"
          name="all-chats"
          className={`flex flex-col items-center justify-center w-20 h-20 rounded-xl  ${
            room === "all-chats"
              ? "text-pink-600 bg-pink-100 dark:bg-pink-50"
              : "hover:text-pink-600 dark:hover:text-pink-100"
          } transition duration-250`}
          onClick={() => {
            setPage("all-chats");
            setRoom("all-chats");
            console.log("all-chats");
          }}
        >
          <ChatIcon className="h-8 w-8" />
          <span className="text-sm font-medium">All Chats</span>
        </button>
      </div>

      <div className="mb-8">
        <button
          type="button"
          name="groups"
          className={`flex flex-col items-center justify-center w-20 h-20 rounded-xl hover:text-pink-600 dark:hover:text-pink-100 transition duration-250`}
          onClick={handleLogout}
        >
          <LogoutIcon className="h-8 w-8" />
          <span className="text-sm font-medium">Logout</span>
        </button>
      </div>
    </div>
  );
};

export default SidebarMenu;
