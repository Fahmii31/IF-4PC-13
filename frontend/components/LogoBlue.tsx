import { Zap } from "lucide-react";

export default function LogoBlue() {
  return (
    <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center shadow-md">
      <Zap size={20} className="text-white" strokeWidth={1.5} />
    </div>
  );
}