'use client';

import React from 'react';
import { motion } from 'framer-motion';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
  SidebarInset,
} from '@/components/ui/sidebar';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import {
  LayoutDashboard,
  FileText,
  Upload,
  MessageSquare,
  BarChart3,
  Users,
  Settings,
  HelpCircle,
  Brain,
  Database,
  Zap,
  Bell,
  Search,
  Plus,
  ChevronRight,
  LogOut,
  User,
  Sparkles,
} from 'lucide-react';

import { useRouter } from 'next/navigation';
import { logoutUser } from '@/lib/auth';

// Navigation items
type NavigationItem = {
  title: string;
  url: string;
  icon: React.ComponentType<any>;
  badge?: string;
  isActive?: boolean;
};

type NavigationSection = {
  title: string;
  items: NavigationItem[];
};

const navigationItems: NavigationSection[] = [
  {
    title: "Overview",
    items: [
      {
        title: "Dashboard",
        url: "/dashboard",
        icon: LayoutDashboard,
        isActive: true,
      },
      {
        title: "Analytics",
        url: "/analytics",
        icon: BarChart3,
        badge: "New",
      },
    ],
  },
  {
    title: "Proposals",
    items: [
      {
        title: "All Proposals",
        url: "/proposals",
        icon: FileText,
        badge: "12",
      },
      {
        title: "Create New",
        url: "/proposals/create",
        icon: Plus,
      },
      {
        title: "Templates",
        url: "/templates",
        icon: Database,
      },
    ],
  },
  {
    title: "AI Tools",
    items: [
      {
        title: "AI Assistant",
        url: "/ai-assistant",
        icon: Brain,
        badge: "Beta",
      },
      {
        title: "Quick Chat",
        url: "/chat",
        icon: MessageSquare,
      },
      {
        title: "Upload RFP",
        url: "/upload",
        icon: Upload,
      },
      {
        title: "Enhancements",
        url: "/enhancements",
        icon: Sparkles,
      },
    ],
  },
];

const bottomItems = [
  {
    title: "Settings",
    url: "/settings",
    icon: Settings,
  },
  {
    title: "Help & Support",
    url: "/help",
    icon: HelpCircle,
  },
];

function AppSidebar() {
  const router = useRouter();

  const handleLogout = () => {
    logoutUser();
    router.push('/login');
  };

  return (
    <Sidebar variant="inset">
      <SidebarHeader>
        <div className="flex items-center gap-2 px-4 py-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <Brain className="h-4 w-4" />
          </div>
          <div>
            <p className="text-sm font-semibold">ProposalGenie</p>
            <p className="text-xs text-muted-foreground">AI-Powered Proposals</p>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent>
        {navigationItems.map((section) => (
          <SidebarGroup key={section.title}>
            <SidebarGroupLabel>{section.title}</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {section.items.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      asChild
                      isActive={!!item.isActive}
                      className="group relative"
                    >
                      <a href={item.url} className="flex items-center gap-2">
                        <item.icon className="h-4 w-4" />
                        <span className="flex-1">{item.title}</span>
                        {item.badge && (
                          <Badge
                            variant={item.badge === "New" || item.badge === "Beta" ? "default" : "secondary"}
                            className="ml-auto text-xs h-5"
                          >
                            {item.badge}
                          </Badge>
                        )}
                      </a>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>

      <SidebarFooter>
        <SidebarMenu>
          {bottomItems.map((item) => (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton asChild>
                <a href={item.url} className="flex items-center gap-2">
                  <item.icon className="h-4 w-4" />
                  <span>{item.title}</span>
                </a>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>

        <Separator className="my-2" />

        {/* User Profile */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton className="w-full justify-start">
              <Avatar className="h-6 w-6">
                <AvatarImage src="/file.svg" alt="User" />
                <AvatarFallback>JD</AvatarFallback>
              </Avatar>
              <div className="flex flex-col items-start text-left">
                <span className="text-sm font-medium">John Doe</span>
                <span className="text-xs text-muted-foreground">john@company.com</span>
              </div>
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent side="top" className="w-56">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <User className="mr-2 h-4 w-4" />
              Profile
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Settings className="mr-2 h-4 w-4" />
              Settings
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout} className="text-red-600">
              <LogOut className="mr-2 h-4 w-4" />
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarFooter>
    </Sidebar>
  );
}

function TopBar() {
  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="flex h-16 shrink-0 items-center gap-2 border-b px-4"
    >
      <SidebarTrigger className="-ml-1" />
      <Separator orientation="vertical" className="mr-2 h-4" />

      {/* Breadcrumb */}
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem className="hidden md:block">
            <BreadcrumbLink href="/dashboard">ProposalGenie</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator className="hidden md:block" />
          <BreadcrumbItem>
            <BreadcrumbPage>Dashboard</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="ml-auto flex items-center gap-2">
        {/* Search */}
        <Button variant="outline" size="sm" className="hidden md:flex">
          <Search className="mr-2 h-4 w-4" />
          Search proposals...
        </Button>

        {/* Quick Actions */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button size="sm" className="gap-2">
              <Plus className="h-4 w-4" />
              <span className="hidden sm:inline">New</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem>
              <Upload className="mr-2 h-4 w-4" />
              Upload RFP
            </DropdownMenuItem>
            <DropdownMenuItem>
              <MessageSquare className="mr-2 h-4 w-4" />
              Start Chat
            </DropdownMenuItem>
            <DropdownMenuItem>
              <FileText className="mr-2 h-4 w-4" />
              From Template
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Notifications */}
        <Button variant="ghost" size="sm" className="relative">
          <Bell className="h-4 w-4" />
          <span className="absolute -top-1 -right-1 h-2 w-2 bg-red-500 rounded-full"></span>
        </Button>
      </div>
    </motion.header>
  );
}

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <AppSidebar />
        <SidebarInset>
          <TopBar />
          <motion.main
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="flex-1 overflow-auto p-4 md:p-6"
          >
            <div className="mx-auto max-w-7xl">
              {children}
            </div>
          </motion.main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}