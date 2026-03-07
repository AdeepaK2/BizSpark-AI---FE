"use client"

import { useEffect, useState } from "react"
import { useRouter, usePathname } from "next/navigation"
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar"
import { DashboardSidebar } from "@/components/dashboard-sidebar"
import { Toaster } from "@/components/ui/toaster"
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue,
  SelectSeparator
} from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Plus, Building2, ChevronDown } from "lucide-react"
import Link from "next/link"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()
  const pathname = usePathname()
  const [businesses, setBusinesses] = useState<any[]>([])
  const [activeId, setActiveId] = useState<string>("")
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    const list = JSON.parse(localStorage.getItem("biz_list") || "[]")
    const currentId = localStorage.getItem("active_biz_id") || (list[0]?.id || "")
    
    setBusinesses(list)
    setActiveId(currentId)
    setIsLoaded(true)

    // Redirect to setup if no businesses exist
    if (list.length === 0 && pathname !== "/setup") {
      router.push("/setup")
    }
  }, [pathname, router])

  const handleSwitch = (id: string) => {
    if (id === "new_business") {
      router.push("/setup")
      return
    }
    localStorage.setItem("active_biz_id", id)
    setActiveId(id)
    window.location.reload() // Refresh context for all components
  }

  if (!isLoaded) return null

  return (
    <SidebarProvider>
      <DashboardSidebar />
      <SidebarInset className="bg-background">
        <div className="flex flex-col h-full min-h-screen">
          <header className="h-16 border-b bg-card px-8 flex items-center justify-between sticky top-0 z-30">
            <div className="flex items-center gap-6">
              <h1 className="font-semibold text-lg hidden md:block">Dashboard</h1>
              {businesses.length > 0 && (
                <div className="flex items-center gap-2">
                  <Select value={activeId} onValueChange={handleSwitch}>
                    <SelectTrigger className="w-[240px] h-10 bg-slate-50 border-slate-200 hover:bg-slate-100 transition-colors">
                      <div className="flex items-center gap-2 truncate">
                        <div className="size-6 rounded bg-primary/10 flex items-center justify-center">
                          <Building2 size={12} className="text-primary" />
                        </div>
                        <SelectValue placeholder="Select Business" />
                      </div>
                    </SelectTrigger>
                    <SelectContent>
                      {businesses.map((biz) => (
                        <SelectItem key={biz.id} value={biz.id} className="cursor-pointer">
                          <span className="font-medium">{biz.name}</span>
                        </SelectItem>
                      ))}
                      <SelectSeparator />
                      <SelectItem value="new_business" className="cursor-pointer text-primary focus:text-primary focus:bg-primary/5">
                        <div className="flex items-center gap-2 font-bold">
                          <Plus size={14} />
                          <span>Add New Business</span>
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}
            </div>
            <div className="flex items-center gap-4">
              <div className="flex flex-col items-end mr-2">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-tighter">Pro Account</span>
                <span className="text-sm font-medium">Jane Doe</span>
              </div>
              <div className="h-10 w-10 rounded-full bg-primary flex items-center justify-center text-white font-bold text-sm shadow-md ring-2 ring-white">
                JD
              </div>
            </div>
          </header>
          <main className="flex-1 overflow-auto p-8">
            {children}
          </main>
        </div>
      </SidebarInset>
      <Toaster />
    </SidebarProvider>
  )
}
