"use client"

import { useState, useEffect } from "react"
import {
  Users,
  UserPlus,
  MoreVertical,
  ShieldCheck,
  ShieldAlert,
  User,
  Mail,
  Loader2,
  Trash2
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { apiClient } from "@/lib/api-client"

type Role = "Owner" | "Admin" | "Editor" | "Viewer"

interface TeamMember {
  id: string
  name: string
  email: string
  role: Role
  status: "Active" | "Pending"
  avatar?: string
}

export default function TeamManagementPage() {
  const { toast } = useToast()
  const [activeBiz, setActiveBiz] = useState<any>(null)
  const [isInviting, setIsInviting] = useState(false)
  const [isSending, setIsSending] = useState(false)
  const [inviteEmail, setInviteEmail] = useState("")
  const [inviteRole, setInviteRole] = useState<Role>("Editor")

  const [team, setTeam] = useState<TeamMember[]>([
    { id: "1", name: "Jane Doe", email: "jane@example.com", role: "Owner", status: "Active", avatar: "https://picsum.photos/seed/u1/100/100" },
    { id: "2", name: "Alex Smith", email: "alex@design.com", role: "Admin", status: "Active", avatar: "https://picsum.photos/seed/u2/100/100" },
    { id: "3", name: "Sarah Chen", email: "sarah@marketing.com", role: "Editor", status: "Pending", avatar: "https://picsum.photos/seed/u3/100/100" },
  ])

  useEffect(() => {
    const fetchBiz = async () => {
      const activeId = localStorage.getItem("active_biz_id")
      if (activeId) {
        try {
          const res = await apiClient.get(`/business/${activeId}`)
          setActiveBiz(res.data)
        } catch (e) {
          console.error(e)
        }
      }
    }

    fetchBiz()
  }, [])

  const handleInvite = async () => {
    if (!inviteEmail) return

    setIsSending(true)
    // Mock API call
    await new Promise(resolve => setTimeout(resolve, 1500))

    const newMember: TeamMember = {
      id: Math.random().toString(36).substring(7),
      name: inviteEmail.split('@')[0],
      email: inviteEmail,
      role: inviteRole,
      status: "Pending"
    }

    setTeam([...team, newMember])
    setIsSending(false)
    setIsInviting(false)
    setInviteEmail("")

    toast({
      title: "Invitation Sent",
      description: `An invite has been sent to ${inviteEmail}.`,
    })
  }

  const removeMember = (id: string) => {
    setTeam(team.filter(m => m.id !== id))
    toast({
      title: "Member Removed",
      description: "Team member access has been revoked.",
    })
  }

  if (!activeBiz) return null

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold font-headline">Team Management</h2>
          <p className="text-muted-foreground mt-1 text-lg">Manage access for {activeBiz.name}.</p>
        </div>
        <Dialog open={isInviting} onOpenChange={setIsInviting}>
          <DialogTrigger asChild>
            <Button className="bg-primary hover:bg-primary/90 gap-2">
              <UserPlus size={16} /> Invite Member
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Invite a collaborator</DialogTitle>
              <DialogDescription>
                Invite someone to help manage {activeBiz.name}. They will receive an email to join your team.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <label className="text-sm font-medium">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 size-4 text-muted-foreground" />
                  <Input
                    placeholder="teammate@example.com"
                    className="pl-10"
                    value={inviteEmail}
                    onChange={e => setInviteEmail(e.target.value)}
                  />
                </div>
              </div>
              <div className="grid gap-2">
                <label className="text-sm font-medium">Role</label>
                <Select value={inviteRole} onValueChange={(v: Role) => setInviteRole(v)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Admin">Admin (Full control)</SelectItem>
                    <SelectItem value="Editor">Editor (Content & Products)</SelectItem>
                    <SelectItem value="Viewer">Viewer (Read-only)</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-[11px] text-muted-foreground mt-1 px-1">
                  {inviteRole === "Admin" && "Can manage users, settings, and all content."}
                  {inviteRole === "Editor" && "Can update website sections and products."}
                  {inviteRole === "Viewer" && "Can only view analytics and dashboard data."}
                </p>
              </div>
            </div>
            <DialogFooter>
              <Button variant="ghost" onClick={() => setIsInviting(false)}>Cancel</Button>
              <Button onClick={handleInvite} disabled={isSending || !inviteEmail} className="min-w-[120px]">
                {isSending ? <Loader2 className="animate-spin" /> : "Send Invite"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        <Card className="md:col-span-2 shadow-sm border-2">
          <CardHeader>
            <CardTitle>Current Members</CardTitle>
            <CardDescription>All users with access to this business account.</CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow className="bg-slate-50">
                  <TableHead className="w-[280px]">User</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {team.map((member) => (
                  <TableRow key={member.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="size-8">
                          <AvatarImage src={member.avatar} />
                          <AvatarFallback>{member.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                        </Avatar>
                        <div className="flex flex-col">
                          <span className="font-bold text-sm">{member.name}</span>
                          <span className="text-xs text-muted-foreground">{member.email}</span>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1.5">
                        {member.role === "Owner" ? <ShieldCheck className="size-4 text-primary" /> : <ShieldAlert className="size-4 text-slate-400" />}
                        <span className="text-sm font-medium">{member.role}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={member.status === "Active" ? "outline" : "secondary"} className={member.status === "Active" ? "text-green-600 border-green-200 bg-green-50" : ""}>
                        {member.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      {member.role !== "Owner" && (
                        <Button variant="ghost" size="icon" onClick={() => removeMember(member.id)} className="text-muted-foreground hover:text-destructive">
                          <Trash2 size={16} />
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card className="border-primary/20 bg-primary/[0.02]">
            <CardHeader>
              <div className="size-10 rounded-xl bg-primary/10 flex items-center justify-center mb-2">
                <ShieldCheck className="text-primary" />
              </div>
              <CardTitle className="text-lg">Permission Roles</CardTitle>
              <CardDescription>Understand how access works.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {[
                { label: "Owner", desc: "Full ownership and billing control." },
                { label: "Admin", desc: "Can manage team, site, and products." },
                { label: "Editor", desc: "Can update content and products." },
                { label: "Viewer", desc: "Can only view metrics and site." }
              ].map((role, i) => (
                <div key={i} className="pb-3 border-b last:border-0 last:pb-0">
                  <p className="text-sm font-bold">{role.label}</p>
                  <p className="text-xs text-muted-foreground leading-relaxed">{role.desc}</p>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Security Log</CardTitle>
              <CardDescription>Recent access events.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {[
                { event: "Login from NY", time: "2h ago" },
                { event: "Role changed: Sarah", time: "5h ago" },
                { event: "New invite sent", time: "1d ago" },
              ].map((log, i) => (
                <div key={i} className="flex justify-between items-center text-xs">
                  <span className="font-medium">{log.event}</span>
                  <span className="text-muted-foreground">{log.time}</span>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
