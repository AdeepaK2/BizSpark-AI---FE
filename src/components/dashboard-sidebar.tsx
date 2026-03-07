"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { 
  LayoutDashboard, 
  Globe, 
  Share2, 
  Package, 
  Settings, 
  ChevronRight,
  Zap,
  ExternalLink
} from "lucide-react"
import { cn } from "@/lib/utils"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
} from "@/components/ui/sidebar"

const menuItems = [
  { icon: LayoutDashboard, label: "Overview", href: "/dashboard" },
  { icon: Globe, label: "My Website", href: "/dashboard/website" },
  { icon: Share2, label: "Social Media", href: "/dashboard/social" },
  { icon: Package, label: "Products", href: "/dashboard/products" },
  { icon: Settings, label: "Domains", href: "/dashboard/domains" },
]

export function DashboardSidebar() {
  const pathname = usePathname()

  return (
    <Sidebar variant="inset" collapsible="icon">
      <SidebarHeader className="h-16 flex items-center px-6">
        <Link href="/" className="flex items-center gap-2 font-bold text-xl text-primary">
          <Zap className="fill-primary text-primary" size={24} />
          <span className="group-data-[collapsible=icon]:hidden">BizSpark AI</span>
        </Link>
      </SidebarHeader>
      <SidebarSeparator />
      <SidebarContent>
        <SidebarMenu className="px-2 pt-4">
          {menuItems.map((item) => (
            <SidebarMenuItem key={item.href}>
              <SidebarMenuButton 
                asChild 
                isActive={pathname === item.href}
                tooltip={item.label}
              >
                <Link href={item.href}>
                  <item.icon className="size-5" />
                  <span>{item.label}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter className="p-4">
        <div className="bg-primary/5 rounded-lg p-4 group-data-[collapsible=icon]:hidden">
          <p className="text-xs font-semibold text-primary uppercase tracking-wider mb-2">Pro Plan</p>
          <p className="text-xs text-muted-foreground mb-3">Get advanced AI capabilities and unlimited social posts.</p>
          <button className="w-full py-2 bg-primary text-primary-foreground text-xs font-medium rounded-md hover:bg-primary/90 transition-colors">
            Upgrade Now
          </button>
        </div>
      </SidebarFooter>
    </Sidebar>
  )
}