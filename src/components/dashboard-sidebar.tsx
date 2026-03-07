
"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useEffect, useState } from "react"
import { 
  LayoutDashboard, 
  Globe, 
  Share2, 
  Package, 
  Settings, 
  Zap,
  Building2
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
  const [activeName, setActiveName] = useState("BizSpark")

  useEffect(() => {
    const list = JSON.parse(localStorage.getItem("biz_list") || "[]")
    const activeId = localStorage.getItem("active_biz_id")
    const current = list.find((b: any) => b.id === activeId)
    if (current) setActiveName(current.name)
  }, [])

  return (
    <Sidebar variant="inset" collapsible="icon">
      <SidebarHeader className="h-16 flex items-center px-4 overflow-hidden">
        <Link href="/" className="flex items-center gap-3 font-bold text-xl text-primary">
          <div className="bg-primary p-1 rounded-lg">
            <Zap className="fill-white text-white" size={18} />
          </div>
          <span className="truncate group-data-[collapsible=icon]:hidden">
            {activeName}
          </span>
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
        <div className="bg-slate-50 border rounded-lg p-4 group-data-[collapsible=icon]:hidden">
          <div className="flex items-center gap-2 mb-2 text-primary">
            <Building2 size={14} />
            <p className="text-[10px] font-bold uppercase tracking-wider">Business Mode</p>
          </div>
          <p className="text-xs text-muted-foreground mb-3 leading-relaxed">You are managing {activeName}.</p>
          <button className="w-full py-2 bg-primary text-white text-xs font-bold rounded-md hover:bg-primary/90 transition-all shadow-sm shadow-primary/20">
            Pro Active
          </button>
        </div>
      </SidebarFooter>
    </Sidebar>
  )
}
