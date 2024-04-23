import React, { FormEvent, useEffect, useState } from "react";
import { socket } from "../login";
import { Message } from "../Chat-Window/chat-window";
import { useRouter } from "next/router";
import GroupItem from "../Component/group";
import styles from "@/styles/style.module.css";
import SearchIcon from "@mui/icons-material/Search";

interface Group {
  groupName: string;
  people: number;
}

interface ChatGroupsProps {
  onGroupClick: (groupName: string, isprivate: any) => void;
  selectedGroup: string;
  isPrivate: any;
}

export type RoomDetails = {
  room: string;
  userCount: number;
  latestMessage: Message;
  private: boolean;
};

const Groups: React.FC<ChatGroupsProps> = ({
  onGroupClick,
  selectedGroup,
  isPrivate,
}) => {

  const [groupList, setGroupList] = useState<Group[]>([]);
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

  const filteredGroups = groupList.filter((group) =>
    group.groupName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  useEffect(() => {
    socket.emit("get-all-rooms");
  }, []);

  useEffect(() => {
    const groupListener = (data: RoomDetails[]) => {
      const allGroup: Group[] = [];
      data.map((room) => {
        const group: Group = { groupName: room.room, people: room.userCount };
        allGroup.push(group);
      });
      setGroupList(allGroup);
    };

    socket.on("rooms", groupListener);
    return () => {
      socket.off("rooms", groupListener);
    };
  }, []);
  const validateGroupName = (groupName: string): string => {
    groupName = "G: " + groupName;

    return groupName;
  };

  const handleCreateGroup = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const groupName = e.currentTarget.elements.namedItem(
      "group_name"
    ) as HTMLInputElement;

    if (groupName.value.trim() === "") {
      return;
    }
    if (groupName) {
      const response = socket.emit("join-room", {
        username: username,
        room: validateGroupName(groupName.value),
      });
      console.log(response);
    }
    socket.emit("get-all-rooms");
    groupName.value = "";
  };

  return (
    <div
      className={`${styles.font} bg-gradient-to-b from-[#F3D0D7] to-[#f8e7ea] dark:from-[#F3D0D7] dark:to-[#cd8896] w-1/3  border-borderColor`}
    >
      <div className="h-[20%] w-full mt-4 border-borderColor items-center flex justify-center flex-col">
        <form
          className="w-4/5 flex items-center relative"
          onSubmit={handleSearch}
        >
          <input
            type="text"
            className="w-full h-12 rounded-2xl bg-[#F6F5F2] dark:bg-[#F3D0D7] dark:border-[#cd8896] dark:border-[2px] pl-5 pr-10 outline-none"
            placeholder="Search"
            name="search_user"
          />
          <div className="absolute right-0 top-0 h-full w-10 text-center text-gray-400 pointer-events-none flex items-center justify-center">
            <SearchIcon className="h-6 w-6 text-fontBgColor" />
          </div>
        </form>

        <form
          className="w-11/12 items-center flex justify-center mt-3"
          onSubmit={handleCreateGroup}
        >
          <input
            type="text"
            className="w-full h-12 rounded-2xl bg-[#F6F5F2] dark:bg-[#F3D0D7] dark:border-[#cd8896] dark:border-[2px] outline-none pl-5"
            placeholder="Enter Group Name"
            name="group_name"
          />
          <button
            type="submit"
            name="all-chats"
            className="w-20 h-12 rounded-3xl text-white ml-2 bg-[#E240A2] hover:bg-opacity-60 transition duration-300"
          >
            Create
          </button>
        </form>
      </div>
      <div className="h-[80%] overflow-y-auto">
        {filteredGroups.map((group, index) => (
          <GroupItem
            onGroupClick={onGroupClick}
            key={index}
            group={group}
            selectedGroup={selectedGroup}
            isPrivate={isPrivate}
          />
        ))}
      </div>
    </div>
  );
};

export default Groups;
