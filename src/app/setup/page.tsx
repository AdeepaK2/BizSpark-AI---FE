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
  Monitor,
  CheckCircle
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { generateBizSparkWebsite } from "@/ai/flows/generate-bizspark-website"
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
    setIsGenerating(true)
    try {
      // We simulate the call to store the data and trigger generation
      const productsList = formData.products.split(",").map(p => p.trim())
      
      const result = await generateBizSparkWebsite({
        businessName: formData.businessName,
        businessCategory: formData.businessCategory,
        businessDescription: formData.businessDescription,
        productsAndServices: productsList,
        websiteTemplate: formData.websiteTemplate
      })

      // Store in local storage for the prototype
      localStorage.setItem("biz_website_html", result.websiteHtml)
      localStorage.setItem("biz_name", formData.businessName)
      
      toast({
        title: "Website Generated!",
        description: "Your business is now live on BizSpark AI.",
      })
      
      router.push("/dashboard")
    } catch (error) {
      toast({
        title: "Generation failed",
        description: "Something went wrong creating your website.",
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

        <Card className="shadow-xl border-2">
          <CardHeader className="space-y-2 p-8 border-b bg-white rounded-t-lg">
            <CardTitle className="text-2xl font-bold">
              {step === 0 && "Tell us about your business"}
              {step === 1 && "What do you offer?"}
              {step === 2 && "Choose your style"}
            </CardTitle>
            <CardDescription className="text-base">
              {step === 0 && "These details help AI build your brand and website content."}
              {step === 1 && "List your main products or services to help customers find you."}
              {step === 2 && "Pick a template that matches your business personality."}
            </CardDescription>
          </CardHeader>

          <CardContent className="p-8">
            {step === 0 && (
              <div className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="bizName">Business Name</Label>
                  <Input 
                    id="bizName" 
                    placeholder="e.g. Sunny Morning Bakery" 
                    value={formData.businessName}
                    onChange={(e) => setFormData({...formData, businessName: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="bizCat">Business Category</Label>
                  <Input 
                    id="bizCat" 
                    placeholder="e.g. Bakery, Cafe, Consultant" 
                    value={formData.businessCategory}
                    onChange={(e) => setFormData({...formData, businessCategory: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="bizDesc">Describe your mission</Label>
                  <Textarea 
                    id="bizDesc" 
                    placeholder="We provide fresh organic sourdough bread..." 
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
                  <Label htmlFor="products">Products & Services (Comma separated)</Label>
                  <Textarea 
                    id="products" 
                    placeholder="Artisan Bread, Coffee, Pastries, Custom Cakes" 
                    className="min-h-[120px]"
                    value={formData.products}
                    onChange={(e) => setFormData({...formData, products: e.target.value})}
                  />
                  <p className="text-xs text-muted-foreground mt-2">These will be featured prominently on your website cards.</p>
                </div>
                <div className="p-6 border-2 border-dashed rounded-xl bg-slate-50 flex flex-col items-center justify-center text-center">
                  <Upload className="size-8 text-primary mb-3" />
                  <p className="font-bold text-sm">Upload Business Logo</p>
                  <p className="text-xs text-muted-foreground">PNG, JPG or SVG (Max 5MB)</p>
                  <Button variant="outline" size="sm" className="mt-4">Browse Files</Button>
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="grid grid-cols-2 gap-4">
                {[
                  { id: "modern", name: "Modern", icon: Sparkles, desc: "Clean & bold" },
                  { id: "minimalist", name: "Minimalist", icon: CheckCircle, desc: "Simple & light" },
                  { id: "corporate", name: "Corporate", icon: Store, desc: "Professional & trustworthy" },
                  { id: "playful", name: "Playful", icon: Zap, desc: "Friendly & vibrant" },
                ].map((tpl) => (
                  <div 
                    key={tpl.id}
                    onClick={() => setFormData({...formData, websiteTemplate: tpl.id})}
                    className={cn(
                      "p-6 border-2 rounded-xl cursor-pointer transition-all hover:border-primary",
                      formData.websiteTemplate === tpl.id ? "border-primary bg-primary/5 shadow-md" : "bg-card border-border"
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
              <Button 
                variant="ghost" 
                onClick={prevStep} 
                disabled={step === 0}
                className="gap-2"
              >
                <ArrowLeft size={16} /> Previous
              </Button>
              {step === STEPS.length - 1 ? (
                <Button 
                  size="lg" 
                  className="bg-primary hover:bg-primary/90 min-w-[160px]" 
                  onClick={handleFinish}
                  disabled={isGenerating}
                >
                  {isGenerating ? (
                    <span className="flex items-center gap-2">
                      <Sparkles className="animate-pulse size-4" /> Generating...
                    </span>
                  ) : (
                    "Launch Business"
                  )}
                </Button>
              ) : (
                <Button 
                  size="lg" 
                  className="bg-primary hover:bg-primary/90 min-w-[140px] gap-2" 
                  onClick={nextStep}
                >
                  Next <ArrowRight size={16} />
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
