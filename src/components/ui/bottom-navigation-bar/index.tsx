import { navigate } from "astro:transitions/client";
import {
  ArrowDownToLineIcon,
  ArrowUpFromLineIcon,
  HouseIcon,
  PaintBucketIcon,
  SquarePenIcon,
  UserIcon,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { type RefObject, useEffect, useRef, useState } from "react";
import { cn } from "#/lib/ui";
import { useOnClickOutside } from "./use-on-click-outside";

const wrapperBaseStyle =
  "flex justify-between items-center backdrop-blur-2xl bg-background/70 text-foreground border border-white/20 shadow-[0_8px_32px_0_rgba(0,0,0,0.12)] before:absolute before:inset-0 before:rounded-[inherit] before:bg-gradient-to-b before:from-white/10 before:to-transparent before:pointer-events-none";

export const BottomNavigationBar = () => {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useOnClickOutside(ref as RefObject<HTMLDivElement>, () => setOpen(false));

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
      }

      if (event.metaKey && event.key.toLowerCase() === "m") {
        event.preventDefault();
        setOpen((prev) => !prev);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const handleTransition = async (href: string) => {
    setOpen(false);
    await navigate(href);
  };

  const buttonBaseStyle =
    "flex items-center justify-between w-full h-11 cursor-pointer px-4 font-medium rounded-lg transition-colors hover:bg-white/10 active:bg-white/5";

  return (
    <div className="fixed z-10 bottom-[4lvh] inset-x-0 flex items-end justify-center">
      <motion.button
        type="button"
        layoutId="wrapper"
        key="button"
        onClick={() => setOpen(true)}
        className={cn(
          "relative w-28 h-10 pl-3.5 pr-2.5 text-sm rounded-[19px] cursor-pointer outline-none overflow-hidden",
          wrapperBaseStyle,
        )}
        style={{ borderRadius: 19 }}
        whileTap={{ scale: 0.95 }}
        whileHover={{
          boxShadow: "0 12px 40px 0 rgba(0,0,0,0.15)",
          borderColor: "rgba(255,255,255,0.3)"
        }}
        initial={{ filter: "blur(0px)" }}
        animate={{ filter: open ? "blur(4px)" : "blur(0px)" }}
        transition={{ duration: 0.2, ease: "easeInOut" }}
      >
        <span>メニュー</span>
        <motion.div
          animate={{ rotate: open ? 180 : 0 }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
        >
          <ArrowUpFromLineIcon className="size-4" />
        </motion.div>
      </motion.button>
      <AnimatePresence>
        {open ? (
          <motion.div
            ref={ref}
            layoutId="wrapper"
            className={cn(
              "absolute flex-col w-56 rounded-[20px] p-2 overflow-hidden",
              wrapperBaseStyle,
            )}
            style={{ borderRadius: 20 }}
            initial={{ filter: "blur(8px)", opacity: 0, scale: 0.95 }}
            animate={{ filter: "blur(0px)", opacity: 1, scale: 1 }}
            exit={{ filter: "blur(8px)", opacity: 0, scale: 0.95 }}
            transition={{
              type: "spring",
              duration: 0.35,
              ease: "easeInOut",
            }}
          >
            <button
              type="button"
              onClick={() => handleTransition("/")}
              className={buttonBaseStyle}
            >
              ホーム
              <HouseIcon className="size-5" />
            </button>
            <button
              type="button"
              onClick={() => handleTransition("/blog")}
              className={buttonBaseStyle}
            >
              ブログ
              <SquarePenIcon className="size-5" />
            </button>
            <button
              type="button"
              onClick={() => handleTransition("/about")}
              className={buttonBaseStyle}
            >
              プロフィール
              <UserIcon className="size-5" />
            </button>
            <button
              type="button"
              onClick={() => handleTransition("/bucket-list")}
              className={buttonBaseStyle}
            >
              バケットリスト
              <PaintBucketIcon className="size-5" />
            </button>
            <motion.button
              type="button"
              onClick={() => setOpen(false)}
              className="grid place-content-center w-full h-10 cursor-pointer mt-2 rounded-[13px] bg-white/5 border border-white/10 backdrop-blur-sm transition-colors hover:bg-white/10 active:bg-white/5"
              whileTap={{ scale: 0.95 }}
            >
              <ArrowDownToLineIcon className="size-5" />
              <span className="sr-only">閉じる</span>
            </motion.button>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
};
