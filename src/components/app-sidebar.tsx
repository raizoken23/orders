'use client'

import { usePathname } from 'next/navigation'
import Link from 'next/link'
import {
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
  SidebarTrigger,
} from '@/components/ui/sidebar'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { LogoIcon } from '@/components/icons'
import {
  LayoutDashboard,
  FileText,
  Settings,
  PanelLeft,
  FileUp,
  Image,
  AreaChart,
  Sparkles,
  FilePlus,
  CircleDollarSign,
  Briefcase,
} from 'lucide-react'

const links = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/import-claim', label: 'New Sheet', icon: FileUp },
  { href: '/scope-sheet', label: 'Scope Sheet', icon: FileText },
  { href: '/image-analysis', label: 'Image Analysis', icon: Image },
  { href: '/roof-diagram', label: 'Roof Diagram', icon: AreaChart },
  { href: '/sub-sheets', label: 'Sub Sheets', icon: FilePlus },
  { href: '/hub', label: 'Investigator Hub', icon: Sparkles },
]

const bottomLinks = [
  { href: '/pricing', label: 'Pricing', icon: CircleDollarSign },
  { href: '/settings', label: 'Settings', icon: Settings },
]

export default function AppSidebar() {
  const pathname = usePathname()

  return (
    <Sidebar>
      <SidebarHeader className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <LogoIcon className="size-7 text-primary" />
          <h1 className="text-lg font-semibold font-headline text-sidebar-foreground">
            ScopeSheet Pro
          </h1>
        </div>
        <div className="md:hidden">
          <SidebarTrigger>
            <PanelLeft />
            <span className="sr-only">Toggle Menu</span>
          </SidebarTrigger>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu>
          {links.map((link) => (
            <SidebarMenuItem key={link.href}>
              <SidebarMenuButton
                asChild
                isActive={pathname.startsWith(link.href)}
                tooltip={link.label}
              >
                <Link href={link.href}>
                  <link.icon />
                  <span>{link.label}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter className="mt-auto">
        <SidebarMenu>
          {bottomLinks.map((link) => (
            <SidebarMenuItem key={link.href}>
              <SidebarMenuButton
                asChild
                isActive={pathname.startsWith(link.href)}
                tooltip={link.label}
              >
                <Link href={link.href}>
                  <link.icon />
                  <span>{link.label}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
          <SidebarMenuItem>
            <SidebarMenuButton tooltip="Profile">
              <Avatar className="size-7">
                <AvatarImage src="https://picsum.photos/seed/avatar/40/40" />
                <AvatarFallback>JD</AvatarFallback>
              </Avatar>
              <span>John Doe</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  )
}
