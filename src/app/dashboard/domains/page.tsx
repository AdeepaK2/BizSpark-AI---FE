"use client"

import { Globe, Shield, Activity, Plus, CheckCircle2, Copy } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"

export default function DomainManagement() {
  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold font-headline">Domains</h2>
        <p className="text-muted-foreground mt-1 text-lg">Manage your custom web addresses and DNS settings.</p>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        <Card className="md:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Connected Domains</CardTitle>
              <CardDescription>Your website is active on these domains.</CardDescription>
            </div>
            <Button size="sm" className="bg-primary hover:bg-primary/90 gap-2">
              <Plus size={16} /> Add Custom Domain
            </Button>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow className="bg-slate-50">
                  <TableHead>Domain</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>SSL</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell className="font-medium">
                    <div className="flex flex-col">
                      <span>sunnymorning.biz</span>
                      <span className="text-xs text-muted-foreground">Primary Domain</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <div className="size-2 bg-green-500 rounded-full"></div>
                      <span className="text-xs font-medium">Valid</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="text-green-600 bg-green-50 border-green-200">Active</Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm">Manage</Button>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">
                    <div className="flex flex-col text-muted-foreground">
                      <span>sunnymorning.bizspark.ai</span>
                      <span className="text-xs">System Domain</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <div className="size-2 bg-green-500 rounded-full"></div>
                      <span className="text-xs font-medium">Valid</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="text-green-600 bg-green-50 border-green-200">Active</Badge>
                  </TableCell>
                  <TableCell className="text-right"></TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Buy a Domain</CardTitle>
              <CardDescription>Find a new .com for your brand.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="relative">
                <Globe className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
                <Input className="pl-9 h-10" placeholder="Find your dream domain..." />
              </div>
              <div className="space-y-2">
                {[
                  { name: "sunnymorning.com", price: "$12/yr" },
                  { name: "sunnymorning.co", price: "$24/yr" },
                  { name: "thesunnybakery.com", price: "$9/yr" },
                ].map((d, i) => (
                  <div key={i} className="flex justify-between items-center text-sm p-2 rounded hover:bg-slate-50 border border-transparent hover:border-border cursor-pointer">
                    <span className="font-medium">{d.name}</span>
                    <span className="text-primary font-bold">{d.price}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>DNS Configuration</CardTitle>
          <CardDescription>If you're using a domain from another provider, point these records to BizSpark.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <h4 className="text-sm font-bold uppercase tracking-wider text-slate-500">A Record</h4>
              <div className="p-4 bg-slate-50 rounded-lg flex items-center justify-between border">
                <div>
                  <p className="text-xs font-medium text-muted-foreground mb-1">Type: A</p>
                  <p className="font-mono text-sm">76.76.21.21</p>
                </div>
                <Button variant="ghost" size="icon"><Copy size={16}/></Button>
              </div>
            </div>
            <div className="space-y-4">
              <h4 className="text-sm font-bold uppercase tracking-wider text-slate-500">CNAME Record</h4>
              <div className="p-4 bg-slate-50 rounded-lg flex items-center justify-between border">
                <div>
                  <p className="text-xs font-medium text-muted-foreground mb-1">Type: CNAME</p>
                  <p className="font-mono text-sm text-wrap break-all">cname.bizspark.ai</p>
                </div>
                <Button variant="ghost" size="icon"><Copy size={16}/></Button>
              </div>
            </div>
          </div>
          <div className="pt-4 border-t flex gap-3 items-start">
            <Shield className="text-primary shrink-0" size={20} />
            <div>
              <p className="text-sm font-bold mb-1">Secure by Default</p>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Every domain connected to BizSpark AI automatically receives an SSL certificate for secure HTTPS connections. No renewal fees or setup required.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}