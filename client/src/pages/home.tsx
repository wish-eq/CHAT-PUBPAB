import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Sidebar from "./Left-Sidebar/sidebar";
import ChatWindow from "./Chat-Window/chat-window";

const Home: React.FC = () => {
  const [showChatWindow, setShowChatWindow] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState("");
  const [isPrivate, setIsPrivate] = useState<any>(undefined);
  const handleGroupClick = (groupName: string, isprivate: any) => {
    setSelectedGroup(groupName);
    setShowChatWindow(true);
    setIsPrivate(isprivate);
};

  return (
    <div className="h-screen flex-col flex">
      <div className="h-[100%] flex-1 flex-row flex">
        <Sidebar
          onGroupClick={handleGroupClick}
          selectedGroup={selectedGroup}
          isPrivate={isPrivate}
        />
        {showChatWindow ? (
          <ChatWindow selectedGroup={selectedGroup} isPrivate={isPrivate} />
        ) : (
          <div className="bg-gradient-to-r from-[#F6F5F2] to-[#F3D0D7] dark:from-[#F3D0D7] dark:to-[#cd8896] w-2/3 ">
            <div className="w-full h-full justify-center items-center flex-col flex">
              <Image
                src="/barby-logo.png"
                alt=""
                width={200}
                height={200}
                className="opacity-50"
              ></Image>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
