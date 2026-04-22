import { Zap } from "lucide-react";
export default function Logo() {
  return (
    <div className="flex items-center gap-2">
      <div className="w-8 h-8 bg-white rounded-md flex items-center justify-center shadow-sm">
  <Zap size={17} className="text-blue-600" />
</div>
      <span className="font-semibold text-white text-lg">
        VoltCore
      </span>
    </div>
  );
}