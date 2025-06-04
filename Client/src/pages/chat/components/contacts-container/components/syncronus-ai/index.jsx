import syncAI from "@/assets/syncAI.jpeg";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { useAppStore } from "@/store";

const SyncronusAI = () => {
  const { setSelectedChatType } = useAppStore();

  const handleClick = () => {
    setSelectedChatType("AI");
  };
  return (
    <div
      className={`pl-10 py-2 transition-all duration-300 cursor-pointer`}
      onClick={() => handleClick()}
    >
      <div className="flex gap-2 items-center justify-start text-neutral-300">
        <Avatar className="h-10 w-10 rounded-full overflow-hidden">
          <AvatarImage
            src={syncAI}
            alt="Syncronus-AI"
            className="object-cover w-full h-full bg-black"
          />
        </Avatar>
        <span>Syncronus AI</span>
      </div>
    </div>
  );
};

export default SyncronusAI;
