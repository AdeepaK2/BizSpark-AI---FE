"use client"

import { useState } from "react"
import { 
  Package, 
  Plus, 
  Search, 
  Sparkles, 
  Share2, 
  Globe, 
  MoreVertical,
  ImageIcon,
  Loader2,
  TrendingUp
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from "@/components/ui/dialog"
import { generateSocialMediaContent, type GenerateSocialMediaContentOutput } from "@/ai/flows/generate-social-media-content"
import { useToast } from "@/hooks/use-toast"
import { cn } from "@/lib/utils"

export default function ProductsPage() {
  const { toast } = useToast()
  const [isAdding, setIsAdding] = useState(false)
  const [isGenerating, setIsGenerating] = useState(false)
  const [generatedContent, setGeneratedContent] = useState<GenerateSocialMediaContentOutput | null>(null)
  
  const [newProduct, setNewProduct] = useState({
    name: "",
    description: "",
    price: ""
  })

  const handleAddProduct = async () => {
    setIsGenerating(true)
    try {
      const bizName = localStorage.getItem("biz_name") || "Our Business"
      
      const content = await generateSocialMediaContent({
        businessName: bizName,
        productName: newProduct.name,
        description: newProduct.description,
      })
      
      setGeneratedContent(content)
      toast({
        title: "AI Analysis Complete",
        description: "We've generated social media posts and website updates for your new product.",
      })
    } catch (error) {
      toast({
        title: "AI Generation Error",
        description: "Could not generate automated content for this product.",
        variant: "destructive"
      })
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold font-headline">Products & Services</h2>
          <p className="text-muted-foreground mt-1">Manage your offerings and let AI handle the marketing.</p>
        </div>
        <Dialog open={isAdding} onOpenChange={setIsAdding}>
          <DialogTrigger asChild>
            <Button className="bg-primary hover:bg-primary/90 gap-2">
              <Plus size={16} /> Add Product
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-auto">
            {!generatedContent ? (
              <>
                <DialogHeader>
                  <DialogTitle>Add New Product</DialogTitle>
                  <DialogDescription>
                    Fill in the details below. Our AI will automatically create marketing content.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-6 py-4">
                  <div className="grid gap-2">
                    <label className="text-sm font-medium">Product Name</label>
                    <Input 
                      placeholder="e.g. Lavender Honey Cake" 
                      value={newProduct.name}
                      onChange={e => setNewProduct({...newProduct, name: e.target.value})}
                    />
                  </div>
                  <div className="grid gap-2">
                    <label className="text-sm font-medium">Price</label>
                    <Input 
                      placeholder="$0.00" 
                      value={newProduct.price}
                      onChange={e => setNewProduct({...newProduct, price: e.target.value})}
                    />
                  </div>
                  <div className="grid gap-2">
                    <label className="text-sm font-medium">Description</label>
                    <Textarea 
                      placeholder="Describe the product features and benefits..." 
                      className="min-h-[100px]"
                      value={newProduct.description}
                      onChange={e => setNewProduct({...newProduct, description: e.target.value})}
                    />
                  </div>
                  <div className="p-8 border-2 border-dashed rounded-xl bg-slate-50 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-slate-100 transition-colors">
                    <ImageIcon className="size-8 text-primary mb-2 opacity-50" />
                    <p className="text-sm font-medium">Add Product Images</p>
                    <p className="text-xs text-muted-foreground">Drag and drop or click to upload</p>
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="ghost" onClick={() => setIsAdding(false)}>Cancel</Button>
                  <Button onClick={handleAddProduct} disabled={isGenerating} className="min-w-[140px]">
                    {isGenerating ? <Loader2 className="animate-spin" /> : "Save & Generate AI"}
                  </Button>
                </DialogFooter>
              </>
            ) : (
              <div className="space-y-6">
                <DialogHeader>
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                    <Sparkles className="text-primary" />
                  </div>
                  <DialogTitle className="text-2xl">AI Generated Content</DialogTitle>
                  <DialogDescription>
                    We've prepared these updates for your social media and website.
                  </DialogDescription>
                </DialogHeader>
                
                <div className="space-y-6">
                  <div className="space-y-3">
                    <h4 className="text-sm font-bold flex items-center gap-2"><Share2 size={16} className="text-primary"/> Social Media Caption</h4>
                    <div className="p-4 bg-slate-50 rounded-lg text-sm italic border">
                      {generatedContent.socialMediaCaption}
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {generatedContent.hashtags.map((h, i) => (
                        <span key={i} className="text-xs text-primary font-medium bg-primary/5 px-2 py-1 rounded">#{h}</span>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-3">
                    <h4 className="text-sm font-bold flex items-center gap-2"><Globe size={16} className="text-primary"/> Website Update</h4>
                    <div className="p-4 bg-slate-50 rounded-lg text-sm border whitespace-pre-line">
                      {generatedContent.websiteContent}
                    </div>
                  </div>
                </div>

                <DialogFooter className="flex gap-2">
                  <Button variant="outline" onClick={() => setGeneratedContent(null)} className="flex-1">Back to Edit</Button>
                  <Button className="flex-1 bg-primary" onClick={() => {
                    setIsAdding(false)
                    setGeneratedContent(null)
                    toast({
                      title: "Content Scheduled",
                      description: "AI posts have been added to your queue and website is updating."
                    })
                  }}>Schedule All Posts</Button>
                </DialogFooter>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex items-center gap-4 bg-white p-4 rounded-xl border shadow-sm">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
          <Input className="pl-10 h-11" placeholder="Search products..." />
        </div>
        <Button variant="outline" className="h-11 px-6">Filter</Button>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {[
          { name: "Sourdough Loaf", price: "$8.50", stock: 24, sales: 120, img: "https://picsum.photos/seed/p1/400/300" },
          { name: "Pain au Chocolat", price: "$4.25", stock: 12, sales: 85, img: "https://picsum.photos/seed/p2/400/300" },
          { name: "Espresso Roast", price: "$18.00", stock: 50, sales: 42, img: "https://picsum.photos/seed/p3/400/300" },
        ].map((product, i) => (
          <Card key={i} className="group overflow-hidden border shadow-sm hover:shadow-md transition-all">
            <div className="relative aspect-video overflow-hidden">
              <img 
                src={product.img} 
                alt={product.name} 
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute top-2 right-2 flex gap-1">
                <Button size="icon" variant="secondary" className="size-8 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"><MoreVertical size={14}/></Button>
              </div>
            </div>
            <CardHeader className="p-4 space-y-1">
              <div className="flex justify-between items-start">
                <CardTitle className="text-lg">{product.name}</CardTitle>
                <span className="font-bold text-primary">{product.price}</span>
              </div>
              <div className="flex gap-4 text-xs text-muted-foreground">
                <span className="flex items-center gap-1"><Package size={12}/> {product.stock} in stock</span>
                <span className="flex items-center gap-1"><TrendingUp size={12}/> {product.sales} sold</span>
              </div>
            </CardHeader>
            <CardFooter className="p-4 pt-0 flex gap-2">
              <Button variant="outline" size="sm" className="flex-1 text-xs"><Sparkles size={12} className="mr-2"/> Boost with AI</Button>
              <Button variant="ghost" size="sm" className="text-xs">Edit Details</Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  )
}
