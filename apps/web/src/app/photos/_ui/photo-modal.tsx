"use client";

import { Dialog } from "@kkhys/ui/dialog";
import { useRouter } from "next/navigation";

export const PhotoModal = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const router = useRouter();
  const handleOpenChange = () => router.back();

  return (
    <Dialog defaultOpen={true} open={true} onOpenChange={handleOpenChange}>
      <div
        onClick={() => router.back()}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
          }
        }}
      >
        {children}
      </div>
    </Dialog>
  );
};
