import React, { useState, createContext, useContext } from "react";
import { Link } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, X } from "lucide-react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface Links {
  label: string;
  href: string;
  icon: React.JSX.Element | React.ReactNode;
}

interface SidebarContextProps {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  animate: boolean;
}

const SidebarContext = createContext<SidebarContextProps | undefined>(undefined);

export const useSidebar = () => {
  const context = useContext(SidebarContext);
  if (!context) {
    throw new Error("useSidebar must be used within a SidebarProvider");
  }
  return context;
};

export const SidebarProvider = ({
  children,
  open: openProp,
  setOpen: setOpenProp,
  animate = true,
}: {
  children: React.ReactNode;
  open?: boolean;
  setOpen?: React.Dispatch<React.SetStateAction<boolean>>;
  animate?: boolean;
}) => {
  const [openState, setOpenState] = useState(false);

  const open = openProp !== undefined ? openProp : openState;
  const setOpen = setOpenProp !== undefined ? setOpenProp : setOpenState;

  return (
    <SidebarContext.Provider value={{ open, setOpen, animate }}>
      {children}
    </SidebarContext.Provider>
  );
};

export const Sidebar = ({
  children,
  open,
  setOpen,
  animate,
}: {
  children: React.ReactNode;
  open?: boolean;
  setOpen?: React.Dispatch<React.SetStateAction<boolean>>;
  animate?: boolean;
}) => {
  return (
    <SidebarProvider open={open} setOpen={setOpen} animate={animate}>
      {children}
    </SidebarProvider>
  );
};

export const SidebarBody = (props: React.ComponentProps<typeof motion.div>) => {
  return (
    <>
      <DesktopSidebar {...props} />
      <MobileSidebar {...(props as React.ComponentProps<"div">)} />
    </>
  );
};

export const DesktopSidebar = ({
  className,
  children,
  ...props
}: React.ComponentProps<typeof motion.div>) => {
  const { open, setOpen, animate } = useSidebar();
  return (
    <motion.div
      className={cn(
        "px-4 py-4 hidden md:flex md:flex-col bg-[#1c1c1c] border-r border-[#2e2e2e] w-[300px] flex-shrink-0 z-30 min-h-screen",
        className
      )}
      animate={{
        width: animate ? (open ? "300px" : "72px") : "300px",
      }}
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
      {...props}
    >
      {children}
    </motion.div>
  );
};

export const MobileSidebar = ({
  className,
  children,
  ...props
}: React.ComponentProps<"div">) => {
  const { open, setOpen } = useSidebar();
  return (
    <div
      className={cn(
        "h-14 px-4 py-4 flex flex-row md:hidden items-center justify-between bg-[#1c1c1c] border-b border-[#2e2e2e] w-full",
        className
      )}
      {...props}
    >
      <div className="flex justify-end z-20 w-full">
        <button
          onClick={() => setOpen(!open)}
          className="text-slate-200 hover:text-white p-1 rounded-lg bg-[#282828]"
        >
          {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ x: "-100%", opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: "-100%", opacity: 0 }}
            transition={{
              duration: 0.3,
              ease: "easeInOut",
            }}
            className={cn(
              "fixed h-full w-full inset-0 bg-[#1c1c1c] p-8 z-[100] flex flex-col justify-between border-r border-[#2e2e2e]",
              className
            )}
          >
            <div
              className="absolute right-6 top-6 z-50 text-slate-200 hover:text-white cursor-pointer p-1 rounded-lg bg-[#282828]"
              onClick={() => setOpen(false)}
            >
              <X className="w-5 h-5" />
            </div>
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export const SidebarLink = ({
  link,
  className,
  onClick,
  ...props
}: {
  link: Links;
  className?: string;
  onClick?: () => void;
  [key: string]: any;
}) => {
  const { open, animate } = useSidebar();
  const isHash = link.href.startsWith('#');

  const content = (
    <>
      <div className="flex items-center justify-center shrink-0">
        {link.icon}
      </div>

      <motion.span
        animate={{
          display: animate ? (open ? "inline-block" : "none") : "inline-block",
          opacity: animate ? (open ? 1 : 0) : 1,
        }}
        className="text-slate-300 group-hover/sidebar:text-white text-xs font-mono font-bold tracking-wide whitespace-pre inline-block !p-0 !m-0 transition duration-150"
      >
        {link.label}
      </motion.span>
    </>
  );

  const containerClassName = cn(
    "flex items-center justify-start gap-3 group/sidebar py-2.5 px-2 rounded-xl transition-all hover:bg-[#282828] cursor-pointer w-full text-left",
    className
  );

  if (isHash || onClick) {
    return (
      <div className={containerClassName} onClick={onClick} {...props}>
        {content}
      </div>
    );
  }

  return (
    <Link to={link.href} className={containerClassName} {...props}>
      {content}
    </Link>
  );
};
