"use client";

import { useTheme } from "next-themes";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { SunIcon } from "../icons/SunIcon";
import { MoonIcon } from "../icons/MoonIcon";
import { SunMoonIcon } from "../icons/SunMoonIcon";

export const DarkModeToggleContent = () => {
  const { theme, setTheme } = useTheme();

  return (
    <>
      <DropdownMenuItem
        className={cn({
          "bg-primary text-primary-foreground": theme === "light",
        })}
        onClick={() => {
          setTheme("light");
        }}
      >
        <SunIcon /> Lyst tema
      </DropdownMenuItem>
      <DropdownMenuItem
        className={cn({
          "bg-primary text-primary-foreground": theme === "dark",
        })}
        onClick={() => {
          setTheme("dark");
        }}
      >
        <MoonIcon /> Mørkt tema
      </DropdownMenuItem>
      <DropdownMenuItem
        className={cn({
          "bg-primary text-primary-foreground": theme === "system",
        })}
        onClick={() => {
          setTheme("system");
        }}
      >
        <SunMoonIcon /> Automatisk
      </DropdownMenuItem>
    </>
  );
};
