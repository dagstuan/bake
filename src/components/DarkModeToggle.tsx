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
import { MoonIcon, SunIcon } from "@radix-ui/react-icons";
import { cn } from "@/lib/utils";

export function DarkModeToggle() {
  const { theme, setTheme } = useTheme();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon">
          <SunIcon className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <MoonIcon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
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
          Lyst tema
        </DropdownMenuItem>
        <DropdownMenuItem
          className={cn({
            "bg-primary text-primary-foreground": theme === "dark",
          })}
          onClick={() => {
            setTheme("dark");
          }}
        >
          Mørkt tema
        </DropdownMenuItem>
        <DropdownMenuItem
          className={cn({
            "bg-primary text-primary-foreground": theme === "system",
          })}
          onClick={() => {
            setTheme("system");
          }}
        >
          Systemstyrt
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
