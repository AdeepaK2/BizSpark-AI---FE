"use client"

import { useState } from "react"
import { 
  Instagram, 
  Facebook, 
  Twitter, 
  Share2, 
  Plus, 
  Clock, 
  Calendar,
  AlertCircle,
  Trash2,
  Edit3,
  ImageIcon,
  ArrowLeft,
  ChevronRight,
  TrendingUp,
  MessageSquare,
  Heart,
  Sparkles,
  CheckCircle2,
  MoreVertical,
  Image as ImageIconLucide,
  PlusCircle,
  X
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle 
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import { cn } from "@/lib/utils"

const PLATFORMS = [
  { id: "instagram", name: "Instagram", icon: Instagram, color: "text-pink-600", bg: "bg-pink-50", connected: true, followers: "2.4k", handle: "@sunny_bakery" },
  { id: "facebook", name: "Facebook", icon: Facebook, color: "text-blue-700", bg: "bg-blue-50", connected: true, followers: "1.2k", handle: "SunnyMorningBakery" },
  { id: "tiktok", name: "TikTok", icon: Share2, color: "text-slate-900", bg: "bg-slate-100", connected: false },
  { id: "twitter", name: "Twitter / X", icon: Twitter, color: "text-slate-900", bg: "bg-slate-100", connected: false },
]

interface SocialPost {
  id: string
  platform: string
  content: string
  imageUrl: string
  additionalImages?: string[]
  status: "Posted" | "Scheduled" | "Draft"
  date: string
  engagement?: { likes: string, comments: string }
}

export default function SocialMediaPage() {
  const { toast } = useToast()
  const [selectedPlatformId, setSelectedPlatformId] = useState<string | null>(null)
  const [editingPost, setEditingPost] = useState<SocialPost | null>(null)
  const [posts, setPosts] = useState<SocialPost[]>([
    { 
      id: "p1", 
      platform: "instagram", 
      content: "Nothing beats the smell of fresh sourdough in the morning! 🥖✨ Come grab a loaf before they're gone.",
      imageUrl: "https://picsum.photos/seed/post1/600/600",
      status: "Posted",
      date: "2 hours ago",
      engagement: { likes: "124", comments: "12" }
    },
    { 
      id: "p2", 
      platform: "instagram", 
      content: "Meet the team! Our bakers start at 3 AM to ensure your coffee has the perfect companion. ☕🥐",
      imageUrl: "https://picsum.photos/seed/post2/600/600",
      additionalImages: ["https://picsum.photos/seed/post2b/600/600"],
      status: "Posted",
      date: "Yesterday",
      engagement: { likes: "89", comments: "5" }
    },
    { 
      id: "p3", 
      platform: "facebook", 
      content: "Big news! We're extending our weekend hours. Now open until 6 PM on Saturdays and Sundays. See you there!",
      imageUrl: "https://picsum.photos/seed/post3/600/400",
      status: "Posted",
      date: "3 days ago",
      engagement: { likes: "45", comments: "8" }
    },
    { 
      id: "p4", 
      platform: "instagram", 
      content: "Coming soon: Lavender Honey Macarons. AI predicted you'd love these! 💜🍯 #NewFlavor",
      imageUrl: "https://picsum.photos/seed/post4/600/600",
      status: "Scheduled",
      date: "Tomorrow, 10:00 AM"
    }
  ])

  const selectedPlatform = PLATFORMS.find(p => p.id === selectedPlatformId)
  const filteredPosts = posts.filter(p => p.platform === selectedPlatformId)

  const handleDeletePost = (id: string, e: React.MouseEvent) => {
    e.stopPropagation()
    setPosts(posts.filter(p => p.id !== id))
    toast({
      title: "Post Removed",
      description: "The post has been successfully deleted from your history.",
    })
  }

  const handleChangeImage = (id: string, e: React.MouseEvent) => {
    e.stopPropagation()
    const newUrl = `https://picsum.photos/seed/${Math.random()}/600/600`
    setPosts(posts.map(p => p.id === id ? { ...p, imageUrl: newUrl } : p))
    toast({
      title: "Image Updated",
      description: "AI has swapped the post image for a new variation.",
    })
  }

  const handleSaveEdit = () => {
    if (!editingPost) return
    setPosts(posts.map(p => p.id === editingPost.id ? editingPost : p))
    setEditingPost(null)
    toast({
      title: "Changes Saved",
      description: "The post has been updated across all channels.",
    })
  }

  const addAdditionalImage = () => {
    if (!editingPost) return
    const newImages = [...(editingPost.additionalImages || []), `https://picsum.photos/seed/${Math.random()}/600/600`]
    setEditingPost({ ...editingPost, additionalImages: newImages })
  }

  const removeAdditionalImage = (index: number) => {
    if (!editingPost) return
    const newImages = [...(editingPost.additionalImages || [])]
    newImages.splice(index, 1)
    setEditingPost({ ...editingPost, additionalImages: newImages })
  }

  if (selectedPlatformId && selectedPlatform) {
    return (
      <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => setSelectedPlatformId(null)}>
            <ArrowLeft size={20} />
          </Button>
          <div>
            <div className="flex items-center gap-2">
              <selectedPlatform.icon size={24} className={selectedPlatform.color} />
              <h2 className="text-3xl font-bold font-headline">{selectedPlatform.name}</h2>
            </div>
            <p className="text-muted-foreground">{selectedPlatform.handle} • {selectedPlatform.followers} Followers</p>
          </div>
        </div>

        <div className="grid lg:grid-cols-12 gap-8">
          <div className="lg:col-span-8 space-y-6">
            <div className="flex items-center justify-between bg-white p-4 rounded-xl border shadow-sm">
              <Tabs defaultValue="all" className="w-full">
                <div className="flex items-center justify-between mb-4">
                  <TabsList>
                    <TabsTrigger value="all">All Posts</TabsTrigger>
                    <TabsTrigger value="posted">Published</TabsTrigger>
                    <TabsTrigger value="scheduled">Scheduled</TabsTrigger>
                  </TabsList>
                  <Button size="sm" className="gap-2">
                    <Plus size={16} /> New Post
                  </Button>
                </div>

                <TabsContent value="all" className="space-y-4 m-0">
                  {filteredPosts.length === 0 ? (
                    <div className="text-center py-20 border-2 border-dashed rounded-2xl bg-slate-50">
                      <selectedPlatform.icon size={40} className="mx-auto text-muted-foreground/30 mb-4" />
                      <p className="text-muted-foreground font-medium">No posts found for this platform yet.</p>
                      <Button variant="link" className="text-primary mt-2">Generate your first AI post</Button>
                    </div>
                  ) : (
                    filteredPosts.map((post) => (
                      <Card 
                        key={post.id} 
                        className="overflow-hidden border-2 hover:border-primary/20 transition-all group cursor-pointer"
                        onClick={() => setEditingPost(post)}
                      >
                        <div className="flex flex-col md:flex-row">
                          <div className="w-full md:w-48 h-48 relative overflow-hidden bg-slate-100 border-r">
                            <img src={post.imageUrl} alt="Post content" className="w-full h-full object-cover" />
                            {post.additionalImages && post.additionalImages.length > 0 && (
                              <div className="absolute bottom-2 right-2 bg-black/60 text-white text-[10px] px-2 py-0.5 rounded-full flex items-center gap-1">
                                <ImageIconLucide size={10} /> +{post.additionalImages.length}
                              </div>
                            )}
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                              <Button size="icon" variant="secondary" className="size-8 rounded-full" onClick={(e) => handleChangeImage(post.id, e)}>
                                <Edit3 size={14} />
                              </Button>
                              <Button size="icon" variant="destructive" className="size-8 rounded-full" onClick={(e) => handleDeletePost(post.id, e)}>
                                <Trash2 size={14} />
                              </Button>
                            </div>
                          </div>
                          <div className="flex-1 p-5 flex flex-col">
                            <div className="flex justify-between items-start mb-3">
                              <Badge variant={post.status === "Posted" ? "outline" : "secondary"} className={cn(
                                post.status === "Posted" ? "bg-green-50 text-green-700 border-green-200" : 
                                post.status === "Scheduled" ? "bg-blue-50 text-blue-700 border-blue-200" : ""
                              )}>
                                {post.status}
                              </Badge>
                              <span className="text-xs text-muted-foreground font-medium flex items-center gap-1">
                                <Clock size={12} /> {post.date}
                              </span>
                            </div>
                            <p className="text-sm text-slate-700 leading-relaxed mb-4 flex-1">{post.content}</p>
                            
                            {post.status === "Posted" && post.engagement && (
                              <div className="flex items-center gap-6 pt-4 border-t">
                                <div className="flex items-center gap-1.5 text-xs font-bold text-slate-500">
                                  <Heart size={14} className="text-pink-500" /> {post.engagement.likes}
                                </div>
                                <div className="flex items-center gap-1.5 text-xs font-bold text-slate-500">
                                  <MessageSquare size={14} className="text-blue-500" /> {post.engagement.comments}
                                </div>
                                <div className="flex items-center gap-1.5 text-xs font-bold text-green-600 ml-auto">
                                  <TrendingUp size={14} /> High Reach
                                </div>
                              </div>
                            )}

                            {post.status === "Scheduled" && (
                              <div className="flex items-center gap-2 pt-4 border-t">
                                <Button size="sm" variant="outline" className="text-xs h-8">Reschedule</Button>
                                <Button size="sm" variant="ghost" className="text-xs h-8 text-destructive hover:text-destructive">Cancel</Button>
                              </div>
                            )}
                          </div>
                        </div>
                      </Card>
                    ))
                  )}
                </TabsContent>
              </Tabs>
            </div>
          </div>

          <div className="lg:col-span-4 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Platform Analytics</CardTitle>
                <CardDescription>Performance for {selectedPlatform.name}.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-slate-50 rounded-xl border">
                    <p className="text-xs text-muted-foreground mb-1 uppercase tracking-wider font-bold">Impressions</p>
                    <p className="text-xl font-bold">12.4k</p>
                    <p className="text-[10px] text-green-600 font-bold mt-1">+14.2%</p>
                  </div>
                  <div className="p-4 bg-slate-50 rounded-xl border">
                    <p className="text-xs text-muted-foreground mb-1 uppercase tracking-wider font-bold">Clicks</p>
                    <p className="text-xl font-bold">842</p>
                    <p className="text-[10px] text-green-600 font-bold mt-1">+5.8%</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between text-xs">
                      <span className="font-medium">Audience Retention</span>
                      <span className="font-bold">68%</span>
                    </div>
                    <Progress value={68} className="h-1.5" />
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-xs">
                      <span className="font-medium">Organic Growth</span>
                      <span className="font-bold">42%</span>
                    </div>
                    <Progress value={42} className="h-1.5" />
                  </div>
                </div>

                <Button variant="outline" className="w-full text-xs">Download Full Report</Button>
              </CardContent>
            </Card>

            <div className="p-6 rounded-2xl bg-primary/10 border border-primary/20 space-y-3">
              <div className="flex items-center gap-2 text-primary">
                <Sparkles size={18} />
                <h4 className="font-bold text-sm">AI Agent Recommendation</h4>
              </div>
              <p className="text-xs text-slate-700 leading-relaxed">
                Based on your recent posts, carousel content on <strong>{selectedPlatform.name}</strong> receives 3x more engagement. We recommend converting your next 2 drafts into carousels.
              </p>
              <Button size="sm" className="w-full bg-primary h-8 text-[11px] font-bold">Apply Automation Rule</Button>
            </div>
          </div>
        </div>

        {/* Edit Post Dialog */}
        <Dialog open={!!editingPost} onOpenChange={(open) => !open && setEditingPost(null)}>
          <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
            {editingPost && (
              <>
                <DialogHeader>
                  <DialogTitle className="flex items-center gap-2">
                    <Edit3 size={18} className="text-primary" />
                    Edit {selectedPlatform.name} Post
                  </DialogTitle>
                  <DialogDescription>
                    Review and customize your AI-generated content before it goes live.
                  </DialogDescription>
                </DialogHeader>

                <div className="grid gap-6 py-4">
                  <div className="grid gap-2">
                    <Label htmlFor="caption" className="font-bold text-sm">Caption</Label>
                    <Textarea 
                      id="caption"
                      value={editingPost.content}
                      onChange={(e) => setEditingPost({ ...editingPost, content: e.target.value })}
                      className="min-h-[120px] text-sm leading-relaxed"
                      placeholder="Write your engaging caption here..."
                    />
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <Label className="font-bold text-sm">Post Media</Label>
                      {selectedPlatform.id === "instagram" && (
                        <Button variant="ghost" size="sm" onClick={addAdditionalImage} className="text-primary h-8 gap-1.5">
                          <PlusCircle size={14} /> Add Carousel Image
                        </Button>
                      )}
                    </div>
                    
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                      {/* Main Image */}
                      <div className="relative aspect-square rounded-xl overflow-hidden border-2 border-primary/20 group">
                        <img src={editingPost.imageUrl} alt="Main" className="w-full h-full object-cover" />
                        <div className="absolute top-2 left-2 bg-primary text-white text-[10px] font-bold px-2 py-0.5 rounded shadow-sm">Main</div>
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <Button variant="secondary" size="sm" className="h-7 text-[10px]" onClick={() => setEditingPost({ ...editingPost, imageUrl: `https://picsum.photos/seed/${Math.random()}/600/600` })}>Swap AI</Button>
                        </div>
                      </div>

                      {/* Additional Carousel Images */}
                      {editingPost.additionalImages?.map((img, idx) => (
                        <div key={idx} className="relative aspect-square rounded-xl overflow-hidden border group">
                          <img src={img} alt={`Carousel ${idx}`} className="w-full h-full object-cover" />
                          <Button 
                            variant="destructive" 
                            size="icon" 
                            className="absolute top-1 right-1 size-6 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                            onClick={() => removeAdditionalImage(idx)}
                          >
                            <X size={12} />
                          </Button>
                        </div>
                      ))}

                      {/* Add Placeholder for Carousel */}
                      {selectedPlatform.id === "instagram" && (!editingPost.additionalImages || editingPost.additionalImages.length < 9) && (
                        <button 
                          onClick={addAdditionalImage}
                          className="aspect-square rounded-xl border-2 border-dashed border-slate-200 bg-slate-50 flex flex-col items-center justify-center text-muted-foreground hover:bg-slate-100 hover:border-primary/20 transition-all"
                        >
                          <Plus size={20} />
                          <span className="text-[10px] mt-1 font-medium">Add to Carousel</span>
                        </button>
                      )}
                    </div>
                    <p className="text-[10px] text-muted-foreground italic">
                      {selectedPlatform.id === "instagram" ? "Supports up to 10 images as a carousel." : "This platform currently supports a single primary image."}
                    </p>
                  </div>
                </div>

                <DialogFooter className="flex gap-2">
                  <Button variant="ghost" onClick={() => setEditingPost(null)} className="flex-1">Discard Changes</Button>
                  <Button onClick={handleSaveEdit} className="flex-1 bg-primary">Save & Ready to Post</Button>
                </DialogFooter>
              </>
            )}
          </DialogContent>
        </Dialog>
      </div>
    )
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div>
        <h2 className="text-3xl font-bold font-headline">Social Media Manager</h2>
        <p className="text-muted-foreground mt-1 text-lg">Centralized hub for all your business social accounts.</p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        {PLATFORMS.map((platform, i) => (
          <Card 
            key={i} 
            className={cn(
              "border-2 shadow-sm overflow-hidden transition-all cursor-pointer group",
              platform.connected ? "hover:border-primary/40 hover:shadow-md" : "opacity-80 grayscale-[0.5]"
            )}
            onClick={() => platform.connected && setSelectedPlatformId(platform.id)}
          >
            <CardContent className="pt-6">
              <div className="flex items-center justify-between mb-6">
                <div className={cn("p-3 rounded-xl transition-colors", platform.bg, platform.color, platform.connected && "group-hover:bg-primary group-hover:text-white")}>
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
              <div className="flex items-center justify-between">
                <Button 
                  variant={platform.connected ? "ghost" : "default"} 
                  className={cn("px-0 hover:bg-transparent font-bold text-xs", platform.connected ? "text-primary" : "bg-primary w-full h-10")}
                  onClick={(e) => {
                    if (platform.connected) e.stopPropagation()
                  }}
                >
                  {platform.connected ? "Manage Feed" : "Connect Now"}
                </Button>
                {platform.connected && <ChevronRight size={16} className="text-primary opacity-0 group-hover:opacity-100 transition-opacity" />}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <Card className="border-2">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Global Content Queue</CardTitle>
                <CardDescription>Scheduled posts across all your connected platforms.</CardDescription>
              </div>
              <Button size="sm" variant="outline" className="gap-2"><Calendar size={14}/> Full Calendar</Button>
            </CardHeader>
            <CardContent className="space-y-4">
              {[
                { time: "Today, 4:00 PM", platform: "Instagram", title: "New Product: Artisanal Sourdough", status: "Review" },
                { time: "Tomorrow, 10:00 AM", platform: "Facebook", title: "Weekend Brunch Specials", status: "Scheduled" },
                { time: "Monday, 9:00 AM", platform: "Twitter", title: "Morning coffee rewards update", status: "Draft" },
              ].map((post, i) => (
                <div key={i} className="flex items-center justify-between p-4 border rounded-xl hover:bg-slate-50 transition-colors group">
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
                      <p className="font-bold text-sm group-hover:text-primary transition-colors">{post.title}</p>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm">Edit Draft</Button>
                </div>
              ))}
              <Button className="w-full h-14 border-2 border-dashed bg-slate-50 hover:bg-slate-100 hover:border-primary/20 text-muted-foreground hover:text-primary font-bold transition-all gap-2 rounded-2xl">
                <Plus size={18} /> Create Custom Cross-Platform Post
              </Button>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="border-2 shadow-md">
            <CardHeader>
              <CardTitle>Global Social Health</CardTitle>
              <CardDescription>Overall engagement performance.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="font-medium">Posting Frequency</span>
                  <span className="text-green-600 font-bold">Optimal</span>
                </div>
                <Progress value={85} className="h-2.5" />
              </div>
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="font-medium">Avg. Engagement Rate</span>
                  <span className="text-primary font-bold">4.2%</span>
                </div>
                <Progress value={60} className="h-2.5" />
              </div>
              <div className="p-4 bg-primary/5 rounded-2xl flex gap-3 border border-primary/10">
                <AlertCircle className="text-primary shrink-0" size={20} />
                <p className="text-xs text-slate-700 leading-relaxed font-medium">
                  <strong>Growth Tip:</strong> Video posts on Facebook have increased your reach by 12% this week. Keep it up!
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Recent Alerts</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {[
                { icon: MessageSquare, text: "5 new comments on IG", time: "10m ago" },
                { icon: CheckCircle2, text: "FB Post published", time: "2h ago" },
              ].map((alert, i) => (
                <div key={i} className="flex items-center gap-3 text-sm">
                  <alert.icon size={14} className="text-primary" />
                  <span className="flex-1">{alert.text}</span>
                  <span className="text-[10px] text-muted-foreground">{alert.time}</span>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
