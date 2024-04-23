import Image from "next/image";
import React, { FormEvent, useEffect, useState } from "react";
import { socket } from "../login";
import { useRouter } from "next/router";
import hashString from "@/utils/hashString";
import styles from "@/styles/style.module.css";
import SearchIcon from "@mui/icons-material/Search";

interface ChatFriendsProps {
  onGroupClick: (GroupName: string, isprivate: any) => void;
  selectedFriend: string;
  isPrivate: any;
}

const Friends: React.FC<ChatFriendsProps> = ({
  onGroupClick,
  selectedFriend,
  isPrivate,
}) => {
  const [friendList, setFriendList] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const router = useRouter();
  const { username } = router.query;

  const handleSearch = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const searchQuery = e.currentTarget.elements.namedItem(
      "search_user"
    ) as HTMLInputElement;
    setSearchTerm(searchQuery.value);
  };

  const filteredFriendList = friendList.filter((name) =>
    name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  useEffect(() => {
    socket.emit("get-all-users");
  }, []);

  useEffect(() => {
    const friendListener = (data: string[]) => {
      const allUsers = data;
      if (username !== undefined && typeof username === "string") {
        const currentUser = data.indexOf(username);
        if (currentUser !== -1) {
          allUsers.splice(currentUser, 1);
        }
      }
      setFriendList(data);
    };
    socket.on("users", friendListener);
    return () => {
      socket.off("users", friendListener);
    };
  }, [username]);

  return (
    <div
      className={`${styles.font} bg-gradient-to-b from-[#F3D0D7] to-[#f8e7ea] dark:from-[#F3D0D7] dark:to-[#cd8896] w-1/3 border-borderColor`}
    >
      <div className="h-[20%] w-full  border-borderColor items-center flex justify-center">
        <form
          className="w-4/5 flex items-center relative"
          onSubmit={handleSearch}
        >
          <input
            type="text"
            className="w-full h-12 rounded-2xl bg-[#F6F5F2] dark:bg-[#F3D0D7] dark:border-[#cd8896] dark:border-[2px] outline-none pl-5 text-gray-800 pr-10"
            placeholder="Search"
            name="search_user"
          />
          <div className="absolute right-0 top-0 h-full w-10 text-center text-gray-400 pointer-events-none flex items-center justify-center">
            <SearchIcon className="h-6 w-6 text-fontBgColor" />
          </div>
        </form>
      </div>
      <div className="h-[80%] overflow-y-auto">
        {filteredFriendList.map((friend, index) => {
          return (
            <div
              className={`${
                styles.font
              } h-28 w-full items-center flex cursor-pointer ${
                friend == selectedFriend && isPrivate
                  ? "bg-pink-900 bg-opacity-10"
                  : "hover:bg-pink-500 hover:bg-opacity-5"
              } transition duration-250`}
              key={index}
              onClick={() => {
                onGroupClick(friend, true);
              }}
            >
              <Image
                src={`/Frame--0.png`}
                alt=""
                width={60}
                height={50}
                className="ml-6"
              ></Image>
              <div className="ml-6">
                <p
                  className={`text-gray-800 text-xl ${
                    friend === selectedFriend && isPrivate ? "font-bold" : ""
                  }`}
                >
                  {friend}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
export default Friends;
