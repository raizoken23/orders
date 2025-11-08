import AppSidebar from '@/components/app-sidebar'
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar'
import { SidebarTrigger } from '@/components/ui/sidebar'
import { Button } from '@/components/ui/button'
import { PanelLeft } from 'lucide-react'

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-14 items-center gap-4 border-b bg-card px-4 sm:px-6 md:hidden">
          <SidebarTrigger asChild>
            <Button variant="ghost" size="icon">
              <PanelLeft />
              <span className="sr-only">Toggle Menu</span>
            </Button>
          </SidebarTrigger>
          <h1 className="text-lg font-semibold font-headline">ScopeSheet Pro</h1>
        </header>
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          {children}
        </main>
      </SidebarInset>
    </SidebarProvider>
  )
}
