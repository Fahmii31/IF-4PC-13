"use client";

type OverlayProps = {
  isOpen: boolean;
  onClose: () => void;
};

export default function Overlay({
  isOpen,
  onClose,
}: OverlayProps) {

  if (!isOpen) return null;

  return (
    <div
      className="
        fixed 
        inset-0 
        bg-black/50 
        z-40 
        md:hidden
        transition-opacity
        duration-300
      "
      onClick={onClose}
    />
  );
}