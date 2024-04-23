type SidebarMenuProps = {
  setPage: (page: string) => void;
  currentPage: string;
};

import {
  ChatBubbleOvalLeftEllipsisIcon,
  UserGroupIcon,
  UserIcon,
} from "@heroicons/react/24/outline";
// import { useState } from "react";
// import Image from "next/image";
import LogoutIcon from "@mui/icons-material/Logout";
import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
// import Sidebar from "./Left-Sidebar/sidebar";
import GroupIcon from "@mui/icons-material/Group";
import PersonIcon from "@mui/icons-material/Person";
import ChatWindow from "../Chat-Window/chat-window";
import { ChevronDownIcon } from "@heroicons/react/24/outline";
import { useRouter } from "next/router";
import ChatIcon from "@mui/icons-material/Chat";
import styles from "@/styles/style.module.css";
import hashString from "@/utils/hashString";
import ThemeButton from "../theme_button";

const SidebarMenu = ({ setPage, currentPage }: SidebarMenuProps) => {
  const [room, setRoom] = useState("all-chats");
  ///

  const router = useRouter();
  const { username } = router.query;
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const dropdownRef = useRef<HTMLDivElement | null>(null);
  const [showChatWindow, setShowChatWindow] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState("");
  const [isPrivate, setIsPrivate] = useState<any>(undefined);
  const handleGroupClick = (groupName: string, isprivate: any) => {
    setSelectedGroup(groupName);
    setShowChatWindow(true);
    setIsPrivate(isprivate);
  };
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

  const toggleDropdown = (e: React.MouseEvent) => {
    e.stopPropagation();
    setDropdownVisible(!dropdownVisible);
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
  return (
    <div
      className={`${styles.font} relative w-64 space-y-5 bg-gradient-to-r  border-gray-500 from-[#F3D0D7] to-[#F6F5F2]
     dark:from-[#F3D0D7] dark:to-[#cd8896] flex text-gray-800 flex-col justify-start items-center font-roboto`}
    >
      <div className="absolute top-4 right-3">
        <ThemeButton />
      </div>

      <div className="pt-10">
        <Image src="/barby-logo.png" alt="" width={150} height={75}></Image>
      </div>

      <div className="">
        <Image src={`/Frame--0.png`} alt="" width={60} height={60}></Image>
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
