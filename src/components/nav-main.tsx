"use client";

import { type Icon } from "@tabler/icons-react";

import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { useHashRoute } from "@/hooks/use-hash-route";

export function NavMain({
  items,
}: {
  items: {
    title: string;
    url: [string, string, ...string[]];
    icon?: Icon;
  }[];
}) {
  const [hashRoute, setHashRoute] = useHashRoute(items[0].url);
  return (
    <SidebarGroup>
      <SidebarGroupContent className="flex flex-col gap-2">
        <SidebarMenu>
          {items.map((item) => (
            <SidebarMenuItem
              className={
                hashRoute.length === item.url.length &&
                hashRoute.every((seg, i) => seg === item.url[i])
                  ? "dark:bg-white/5 bg-black/5 rounded-md"
                  : ""
              }
              key={item.title}
            >
              <SidebarMenuButton
                onClick={() => setHashRoute(item.url)}
                tooltip={item.title}
              >
                {item.icon && <item.icon />}
                <span>{item.title}</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}
