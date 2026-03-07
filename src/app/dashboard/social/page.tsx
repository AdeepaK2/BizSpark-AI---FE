"use client"

import { useState } from "react"
import { 
  Instagram, 
  Facebook, 
  Twitter, 
  Share2, 
  Plus, 
  CheckCircle2, 
  Clock, 
  Calendar,
  AlertCircle
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

const PLATFORMS = [
  { name: "Instagram", icon: Instagram, color: "text-pink-600", bg: "bg-pink-50", connected: true, followers: "2.4k" },
  { name: "Facebook", icon: Facebook, color: "text-blue-700", bg: "bg-blue-50", connected: true, followers: "1.2k" },
  { name: "TikTok", icon: Share2, color: "text-slate-900", bg: "bg-slate-100", connected: false },
  { name: "Twitter / X", icon: Twitter, color: "text-slate-900", bg: "bg-slate-100", connected: false },
]

export default function SocialMediaPage() {
  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold font-headline">Social Media Manager</h2>
        <p className="text-muted-foreground mt-1 text-lg">Centralized hub for all your business social accounts.</p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        {PLATFORMS.map((platform, i) => (
          <Card key={i} className="border shadow-sm overflow-hidden">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between mb-6">
                <div className={cn("p-3 rounded-xl", platform.bg, platform.color)}>
                  <platform.icon size={24} />
                </div>
                {platform.connected ? (
                  <Badge className="bg-green-100 text-green-700 border-green-200">Connected</Badge>
                ) : (
                  <Badge variant="outline" className="text-muted-foreground">Disconnected</Badge>
                )}
              </div>
              <h3 className="text-xl font-bold mb-1">{platform.name}</h3>
              <p className="text-sm text-muted-foreground mb-4">
                {platform.connected ? `${platform.followers} Followers` : "Not connected"}
              </p>
              <Button 
                variant={platform.connected ? "outline" : "default"} 
                className={cn("w-full", !platform.connected && "bg-primary hover:bg-primary/90")}
              >
                {platform.connected ? "Configure" : "Connect"}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Upcoming Queue</CardTitle>
                <CardDescription>Scheduled posts drafted by AI.</CardDescription>
              </div>
              <Button size="sm" variant="outline" className="gap-2"><Calendar size={14}/> Full Calendar</Button>
            </CardHeader>
            <CardContent className="space-y-4">
              {[
                { time: "Today, 4:00 PM", platform: "Instagram", title: "New Product: Artisanal Sourdough", status: "Review" },
                { time: "Tomorrow, 10:00 AM", platform: "Facebook", title: "Weekend Brunch Specials", status: "Scheduled" },
                { time: "Monday, 9:00 AM", platform: "Twitter", title: "Morning coffee rewards update", status: "Draft" },
              ].map((post, i) => (
                <div key={i} className="flex items-center justify-between p-4 border rounded-xl hover:bg-slate-50 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="flex flex-col items-center justify-center w-12 text-center border-r pr-4">
                      <Clock size={16} className="text-muted-foreground mb-1" />
                      <span className="text-[10px] font-bold uppercase">{post.time.split(',')[0]}</span>
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-bold text-primary uppercase tracking-wider">{post.platform}</span>
                        {post.status === "Review" && <Badge className="bg-yellow-100 text-yellow-700 hover:bg-yellow-100 border-none scale-75 h-5">Action Required</Badge>}
                      </div>
                      <p className="font-bold">{post.title}</p>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm">Edit</Button>
                </div>
              ))}
              <Button className="w-full h-12 dashed border-2 border-dashed bg-slate-50 hover:bg-slate-100 text-muted-foreground font-medium gap-2">
                <Plus size={16} /> Create Custom Post
              </Button>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Social Health</CardTitle>
              <CardDescription>Engagement across platforms.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Posting Frequency</span>
                  <span className="text-green-600 font-bold">Good</span>
                </div>
                <Progress value={85} className="h-2" />
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Avg. Engagement</span>
                  <span className="text-primary font-bold">4.2%</span>
                </div>
                <Progress value={60} className="h-2" />
              </div>
              <div className="p-4 bg-primary/5 rounded-xl flex gap-3 border border-primary/10">
                <AlertCircle className="text-primary shrink-0" size={20} />
                <p className="text-xs text-slate-700 leading-relaxed">
                  <strong>AI Tip:</strong> Posts with images get 4x more engagement. We recommend adding photos to your next 3 scheduled drafts.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
