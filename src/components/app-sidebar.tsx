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
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { LogoIcon } from '@/components/icons'
import {
  LayoutDashboard,
  FileText,
  PenSquare,
  Scan,
  Settings,
  User,
  PanelLeft,
  FilePlus2,
  DollarSign,
  BookUser,
  FileUp,
} from 'lucide-react'

const links = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/scope-sheet', label: 'Scope Sheet', icon: FileText },
  { href: '/import-claim', label: 'Import Claim', icon: FileUp },
  { href: '/sub-sheets', label: 'Sub Sheets', icon: FilePlus2 },
  { href: '/roof-diagram', label: 'Roof Diagram', icon: PenSquare },
  { href: '/image-analysis', label: 'Image Analysis', icon: Scan },
  { href: '/pricing', label: 'Pricing', icon: DollarSign },
  { href: '/hub', label: 'Investigator Hub', icon: BookUser },
]

const bottomLinks = [{ href: '/settings', label: 'Settings', icon: Settings }]

export default function AppSidebar() {
  const pathname = usePathname()

  return (
    <Sidebar>
      <SidebarHeader className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <LogoIcon className="size-7 text-accent" />
          <h1 className="text-lg font-semibold font-headline text-primary-foreground">
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
