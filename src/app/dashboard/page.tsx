
"use client"

import { useEffect, useState } from "react"
import {
  Globe,
  Share2,
  Eye,
  ArrowUpRight,
  TrendingUp,
  Calendar,
  Sparkles
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { cn } from "@/lib/utils"
import { apiClient } from "@/lib/api-client"

export default function DashboardOverview() {
  const [activeBiz, setActiveBiz] = useState<any>(null)

  useEffect(() => {
    const fetchBiz = async () => {
      const activeId = localStorage.getItem("active_biz_id")
      if (activeId) {
        try {
          const res = await apiClient.get(`/business/${activeId}`)
          setActiveBiz(res.data)
        } catch (e) {
          console.error(e)
        }
      }
    }
    fetchBiz()
  }, [])

  if (!activeBiz) return null

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold font-headline">Welcome back, {activeBiz.name}!</h2>
          <p className="text-muted-foreground mt-1 text-lg">Here's how {activeBiz.name} is performing today.</p>
        </div>
        <Button className="bg-primary hover:bg-primary/90 gap-2">
          <Sparkles size={16} /> New AI Post
        </Button>
      </div>

      <div className="grid md:grid-cols-4 gap-6">
        {[
          { label: "Website Visits", value: "1,248", trend: "+12%", icon: Eye, color: "text-blue-600" },
          { label: "Social Reach", value: "4,592", trend: "+24%", icon: TrendingUp, color: "text-green-600" },
          { label: "New Leads", value: "32", trend: "+8%", icon: ArrowUpRight, color: "text-primary" },
          { label: "Scheduled Posts", value: "12", trend: "On track", icon: Calendar, color: "text-orange-600" }
        ].map((stat, i) => (
          <Card key={i} className="border shadow-sm">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between mb-4">
                <div className={cn("p-2 rounded-lg bg-slate-100", stat.color)}>
                  <stat.icon size={20} />
                </div>
                <span className="text-xs font-bold text-green-600 bg-green-50 px-2 py-1 rounded-md">{stat.trend}</span>
              </div>
              <h3 className="text-2xl font-bold">{stat.value}</h3>
              <p className="text-sm text-muted-foreground">{stat.label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle>Website Status</CardTitle>
            <CardDescription>Your generated website health and activity.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
              <div className="flex items-center gap-3">
                <Globe className="text-primary" />
                <div>
                  <p className="font-bold text-sm">Main Site: {activeBiz.name.toLowerCase().replace(/\s/g, "")}.bizspark.ai</p>
                  <p className="text-xs text-muted-foreground">Last updated: 2 hours ago</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="size-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-xs font-medium text-green-600">Active</span>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>SEO Optimization</span>
                <span className="font-bold">85%</span>
              </div>
              <Progress value={85} className="h-2" />
            </div>

            <Button variant="outline" className="w-full">Edit Website Sections</Button>
          </CardContent>
        </Card>

        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle>Recent Social Content</CardTitle>
            <CardDescription>AI generated posts waiting for your review.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {[
              { type: "Instagram", title: "Check out our latest update!", date: "Drafted 10m ago" },
              { type: "Facebook", title: "Join us this Friday!", date: "Drafted 1h ago" },
              { type: "Twitter", title: "Exciting news coming soon...", date: "Drafted 3h ago" },
            ].map((post, i) => (
              <div key={i} className="flex items-center justify-between p-3 border rounded-lg hover:bg-slate-50 transition-colors cursor-pointer group">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-slate-100 rounded text-primary group-hover:bg-primary group-hover:text-white">
                    <Share2 size={16} />
                  </div>
                  <div>
                    <p className="font-bold text-sm">{post.title}</p>
                    <p className="text-xs text-muted-foreground">{post.type} • {post.date}</p>
                  </div>
                </div>
                <Button size="sm" variant="ghost">Review</Button>
              </div>
            ))}
            <Button variant="link" className="w-full text-primary">View Content Calendar</Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
