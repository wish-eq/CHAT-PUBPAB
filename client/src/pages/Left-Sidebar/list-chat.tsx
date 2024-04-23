import React, { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/router";
import { socket } from "../login";
import { RoomDetails } from "./list-group";
import { getFriendName } from "@/utils/private_chat";
import ChatItem from "../Component/chat";
import styles from "@/styles/style.module.css";
import SearchIcon from "@mui/icons-material/Search";

export interface Chat {
  roomName: string;
  name: string;
  message: string;
  isPrivate: any;
  pin: boolean;
}

interface allChatsProps {
  onGroupClick: (groupName: string, isprivate: any) => void;
  selectedGroup: string;
  isPrivate: any;
}

const Chats: React.FC<allChatsProps> = ({
  onGroupClick,
  selectedGroup,
  isPrivate,
}) => {

  const [likedList, setLikedList] = useState<String[]>([]);
  const [chatList, setChatList] = useState<Chat[]>([]);
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

  const filteredChat = chatList.filter((chat) =>
    chat.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const customSort = (a: JSX.Element, b: JSX.Element) => {
    const aIndex = likedList.indexOf(a.props.chat.name);
    const bIndex = likedList.indexOf(b.props.chat.name);
    if (aIndex !== -1 && bIndex !== -1) {
      return bIndex - aIndex;
    } else if (aIndex !== -1) {
      return -1;
    } else if (bIndex !== -1) {
      return 1;
    } else {
      return 0;
    }
  };

  useEffect(() => {
    socket.emit("get-user-rooms", { username: username });
  }, [username]);

useEffect(() => {
    const chatListener = (data: { room: RoomDetails; pin: boolean }[]) => {
      const chats: Chat[] = [];
      const pinList: string[] = [];
      data.map((roomDetails) => {
        let chatName = "";
        if (roomDetails.room.private) {
          chatName =
            username !== undefined && typeof username === "string"
              ? getFriendName(username, roomDetails.room.room)
              : "";
        } else {
          chatName = `${roomDetails.room.room} (${roomDetails.room.userCount})`;
        }
        const chat: Chat = {
          roomName: roomDetails.room.room,
          name: chatName,
          message: roomDetails.room.latestMessage.message,
          isPrivate: roomDetails.room.private,
          pin: roomDetails.pin,
        };
        if (roomDetails.pin) {
          pinList.push(chatName);
        }
        chats.push(chat);
      });
      setChatList(chats);
      setLikedList(pinList);
    };
    socket.on("user-rooms", chatListener);

    return () => {
      socket.off("user-rooms", chatListener);
    };
  }, [username]);


  return (
    <div
      className={`${styles.font} bg-gradient-to-b from-[#F3D0D7] to-[#f8e7ea] dark:from-[#F3D0D7] dark:to-[#cd8896] w-1/3  border-borderColor`}
    >
      <div className="h-[20%] w-full border-borderColor items-center flex justify-center">
        <form
          className="w-4/5 flex items-center relative"
          onSubmit={handleSearch}
        >
          <input
            type="text"
            className="w-full h-12 rounded-2xl bg-[#F6F5F2] dark:bg-[#F3D0D7] dark:border-[#cd8896] dark:border-[2px] outline-none pl-5 text-gray-800 focus:outline-none pr-10"
            placeholder="Search"
            name="search_user"
          />
          <div className="absolute right-0 top-0 h-full w-10 text-center text-gray-400 pointer-events-none flex items-center justify-center">
            <SearchIcon className="h-6 w-6 text-fontBgColor" />
          </div>
        </form>
      </div>
      <div className="h-[80%] overflow-y-auto">
      {filteredChat
          .map((chat, index) => (
            <ChatItem
              key={index}
              setLikedList={setLikedList}
              onGroupClick={onGroupClick}
              selectedGroup={selectedGroup}
              isPrivate={isPrivate}
              chat={chat}
            />
          ))
          .sort(customSort)}
      </div>
    </div>
  );
};
export default Chats;
