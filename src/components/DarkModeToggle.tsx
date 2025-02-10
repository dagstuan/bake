"use client";

import * as React from "react";
import { useTheme } from "next-themes";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { SunIcon } from "./icons/SunIcon";
import { MoonIcon } from "./icons/MoonIcon";
import { SunMoonIcon } from "./icons/SunMoonIcon";

export function DarkModeToggle() {
  const { theme, setTheme } = useTheme();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon">
          <SunIcon className="h-[1.2rem] w-[1.2rem] scale-100 rotate-0 transition-all dark:scale-0 dark:-rotate-90" />
          <MoonIcon className="absolute h-[1.2rem] w-[1.2rem] scale-0 rotate-90 transition-all dark:scale-100 dark:rotate-0" />
          <span className="sr-only">Velg tema</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
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
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
