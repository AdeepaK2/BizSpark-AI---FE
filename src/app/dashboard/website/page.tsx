
"use client"

import { useEffect, useState, useRef } from "react"
import { Monitor, Smartphone, Globe, ExternalLink, RefreshCw, Sparkles, Check, Wand2, Sparkle } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
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
  const [stepIndex, setStepIndex] = useState(0)
  const [completedSetup, setCompletedSetup] = useState(false)

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
      return true
    } catch (e: any) {
      toast({ title: "Failed to save", variant: "destructive" })
      return false
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
      const taskId = deployRes?.data?.taskId || deployRes?.data?.data?.taskId

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

  const steps = [
    {
      id: "template",
      title: "Choose a template",
      description: "Pick a starting layout that fits your business."
    },
    {
      id: "brand",
      title: "Branding",
      description: "Set your primary colors and look & feel."
    },
    {
      id: "content",
      title: "Content",
      description: "Add your headline, about, and core sections."
    },
    {
      id: "media",
      title: "Images",
      description: "Upload or link images for your site."
    },
    {
      id: "review",
      title: "Review & publish",
      description: "Preview the site and publish when ready."
    }
  ]

  const selectedTemplate = templates.find(t => t.id === templateId)
  const primaryWebsite = Array.isArray(activeBiz.websites) ? activeBiz.websites[0] : null
  const hasStoredConfiguration = !!(primaryWebsite?.templateId && String(primaryWebsite.templateId).trim().length > 0)
  const sections = selectedTemplate?.cmsSchema?.sections || []
  const step = steps[stepIndex]?.id || "template"
  const isFirstStep = stepIndex === 0
  const isLastStep = stepIndex === steps.length - 1
  const needsOnboarding = !hasStoredConfiguration && !completedSetup

  const fieldTypesByStep: Record<string, string[]> = {
    brand: ["COLOR"],
    content: ["TEXT"],
    media: ["IMAGE_URL"]
  }

  const getSectionFields = (section: any) => {
    if (!section?.fields?.length) return []
    const types = fieldTypesByStep[step] || []
    if (!types.length) return []
    return section.fields.filter((field: any) => types.includes(field.type))
  }

  if (needsOnboarding) {
    return (
      <div className="h-full flex flex-col space-y-6">
        <div>
          <h2 className="text-3xl font-bold font-headline">Create your website</h2>
          <p className="text-muted-foreground mt-1">
            Let’s set up your site in a few simple steps. You can edit everything later.
          </p>
        </div>

        <Card className="border">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Wand2 size={18} /> Step {stepIndex + 1} of {steps.length}: {steps[stepIndex]?.title}
            </CardTitle>
            <CardDescription>{steps[stepIndex]?.description}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="h-2 flex-1 rounded-full bg-slate-100">
                <div
                  className="h-2 rounded-full bg-primary transition-all"
                  style={{ width: `${((stepIndex + 1) / steps.length) * 100}%` }}
                />
              </div>
              <div className="text-xs text-muted-foreground">
                {stepIndex + 1}/{steps.length}
              </div>
            </div>

            {step === "template" && (
              <div className="space-y-3">
                <Label>Select Template</Label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2 border bg-slate-50 p-2 rounded-lg">
                  {templates.map(tpl => (
                    <div
                      key={tpl.id}
                      onClick={() => setTemplateId(tpl.id)}
                      className={cn(
                        "p-3 rounded border text-center cursor-pointer text-xs font-bold transition-all",
                        templateId === tpl.id ? "bg-primary text-white border-primary" : "bg-white text-slate-500 hover:border-primary"
                      )}
                    >
                      <div className="flex justify-center mb-1">
                        {tpl.type === 'ECOMMERCE_ITEM' ? <Store size={14} /> : <Sparkles size={14} />}
                      </div>
                      {tpl.name}
                    </div>
                  ))}
                </div>
                <div className="text-xs text-muted-foreground">
                  You can switch templates later without losing your content.
                </div>
              </div>
            )}

            {["brand", "content", "media"].includes(step) && (
              <div className="space-y-4">
                {!templateId && (
                  <div className="rounded-lg border bg-slate-50 p-3 text-xs text-slate-600">
                    Choose a template first to unlock editable sections.
                  </div>
                )}
                {templateId && sections.length === 0 && (
                  <div className="rounded-lg border bg-slate-50 p-3 text-xs text-slate-600">
                    This template doesn’t expose editable fields yet.
                  </div>
                )}
                {templateId && sections.map((section: any) => {
                  const fields = getSectionFields(section)
                  if (!fields.length) return null
                  return (
                    <div key={section.id} className="space-y-3 p-4 bg-slate-50 border rounded-xl">
                      <h4 className="text-sm font-bold border-b pb-1">{section.label}</h4>
                      <div className="space-y-4">
                        {fields.map((field: any) => (
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
                                <Input
                                  className="h-8 text-xs"
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
                                  placeholder="Paste image URL..."
                                  value={cmsData[`${section.id}.${field.key}`] || ""}
                                  onChange={e => setCmsData({
                                    ...cmsData,
                                    [`${section.id}.${field.key}`]: e.target.value
                                  })}
                                />
                                <Button variant="outline" size="icon" className="shrink-0" aria-label="Upload image">
                                  <Upload size={14} />
                                </Button>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )
                })}
              </div>
            )}

            {step === "review" && (
              <div className="space-y-4">
                <div className="rounded-xl border bg-slate-50 p-4">
                  <div className="text-sm font-semibold">Ready to generate your site?</div>
                  <div className="text-xs text-muted-foreground mt-1">
                    We’ll save your configuration and our agent will build the website.
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div className="rounded-lg border p-3">
                    <div className="text-muted-foreground">Template</div>
                    <div className="font-semibold mt-1">{selectedTemplate?.name || "Not selected"}</div>
                  </div>
                  <div className="rounded-lg border p-3">
                    <div className="text-muted-foreground">Content fields</div>
                    <div className="font-semibold mt-1">
                      {sections.reduce((acc: number, s: any) => acc + (s.fields?.length || 0), 0)}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
          <div className="border-t px-6 py-4 flex items-center justify-between">
            <Button variant="outline" onClick={() => setStepIndex(Math.max(0, stepIndex - 1))} disabled={isFirstStep}>
              Back
            </Button>
            {!isLastStep && (
              <Button onClick={() => setStepIndex(Math.min(steps.length - 1, stepIndex + 1))}>
                Next step
              </Button>
            )}
            {isLastStep && (
              <Button
                onClick={async () => {
                  const ok = await handleSaveConfig()
                  if (ok) {
                    setCompletedSetup(true)
                    await handlePublish()
                  }
                }}
                disabled={isSaving || !templateId}
              >
                {isSaving ? "Saving..." : "Save & generate website"}
              </Button>
            )}
          </div>
        </Card>
      </div>
    )
  }

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

      {isPublishing && (
        <div className="rounded-xl border bg-slate-50 p-4 text-sm text-slate-700 flex items-center gap-2">
          <Sparkle size={16} className="text-primary" />
          Our agent is creating your website. This can take a couple of minutes.
        </div>
      )}

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
            <CardHeader className="flex flex-row items-start justify-between gap-3">
              <div>
                <CardTitle>Configuration</CardTitle>
                <CardDescription>Update template and content.</CardDescription>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleSaveConfig}
                disabled={isSaving || !templateId}
                className="h-8 text-xs font-medium text-primary"
              >
                {isSaving ? "Saving..." : "Save Draft"}
              </Button>
            </CardHeader>
            <CardContent className="space-y-4 max-h-[600px] overflow-auto">
              <div className="space-y-3">
                <Label>Select Template</Label>
                <div className="grid grid-cols-2 gap-2 border bg-slate-50 p-2 rounded-lg">
                  {templates.map(tpl => (
                    <div
                      key={tpl.id}
                      onClick={() => setTemplateId(tpl.id)}
                      className={cn(
                        "p-3 rounded border text-center cursor-pointer text-xs font-bold transition-all",
                        templateId === tpl.id ? "bg-primary text-white border-primary" : "bg-white text-slate-500 hover:border-primary"
                      )}
                    >
                      <div className="flex justify-center mb-1">
                        {tpl.type === 'ECOMMERCE_ITEM' ? <Store size={14} /> : <Sparkles size={14} />}
                      </div>
                      {tpl.name}
                    </div>
                  ))}
                </div>
              </div>

              {!templateId && (
                <div className="rounded-lg border bg-slate-50 p-3 text-xs text-slate-600">
                  Select a template to edit website fields.
                </div>
              )}
              {templateId && sections.length === 0 && (
                <div className="rounded-lg border bg-slate-50 p-3 text-xs text-slate-600">
                  This template doesn’t expose editable fields yet.
                </div>
              )}
              {templateId && sections.map((section: any) => (
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
                            <Input
                              className="h-8 text-xs"
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
                              placeholder="Paste image URL..."
                              value={cmsData[`${section.id}.${field.key}`] || ""}
                              onChange={e => setCmsData({
                                ...cmsData,
                                [`${section.id}.${field.key}`]: e.target.value
                              })}
                            />
                            <Button variant="outline" size="icon" className="shrink-0" aria-label="Upload image">
                              <Upload size={14} />
                            </Button>
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
