"use client"

import { useEffect, useState } from "react"
import { Monitor, Smartphone, Globe, ExternalLink, RefreshCw, Sparkles, Check } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { cn } from "@/lib/utils"

export default function WebsiteManagement() {
  const [html, setHtml] = useState("")
  const [view, setView] = useState("desktop")
  const [isPublishing, setIsPublishing] = useState(false)
  const [isPublished, setIsPublished] = useState(true)

  useEffect(() => {
    const stored = localStorage.getItem("biz_website_html")
    if (stored) {
      setHtml(stored)
    } else {
      setHtml(`
        <div style="font-family: sans-serif; padding: 40px; text-align: center;">
          <h1>No website generated yet.</h1>
          <p>Please complete the setup wizard to generate your first site.</p>
        </div>
      `)
    }
  }, [])

  const handlePublish = () => {
    setIsPublishing(true)
    setTimeout(() => {
      setIsPublishing(false)
      setIsPublished(true)
    }, 1500)
  }

  return (
    <div className="h-full flex flex-col space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold font-headline">My Website</h2>
          <p className="text-muted-foreground mt-1">Preview and manage your AI-generated online storefront.</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" className="gap-2">
            <RefreshCw size={16} /> Regenerate
          </Button>
          <Button 
            className={cn("gap-2 min-w-[120px]", isPublished ? "bg-green-600 hover:bg-green-700" : "bg-primary")}
            onClick={handlePublish}
            disabled={isPublishing}
          >
            {isPublishing ? "Publishing..." : isPublished ? <><Check size={16}/> Published</> : "Publish Changes"}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-8 flex-1">
        <div className="col-span-12 lg:col-span-8 space-y-4 flex flex-col">
          <Card className="border shadow-sm flex-1 flex flex-col overflow-hidden">
            <CardHeader className="bg-slate-50 border-b py-3 px-4 flex flex-row items-center justify-between space-y-0">
              <div className="flex items-center gap-2">
                <div className="flex gap-1.5 mr-4">
                  <div className="size-3 rounded-full bg-red-400"></div>
                  <div className="size-3 rounded-full bg-yellow-400"></div>
                  <div className="size-3 rounded-full bg-green-400"></div>
                </div>
                <div className="bg-white px-3 py-1 rounded text-xs text-muted-foreground border flex items-center gap-2 min-w-[240px]">
                  <Globe size={12} /> preview.bizspark.ai/my-business
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Tabs value={view} onValueChange={setView}>
                  <TabsList className="bg-transparent border">
                    <TabsTrigger value="desktop" className="size-8 p-0"><Monitor size={16} /></TabsTrigger>
                    <TabsTrigger value="mobile" className="size-8 p-0"><Smartphone size={16} /></TabsTrigger>
                  </TabsList>
                </Tabs>
                <Button variant="ghost" size="icon"><ExternalLink size={16} /></Button>
              </div>
            </CardHeader>
            <CardContent className="p-0 flex-1 bg-slate-100 flex justify-center overflow-auto">
              <div 
                className={cn(
                  "bg-white transition-all duration-300 shadow-2xl my-8",
                  view === "desktop" ? "w-full max-w-5xl" : "w-[375px]"
                )}
                style={{ minHeight: "100%" }}
              >
                <iframe 
                  srcDoc={html} 
                  className="w-full h-full border-none pointer-events-none"
                  style={{ minHeight: "800px" }}
                />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="col-span-12 lg:col-span-4 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Website Configuration</CardTitle>
              <CardDescription>Customize how your site appears online.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Site Title</label>
                <input className="w-full p-2 border rounded-md text-sm" defaultValue="Sunny Morning Bakery" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Domain</label>
                <div className="flex gap-2">
                  <div className="flex-1 p-2 border bg-slate-50 rounded-md text-sm text-muted-foreground truncate">
                    sunnymorning.bizspark.ai
                  </div>
                  <Button variant="outline" size="sm">Change</Button>
                </div>
              </div>
              <div className="pt-4 border-t">
                <Button className="w-full bg-primary/10 text-primary hover:bg-primary hover:text-white border-primary/20">
                  <Sparkles size={16} className="mr-2" /> AI Editor Assistant
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Analytics Highlights</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {[
                { label: "Bounces", value: "12%" },
                { label: "Avg. Session", value: "2m 14s" },
                { label: "Conv. Rate", value: "3.2%" }
              ].map((m, i) => (
                <div key={i} className="flex justify-between items-center text-sm border-b pb-2 last:border-0">
                  <span className="text-muted-foreground">{m.label}</span>
                  <span className="font-bold">{m.value}</span>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
