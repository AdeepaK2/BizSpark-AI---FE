
"use client"

import { useState } from "react"
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

const STEPS = ["Business Info", "Offerings", "Design"]

export default function SetupWizard() {
  const router = useRouter()
  const { toast } = useToast()
  const [step, setStep] = useState(0)
  const [isGenerating, setIsGenerating] = useState(false)
  
  const [formData, setFormData] = useState({
    businessName: "",
    businessCategory: "",
    businessDescription: "",
    products: "",
    websiteTemplate: "modern"
  })

  const nextStep = () => setStep(s => Math.min(s + 1, STEPS.length - 1))
  const prevStep = () => setStep(s => Math.max(s - 1, 0))

  const handleFinish = async () => {
    if (!formData.businessName) {
      toast({ title: "Business Name required", variant: "destructive" })
      return
    }

    setIsGenerating(true)
    await new Promise(resolve => setTimeout(resolve, 2000))

    try {
      const bizId = Math.random().toString(36).substring(7)
      const mockHtml = `
        <!DOCTYPE html>
        <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>${formData.businessName}</title>
          <script src="https://cdn.tailwindcss.com"></script>
          <style>
            @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;700&display=swap');
            body { font-family: 'Inter', sans-serif; }
          </style>
        </head>
        <body class="bg-[#F1F0F5] text-slate-900 antialiased">
          <nav class="bg-white border-b h-20 flex items-center justify-between px-10">
            <div class="text-2xl font-bold text-[#6633CC]">${formData.businessName}</div>
            <div class="flex gap-8 text-sm font-medium">
              <a href="#">Home</a><a href="#">About</a><a href="#">Contact</a>
            </div>
          </nav>
          <header class="py-32 px-10 text-center max-w-4xl mx-auto">
            <h1 class="text-6xl font-bold mb-8 leading-tight">Expert <span class="text-[#6633CC]">${formData.businessCategory}</span> <br/>Services for You.</h1>
            <p class="text-xl text-slate-500 mb-12">${formData.businessDescription}</p>
            <button class="bg-[#6633CC] text-white px-10 py-5 rounded-2xl text-lg font-bold shadow-xl">Get Started</button>
          </header>
          <section class="py-24 bg-white px-10">
            <div class="max-w-7xl mx-auto grid md:grid-cols-3 gap-10">
              ${formData.products.split(',').map(p => `
                <div class="p-10 bg-slate-50 rounded-3xl border-2 border-transparent hover:border-[#6633CC] transition-all">
                  <h3 class="text-2xl font-bold mb-4">${p.trim()}</h3>
                  <p class="text-slate-500">Premium ${p.trim()} services tailored to your needs.</p>
                </div>
              `).join('')}
            </div>
          </section>
        </body>
        </html>
      `

      // Multi-business logic
      const list = JSON.parse(localStorage.getItem("biz_list") || "[]")
      const newBiz = {
        id: bizId,
        name: formData.businessName,
        category: formData.businessCategory,
        description: formData.businessDescription,
        html: mockHtml,
        products: formData.products.split(',').map(p => p.trim())
      }
      
      list.push(newBiz)
      localStorage.setItem("biz_list", JSON.stringify(list))
      localStorage.setItem("active_biz_id", bizId)
      
      toast({
        title: "Success!",
        description: `${formData.businessName} is ready for takeoff.`,
      })
      
      router.push("/dashboard")
    } catch (error) {
      toast({
        title: "Setup failed",
        description: "An unexpected error occurred during generation.",
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
            </CardTitle>
            <CardDescription className="text-base">
              {step === 0 && "Add a new business to your portfolio. AI will build everything."}
              {step === 1 && "List your main products or services."}
              {step === 2 && "Pick a template that fits your brand."}
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
                    onChange={(e) => setFormData({...formData, businessName: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Category</Label>
                  <Input 
                    placeholder="e.g. Marketing Agency" 
                    value={formData.businessCategory}
                    onChange={(e) => setFormData({...formData, businessCategory: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Mission</Label>
                  <Textarea 
                    placeholder="We help brands reach their potential..." 
                    className="min-h-[120px]"
                    value={formData.businessDescription}
                    onChange={(e) => setFormData({...formData, businessDescription: e.target.value})}
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
                    onChange={(e) => setFormData({...formData, products: e.target.value})}
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
                {[
                  { id: "modern", name: "Modern", icon: Sparkles, desc: "Bold & sleek" },
                  { id: "minimalist", name: "Minimalist", icon: CheckCircle, desc: "Clean & quiet" },
                  { id: "corporate", name: "Corporate", icon: Store, desc: "Solid & trusted" },
                  { id: "playful", name: "Playful", icon: Zap, desc: "Fun & active" },
                ].map((tpl) => (
                  <div 
                    key={tpl.id}
                    onClick={() => setFormData({...formData, websiteTemplate: tpl.id})}
                    className={cn(
                      "p-6 border-2 rounded-xl cursor-pointer transition-all hover:border-primary",
                      formData.websiteTemplate === tpl.id ? "border-primary bg-primary/5" : "bg-card"
                    )}
                  >
                    <div className={cn("size-10 rounded-lg flex items-center justify-center mb-4", formData.websiteTemplate === tpl.id ? "bg-primary text-white" : "bg-slate-100 text-slate-400")}>
                      <tpl.icon size={20} />
                    </div>
                    <h4 className="font-bold">{tpl.name}</h4>
                    <p className="text-xs text-muted-foreground">{tpl.desc}</p>
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
