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
    setIsGenerating(true)
    
    // Simulate generation delay
    await new Promise(resolve => setTimeout(resolve, 2500))

    try {
      // Mocked Website HTML based on user input
      const mockHtml = `
        <!DOCTYPE html>
        <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>${formData.businessName} | Built with BizSpark AI</title>
          <script src="https://cdn.tailwindcss.com"></script>
          <style>
            @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap');
            body { font-family: 'Inter', sans-serif; }
          </style>
        </head>
        <body class="bg-[#F1F0F5] text-slate-900 antialiased">
          <nav class="bg-white border-b sticky top-0 z-50">
            <div class="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
              <div class="text-2xl font-bold text-[#6633CC] flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor" class="text-[#6633CC]"><path d="m13 2-2 2.5h3L12 13h1l-4 9 2-9H8l2.5-3.5L7 9.5h3L13 2z"/></svg>
                ${formData.businessName}
              </div>
              <div class="hidden md:flex gap-8 text-sm font-medium text-slate-600">
                <a href="#" class="hover:text-[#6633CC]">Home</a>
                <a href="#" class="hover:text-[#6633CC]">About</a>
                <a href="#" class="hover:text-[#6633CC]">Services</a>
                <a href="#" class="hover:text-[#6633CC]">Contact</a>
              </div>
              <button class="bg-[#6633CC] text-white px-6 py-2.5 rounded-lg text-sm font-bold shadow-lg shadow-purple-200 hover:bg-[#5522BB] transition-all">
                Get Started
              </button>
            </div>
          </nav>

          <section class="py-32 px-6">
            <div class="max-w-5xl mx-auto text-center">
              <span class="inline-block px-4 py-1.5 rounded-full bg-purple-100 text-[#6633CC] text-xs font-bold tracking-widest uppercase mb-8">
                Welcome to ${formData.businessCategory}
              </span>
              <h1 class="text-7xl font-bold tracking-tight mb-8 leading-[1.05]">
                Professional <span class="text-[#6633CC]">${formData.businessCategory}</span> <br/>Tailored for You.
              </h1>
              <p class="text-xl text-slate-500 max-w-2xl mx-auto mb-12 leading-relaxed">
                ${formData.businessDescription || "Experience the next level of service with our dedicated team of professionals."}
              </p>
              <div class="flex flex-col sm:flex-row gap-4 justify-center">
                <button class="bg-[#6633CC] text-white px-10 py-5 rounded-2xl text-lg font-bold shadow-xl shadow-purple-100 hover:scale-105 transition-transform">Start Now</button>
                <button class="bg-white border-2 border-slate-200 px-10 py-5 rounded-2xl text-lg font-bold hover:bg-slate-50 transition-colors">Our Story</button>
              </div>
            </div>
          </section>

          <section class="py-24 bg-white">
            <div class="max-w-7xl mx-auto px-6">
              <div class="text-center mb-20">
                <h2 class="text-4xl font-bold mb-4">Our Services</h2>
                <div class="w-20 h-1.5 bg-[#6633CC] mx-auto rounded-full"></div>
              </div>
              <div class="grid md:grid-cols-3 gap-10">
                ${formData.products ? formData.products.split(',').map(p => `
                  <div class="p-10 border-2 border-slate-50 rounded-3xl hover:border-[#6633CC] hover:shadow-2xl transition-all group bg-slate-50/30">
                    <div class="w-14 h-14 rounded-2xl bg-purple-50 flex items-center justify-center text-[#6633CC] mb-8 group-hover:bg-[#6633CC] group-hover:text-white transition-all">
                      <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"/><path d="M3 6h18"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>
                    </div>
                    <h3 class="text-2xl font-bold mb-4">${p.trim()}</h3>
                    <p class="text-slate-500 leading-relaxed">We deliver top-tier ${p.trim()} solutions designed to help your business thrive in a competitive landscape.</p>
                  </div>
                `).join('') : `
                  <div class="col-span-3 text-center py-20 bg-slate-50 rounded-3xl">
                    <p class="text-slate-400 font-medium italic">Your products and services will appear here.</p>
                  </div>
                `}
              </div>
            </div>
          </section>

          <footer class="py-24 border-t bg-slate-900 text-slate-400">
            <div class="max-w-7xl mx-auto px-6">
              <div class="grid md:grid-cols-2 gap-12 items-center">
                <div>
                  <div class="text-2xl font-bold text-white mb-6">${formData.businessName}</div>
                  <p class="max-w-sm mb-8 text-slate-500">${formData.businessDescription}</p>
                  <p class="text-sm">&copy; 2024 ${formData.businessName}. All rights reserved.</p>
                </div>
                <div class="flex md:justify-end gap-12 text-sm">
                   <div class="space-y-4">
                    <p class="font-bold text-white">Platform</p>
                    <p>Home</p>
                    <p>Services</p>
                   </div>
                   <div class="space-y-4">
                    <p class="font-bold text-white">Company</p>
                    <p>About</p>
                    <p>Contact</p>
                   </div>
                </div>
              </div>
              <div class="mt-16 pt-8 border-t border-slate-800 text-center">
                <p class="text-[10px] opacity-30 uppercase tracking-[0.3em]">Built with AI by BizSpark</p>
              </div>
            </div>
          </footer>
        </body>
        </html>
      `

      // Store in local storage for the prototype persistence
      localStorage.setItem("biz_website_html", mockHtml)
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
