import hashString from "@/utils/hashString";
import Image from "next/image";
import styles from "@/styles/style.module.css";

interface Group {
  groupName: string;
  people: number;
}
interface GroupItemProps {
  onGroupClick: (groupName: string, isPrivate: any) => void;
  group: Group;
  selectedGroup: string;
  isPrivate: any;
}

const GroupItem: React.FC<GroupItemProps> = ({
  onGroupClick,
  group,
  selectedGroup,
  isPrivate,
}) => {
  return (
    <div
      className={`${styles.font} h-28 w-full cursor-pointer items-center flex ${
        group.groupName === selectedGroup && !isPrivate
          ? "bg-pink-900 bg-opacity-10"
          : "hover:bg-pink-500 hover:bg-opacity-5"
      } transition duration-200`}
      onClick={() => {
        onGroupClick(group.groupName, false);
        console.log(group.groupName);
      }}
    >
      <Image
        src={`/G${
          group.groupName ? hashString(group.groupName as string) % 9 : 0
        }.png`}
        alt=""
        width={60}
        height={50}
        className="ml-6"
      ></Image>
      <div className="ml-6">
        <p
          className={`text-gray-800 text-xl ${
            group.groupName === selectedGroup && !isPrivate ? "font-bold" : ""
          }`}
        >
          {`${group.groupName} (${group.people})`}
        </p>
      </div>
    </div>
  );
};

export default GroupItem;
