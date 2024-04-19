import Image from "next/image";
import React, { FormEvent, useEffect, useState } from "react";
import { socket } from "../login";
import { useRouter } from "next/router";
import hashString from "@/utils/hashString";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";

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
  const filteredFriends = friendList.filter((name) =>
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
    <div className="bg-bgColor w-1/3 border-r border-borderColor">
      <div className="h-[20%] w-full border-b border-borderColor items-center flex justify-center">
        <form
          className="w-4/5 flex items-center relative"
          onSubmit={handleSearch}
        >
          <input
            type="text"
            className="w-full h-12 rounded-2xl bg-borderColor pl-5 text-white pr-10"
            placeholder="Search"
            name="search_user"
          />
          <div className="absolute right-0 top-0 h-full w-10 text-center text-gray-400 pointer-events-none flex items-center justify-center">
            <MagnifyingGlassIcon className="h-6 w-6 text-fontBgColor" />
          </div>
        </form>
      </div>
      <div className="h-[80%] overflow-y-auto">
        {filteredFriends.map((friend, index) => {
          return (
            <div
              className={`h-28 w-full border-b border-borderColor items-center flex cursor-pointer ${
                friend == selectedFriend && isPrivate
                  ? "bg-purple bg-opacity-40"
                  : "hover:bg-purple hover:bg-opacity-5"
              } transition duration-250`}
              key={index}
              onClick={() => {
                onGroupClick(friend, true);
              }}
            >
              <Image
                src={`/Frame_${
                  friend ? hashString(friend as string) % 9 : 0
                }.png`}
                alt=""
                width={75}
                height={50}
                className="ml-6"
              ></Image>
              <div className="font-roboto ml-6">
                <p
                  className={`text-white text-xl ${
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
