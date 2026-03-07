
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
  SelectValue 
} from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Plus, Building2 } from "lucide-react"
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

  useEffect(() => {
    const list = JSON.parse(localStorage.getItem("biz_list") || "[]")
    const currentId = localStorage.getItem("active_biz_id") || ""
    
    setBusinesses(list)
    setActiveId(currentId)

    // Redirect if no businesses exist
    if (list.length === 0 && pathname !== "/setup") {
      router.push("/setup")
    }
  }, [pathname, router])

  const handleSwitch = (id: string) => {
    localStorage.setItem("active_biz_id", id)
    setActiveId(id)
    // Force a reload or state sync for child components
    window.dispatchEvent(new Event("storage"))
    window.location.reload()
  }

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
                    <SelectTrigger className="w-[200px] h-9 bg-slate-50">
                      <div className="flex items-center gap-2 truncate">
                        <Building2 size={14} className="text-primary" />
                        <SelectValue placeholder="Select Business" />
                      </div>
                    </SelectTrigger>
                    <SelectContent>
                      {businesses.map((biz) => (
                        <SelectItem key={biz.id} value={biz.id}>
                          {biz.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full border border-dashed" asChild>
                    <Link href="/setup"><Plus size={16} /></Link>
                  </Button>
                </div>
              )}
            </div>
            <div className="flex items-center gap-4">
              <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center text-white font-bold text-xs shadow-sm">
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
