
"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import {
  ArrowRight,
  ArrowLeft,
  Upload,
  Zap,
  Sparkles,
  Store,
  CheckCircle
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { useToast } from "@/hooks/use-toast"
import { cn } from "@/lib/utils"
import { apiClient } from "@/lib/api-client"

const STEPS = ["Business Info", "Offerings", "Design", "Website Setup"]

export default function SetupWizard() {
  const router = useRouter()
  const { toast } = useToast()
  const [step, setStep] = useState(0)
  const [isGenerating, setIsGenerating] = useState(false)

  const [templates, setTemplates] = useState<any[]>([])

  useEffect(() => {
    const fetchTemplates = async () => {
      try {
        const res = await apiClient.get('/templates')
        if (res.data) {
          setTemplates(res.data)
          if (res.data.length > 0) {
            setFormData(prev => ({ ...prev, templateId: res.data[0].id }))
          }
        }
      } catch (e) {
        console.error("Failed to fetch templates", e)
      }
    }
    fetchTemplates()
  }, [])

  const [formData, setFormData] = useState({
    businessName: "",
    businessCategory: "",
    businessDescription: "",
    products: "",
    templateId: "",
    templateData: {} as Record<string, any>
  })

  const nextStep = () => setStep(s => Math.min(s + 1, STEPS.length - 1))
  const prevStep = () => setStep(s => Math.max(s - 1, 0))

  const handleFinish = async () => {
    if (!formData.businessName) {
      toast({ title: "Business Name required", variant: "destructive" })
      return
    }

    setIsGenerating(true)

    try {
      const response = await apiClient.post('/business', {
        name: formData.businessName,
        category: formData.businessCategory,
        description: formData.businessDescription,
      })

      const newBizId = response.data.id

      // Keep it in localStorage for the UI's sake
      const list = JSON.parse(localStorage.getItem("biz_list") || "[]")
      const newBiz = {
        id: newBizId,
        name: formData.businessName,
        category: formData.businessCategory,
        description: formData.businessDescription,
        html: "<h1>Real business saved to DB!</h1>",
        products: formData.products.split(',').map(p => p.trim())
      }

      list.push(newBiz)
      localStorage.setItem("biz_list", JSON.stringify(list))
      localStorage.setItem("active_biz_id", newBizId)

      toast({
        title: "Success!",
        description: `${formData.businessName} has been fully created and saved to the database.`,
      })

      router.push("/dashboard")
    } catch (error: any) {
      toast({
        title: "Setup failed",
        description: error.message || "An unexpected error occurred building the business.",
        variant: "destructive"
      })
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <div className="min-h-screen bg-background py-12 px-6">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-2 font-bold text-xl text-primary">
            <Zap className="fill-primary" size={24} />
            <span>BizSpark AI</span>
          </div>
          <div className="text-sm font-medium text-muted-foreground">
            Step {step + 1} of {STEPS.length}: {STEPS[step]}
          </div>
        </div>

        <Progress value={((step + 1) / STEPS.length) * 100} className="h-2 mb-12" />

        <Card className="shadow-xl border-2 overflow-hidden">
          <CardHeader className="p-8 border-b bg-white">
            <CardTitle className="text-2xl font-bold">
              {step === 0 && "Start your next venture"}
              {step === 1 && "What's on the menu?"}
              {step === 2 && "Visual identity"}
              {step === 3 && "Website Content"}
            </CardTitle>
            <CardDescription className="text-base">
              {step === 0 && "Add a new business to your portfolio. AI will build everything."}
              {step === 1 && "List your main products or services."}
              {step === 2 && "Pick a template that fits your brand."}
              {step === 3 && "Configure the content for your selected template."}
            </CardDescription>
          </CardHeader>

          <CardContent className="p-8">
            {step === 0 && (
              <div className="space-y-6">
                <div className="space-y-2">
                  <Label>Business Name</Label>
                  <Input
                    placeholder="e.g. Skyline Consulting"
                    value={formData.businessName}
                    onChange={(e) => setFormData({ ...formData, businessName: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Category</Label>
                  <Input
                    placeholder="e.g. Marketing Agency"
                    value={formData.businessCategory}
                    onChange={(e) => setFormData({ ...formData, businessCategory: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Mission</Label>
                  <Textarea
                    placeholder="We help brands reach their potential..."
                    className="min-h-[120px]"
                    value={formData.businessDescription}
                    onChange={(e) => setFormData({ ...formData, businessDescription: e.target.value })}
                  />
                </div>
              </div>
            )}

            {step === 1 && (
              <div className="space-y-6">
                <div className="space-y-2">
                  <Label>Offerings (Comma separated)</Label>
                  <Textarea
                    placeholder="SEO, Content Writing, Paid Ads"
                    className="min-h-[120px]"
                    value={formData.products}
                    onChange={(e) => setFormData({ ...formData, products: e.target.value })}
                  />
                </div>
                <div className="p-8 border-2 border-dashed rounded-xl bg-slate-50 flex flex-col items-center justify-center text-center">
                  <Upload className="size-8 text-primary mb-3 opacity-50" />
                  <p className="font-bold text-sm">Upload Business Logo</p>
                  <Button variant="outline" size="sm" className="mt-4">Browse</Button>
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="grid grid-cols-2 gap-4">
                {templates.map((tpl) => (
                  <div
                    key={tpl.id}
                    onClick={() => setFormData({ ...formData, templateId: tpl.id })}
                    className={cn(
                      "p-6 border-2 rounded-xl cursor-pointer transition-all hover:border-primary",
                      formData.templateId === tpl.id ? "border-primary bg-primary/5" : "bg-card"
                    )}
                  >
                    <div className={cn("size-10 rounded-lg flex items-center justify-center mb-4", formData.templateId === tpl.id ? "bg-primary text-white" : "bg-slate-100 text-slate-400")}>
                      {tpl.type === 'ECOMMERCE_ITEM' ? <Store size={20} /> : <Sparkles size={20} />}
                    </div>
                    <h4 className="font-bold">{tpl.name}</h4>
                    <p className="text-xs text-muted-foreground mt-1">{tpl.description}</p>
                    <div className="mt-3 text-[10px] uppercase font-bold text-primary/60 tracking-wider">
                      {tpl.type.replace('_', ' ')}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {step === 3 && (
              <div className="space-y-8 max-h-[400px] overflow-auto pr-4">
                {templates.find(t => t.id === formData.templateId)?.cmsSchema?.sections?.map((section: any) => (
                  <div key={section.id} className="space-y-4 bg-slate-50 p-6 rounded-xl border">
                    <h3 className="text-lg font-bold border-b pb-2">{section.label}</h3>
                    <div className="space-y-4 mt-4">
                      {section.fields?.map((field: any) => (
                        <div key={field.key} className="space-y-2">
                          <Label>{field.label} {field.required && <span className="text-red-500">*</span>}</Label>
                          {field.type === 'TEXT' && (
                            <Input
                              placeholder={field.defaultValue || ""}
                              value={formData.templateData[`${section.id}.${field.key}`] || ""}
                              onChange={e => setFormData({
                                ...formData,
                                templateData: { ...formData.templateData, [`${section.id}.${field.key}`]: e.target.value }
                              })}
                            />
                          )}
                          {field.type === 'COLOR' && (
                            <div className="flex gap-4 items-center h-10">
                              <input
                                type="color"
                                className="size-8 rounded cursor-pointer"
                                value={formData.templateData[`${section.id}.${field.key}`] || field.defaultValue || "#000000"}
                                onChange={e => setFormData({
                                  ...formData,
                                  templateData: { ...formData.templateData, [`${section.id}.${field.key}`]: e.target.value }
                                })}
                              />
                              <span className="text-xs text-muted-foreground font-medium uppercase">{formData.templateData[`${section.id}.${field.key}`] || field.defaultValue || "Pick a color"}</span>
                            </div>
                          )}
                          {field.type === 'IMAGE_URL' && (
                            <div className="flex gap-2">
                              <Input
                                placeholder="https://..."
                                value={formData.templateData[`${section.id}.${field.key}`] || ""}
                                onChange={e => setFormData({
                                  ...formData,
                                  templateData: { ...formData.templateData, [`${section.id}.${field.key}`]: e.target.value }
                                })}
                              />
                              <Button variant="outline" size="icon"><Upload size={16} /></Button>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}


            <div className="flex items-center justify-between mt-12 pt-8 border-t">
              <Button variant="ghost" onClick={prevStep} disabled={step === 0}>
                <ArrowLeft size={16} className="mr-2" /> Back
              </Button>
              <Button
                size="lg"
                className="bg-primary hover:bg-primary/90 min-w-[160px]"
                onClick={step === STEPS.length - 1 ? handleFinish : nextStep}
                disabled={isGenerating}
              >
                {isGenerating ? (
                  <Sparkles className="animate-pulse size-4 mr-2" />
                ) : null}
                {step === STEPS.length - 1 ? "Launch Business" : "Continue"}
                {step < STEPS.length - 1 && <ArrowRight size={16} className="ml-2" />}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
