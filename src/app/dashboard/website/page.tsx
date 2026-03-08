
"use client"

import { useEffect, useState, useRef } from "react"
import { Monitor, Smartphone, Globe, ExternalLink, RefreshCw, Sparkles, Check } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { cn } from "@/lib/utils"
import { apiClient } from "@/lib/api-client"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import { Store, Upload } from "lucide-react"

export default function WebsiteManagement() {
  const { toast } = useToast()
  const [activeBiz, setActiveBiz] = useState<any>(null)
  const [view, setView] = useState("desktop")
  const [isPublishing, setIsPublishing] = useState(false)
  const [isPublished, setIsPublished] = useState(false)
  const [deployStatus, setDeployStatus] = useState<string | null>(null)
  const [isSaving, setIsSaving] = useState(false)

  const pollingIntervalObj = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    return () => {
      // Cleanup interval if unmounting
      if (pollingIntervalObj.current) clearInterval(pollingIntervalObj.current)
    }
  }, [])

  const [templates, setTemplates] = useState<any[]>([])
  const [templateId, setTemplateId] = useState<string>("")
  const [cmsData, setCmsData] = useState<Record<string, any>>({})

  useEffect(() => {
    const fetchBiz = async () => {
      const activeId = localStorage.getItem("active_biz_id")
      if (activeId) {
        try {
          const res = await apiClient.get(`/business/${activeId}`)
          if (res.data) {
            setActiveBiz(res.data)
            if (res.data.websites && res.data.websites.length > 0) {
              const website = res.data.websites[0]
              setTemplateId(website.templateId)
              setCmsData(website.cmsData || {})
            }
            return
          }
        } catch (e) {
          console.error(e)
        }
      }

      setActiveBiz({
        name: "My Business",
        html: `<div style="padding: 40px; text-align: center;"><h1>No website found.</h1></div>`
      })
    }
    fetchBiz()

    const fetchTemplates = async () => {
      try {
        const res = await apiClient.get('/templates')
        if (res.data) setTemplates(res.data)
      } catch (e) {
        console.error("Failed to load templates", e)
      }
    }
    fetchTemplates()
  }, [])

  const handleSaveConfig = async () => {
    setIsSaving(true)
    try {
      await apiClient.post(`/business/${activeBiz.id}/website`, {
        templateId,
        cmsData
      })
      toast({ title: "Configuration Saved", description: "Your Website Data has been saved securely to the database." })
    } catch (e: any) {
      toast({ title: "Failed to save", variant: "destructive" })
    } finally {
      setIsSaving(false)
    }
  }

  const pollTaskStatus = (taskId: string) => {
    setIsPublishing(true)
    setDeployStatus("QUEUED")

    pollingIntervalObj.current = setInterval(async () => {
      try {
        const res = await apiClient.get(`/agents/tasks/${taskId}`)
        if (res.data) {
          const status = res.data.status
          setDeployStatus(status)

          if (status === 'COMPLETED' || status === 'FAILED') {
            if (pollingIntervalObj.current) clearInterval(pollingIntervalObj.current)
            setIsPublishing(false)
            setIsPublished(status === 'COMPLETED')

            if (status === 'COMPLETED') {
              toast({ title: "Build Complete!", description: "AI generation has finished successfully." })
            } else {
              toast({ title: "Build Failed", description: "AI generation encountered an error.", variant: "destructive" })
            }
          }
        }
      } catch (e) {
        console.error("Polling error", e)
      }
    }, 1000)
  }

  const handlePublish = async () => {
    setIsPublishing(true)
    try {
      const deployRes = await apiClient.post(`/business/${activeBiz.id}/website/deploy`, {})
      const taskId = deployRes.data?.taskId

      if (taskId) {
        toast({ title: "Build Started!", description: "AI is generating your website on the server." })
        pollTaskStatus(taskId)
      } else {
        toast({ title: "Build Started", description: "Deployment triggered, but could not track task status." })
        setIsPublishing(false)
        setIsPublished(true)
      }
    } catch (e: any) {
      toast({ title: "Deployment failed", variant: "destructive" })
      setIsPublishing(false)
    }
  }

  if (!activeBiz) return null

  return (
    <div className="h-full flex flex-col space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold font-headline">My Website</h2>
          <p className="text-muted-foreground mt-1">Manage the online presence for {activeBiz.name}.</p>
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
            {isPublishing ? (
              <><RefreshCw size={16} className="animate-spin" /> {deployStatus === 'PROCESSING' ? 'Building...' : deployStatus === 'QUEUED' ? 'Queued...' : 'Publishing...'}</>
            ) : isPublished ? (
              <><Check size={16} /> Published!</>
            ) : "Publish Changes"}
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
                  <Globe size={12} /> {activeBiz.name.toLowerCase().replace(/\s/g, "")}.bizspark.ai
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
                  srcDoc={activeBiz.html}
                  className="w-full h-full border-none"
                  style={{ minHeight: "800px" }}
                />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="col-span-12 lg:col-span-4 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Configuration</CardTitle>
              <CardDescription>Select a layout and modify content.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 max-h-[600px] overflow-auto">
              <div className="space-y-2 mb-6">
                <div className="flex justify-between items-center">
                  <Label>Select Template</Label>
                  <Button variant="ghost" size="sm" onClick={handleSaveConfig} disabled={isSaving || !templateId} className="h-8 text-xs font-medium text-primary">
                    {isSaving ? "Saving..." : "Save Draft"}
                  </Button>
                </div>
                <div className="grid grid-cols-2 gap-2 border bg-slate-50 p-2 rounded-lg">
                  {templates.map(tpl => (
                    <div
                      key={tpl.id}
                      onClick={() => setTemplateId(tpl.id)}
                      className={cn("p-3 rounded border text-center cursor-pointer text-xs font-bold transition-all", templateId === tpl.id ? "bg-primary text-white border-primary" : "bg-white text-slate-500 hover:border-primary")}
                    >
                      <div className="flex justify-center mb-1">
                        {tpl.type === 'ECOMMERCE_ITEM' ? <Store size={14} /> : <Sparkles size={14} />}
                      </div>
                      {tpl.name}
                    </div>
                  ))}
                </div>
              </div>

              {templateId && templates.find(t => t.id === templateId)?.cmsSchema?.sections?.map((section: any) => (
                <div key={section.id} className="space-y-3 p-4 bg-slate-50 border rounded-xl">
                  <h4 className="text-sm font-bold border-b pb-1">{section.label}</h4>
                  <div className="space-y-4">
                    {section.fields?.map((field: any) => (
                      <div key={field.key} className="space-y-1">
                        <Label className="text-xs">{field.label}</Label>
                        {field.type === 'TEXT' && (
                          <Input
                            className="h-8 text-xs"
                            placeholder={field.defaultValue || ""}
                            value={cmsData[`${section.id}.${field.key}`] || ""}
                            onChange={e => setCmsData({
                              ...cmsData,
                              [`${section.id}.${field.key}`]: e.target.value
                            })}
                          />
                        )}
                        {field.type === 'COLOR' && (
                          <div className="flex gap-2 items-center">
                            <input
                              type="color"
                              className="size-6 rounded cursor-pointer"
                              value={cmsData[`${section.id}.${field.key}`] || field.defaultValue || "#000000"}
                              onChange={e => setCmsData({
                                ...cmsData,
                                [`${section.id}.${field.key}`]: e.target.value
                              })}
                            />
                          </div>
                        )}
                        {field.type === 'IMAGE_URL' && (
                          <div className="flex gap-1">
                            <Input
                              className="h-8 text-xs"
                              placeholder="URL..."
                              value={cmsData[`${section.id}.${field.key}`] || ""}
                              onChange={e => setCmsData({
                                ...cmsData,
                                [`${section.id}.${field.key}`]: e.target.value
                              })}
                            />
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
