import Image from "next/image";
import { HeartIcon } from "@heroicons/react/24/outline";
import { HeartIcon as HeartIconSolid } from "@heroicons/react/24/solid";
import { useState } from "react";
import { Chat } from "../Left-Sidebar/list-chat";
import { socket } from "../login";
import { useRouter } from "next/router";
import styles from "@/styles/style.module.css";

interface GroupItemProps {
  chat: Chat;
  setLikedList: React.Dispatch<React.SetStateAction<String[]>>;
  onGroupClick: (groupName: string, isPrivate: any) => void;
  isPrivate: any;
  selectedGroup: string;
}

const ChatItem: React.FC<GroupItemProps> = ({
  chat,
  setLikedList,
  onGroupClick,
  isPrivate,
  selectedGroup,
}) => {
  const [isHeartActive, setIsHeartActive] = useState(chat.pin);
  const router = useRouter();
  const { username } = router.query;

  const handleHeartClick = (e: React.MouseEvent<SVGElement>) => {
    e.stopPropagation();  // Stop the click event from propagating to parent elements
    socket.emit("pin-chat", {
      username: username,
      room: chat.roomName,
      pinStatus: !isHeartActive,
    });
    setIsHeartActive(!isHeartActive);
    if (isHeartActive) {
      setLikedList((prev) => prev.filter((item) => item !== chat.name));
    } else {
      setLikedList((prev) => [...prev, chat.name]);
    }
  };
  console.log(chat);
  return (
    <div
      className={`${styles.font} h-28 w-full flex cursor-pointer ${
        selectedGroup === (chat.isPrivate ? chat.name : chat.roomName) && isPrivate === chat.isPrivate
          ? "bg-pink-900 bg-opacity-10"
          : "hover:bg-pink-500 hover:bg-opacity-5"
      } transition duration-250`}
      onClick={() => {
        const name = chat.isPrivate ? chat.name : chat.roomName;
        onGroupClick(name, chat.isPrivate);
      }}
    >
      <div className="flex items-center w-full">
        <Image
          src={`/frame--0.png`}
          alt=""
          width={60}
          height={50}
          className="ml-6"
        />
        <p
          className={`text-gray-800 text-xl mt-2 ml-6 ${
            selectedGroup === (chat.isPrivate ? chat.name : chat.roomName)
              ? "font-bold"
              : ""
          }`}
        >
          {chat.name}
        </p>
      </div>
      <div className="ml-auto flex items-center">
        {isHeartActive ? (
          <HeartIconSolid
            className="h-8 w-8 mr-6 text-[#E240A2]"
            onClick={handleHeartClick}
          />
        ) : (
          <HeartIcon
            className="h-8 w-8 mr-6 text-gray-500"
            onClick={handleHeartClick}
          />
        )}
      </div>
    </div>
  );
};

export default ChatItem;
