
import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Bot, Plus, Settings, Home, Zap, Sparkles, KeyRound } from "lucide-react"; // Added KeyRound icon
import { DiscordBot } from "@/entities/DiscordBot";
import { Toaster, toast } from "sonner";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";

const navigationItems = [
  {
    title: "Dashboard",
    url: createPageUrl("Dashboard"),
    icon: Home,
  },
  {
    title: "Add Bot",
    url: createPageUrl("AddBot"),
    icon: Plus,
  },
  {
    title: "Bot Assistant",
    url: createPageUrl("BotAssistant"),
    icon: Sparkles,
  },
  { // New navigation item for Role Management
    title: "Role Management",
    url: createPageUrl("RoleManagement"),
    icon: KeyRound,
  },
];

export default function Layout({ children, currentPageName }) {
  const location = useLocation();
  const [stats, setStats] = useState({ onlineBots: 0, totalServers: 0 });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const bots = await DiscordBot.list();
        const onlineBots = bots.filter(bot => bot.status === 'online').length;
        const totalServers = bots.reduce((sum, bot) => sum + (bot.server_count || 0), 0);
        setStats({ onlineBots, totalServers });
      } catch (error) {
        console.error("Failed to fetch sidebar stats:", error);
      }
    };
    
    fetchStats();
    // Re-fetch stats on navigation to keep them fresh
    const interval = setInterval(fetchStats, 30000); // Refresh every 30 seconds
    return () => clearInterval(interval);
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-[#1a1a1a]">
       <Toaster position="bottom-right" theme="dark" richColors />
      <style>
        {`
          :root {
            --discord-blurple: #5865F2;
            --discord-dark: #2C2F33;
            --discord-darker: #23272A;
            --discord-light: #99AAB5;
            --discord-white: #FFFFFF;
            --discord-green: #43B581;
            --discord-yellow: #FAA61A;
            --discord-red: #F04747;
          }
        `}
      </style>
      
      <SidebarProvider>
        <div className="min-h-screen flex w-full bg-[#1a1a1a]">
          <Sidebar className="border-r border-gray-800 bg-[#2C2F33]">
            <SidebarHeader className="border-b border-gray-800 p-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-r from-[#5865F2] to-[#7289DA] rounded-lg flex items-center justify-center">
                  <Bot className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="font-bold text-white text-lg">BotDash</h2>
                  <p className="text-xs text-gray-400">Discord Bot Manager</p>
                </div>
              </div>
            </SidebarHeader>
            
            <SidebarContent className="p-3">
              <SidebarGroup>
                <SidebarGroupLabel className="text-xs font-semibold text-gray-400 uppercase tracking-wider px-3 py-2">
                  Navigation
                </SidebarGroupLabel>
                <SidebarGroupContent>
                  <SidebarMenu>
                    {navigationItems.map((item) => (
                      <SidebarMenuItem key={item.title}>
                        <SidebarMenuButton 
                          asChild 
                          className={`hover:bg-[#5865F2]/10 hover:text-[#5865F2] transition-all duration-200 rounded-lg mb-1 text-gray-300 ${
                            location.pathname === item.url ? 'bg-[#5865F2]/20 text-[#5865F2] font-medium' : ''
                          }`}
                        >
                          <Link to={item.url} className="flex items-center gap-3 px-3 py-3">
                            <item.icon className="w-5 h-5" />
                            <span className="font-medium">{item.title}</span>
                          </Link>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    ))}
                  </SidebarMenu>
                </SidebarGroupContent>
              </SidebarGroup>

              <SidebarGroup className="mt-8">
                <SidebarGroupLabel className="text-xs font-semibold text-gray-400 uppercase tracking-wider px-3 py-2">
                  Quick Stats
                </SidebarGroupLabel>
                <SidebarGroupContent>
                  <div className="px-3 py-2 space-y-3">
                    <div className="flex items-center gap-3 text-sm">
                      <div className="w-2 h-2 bg-[#43B581] rounded-full"></div>
                      <span className="text-gray-300">Active Bots</span>
                      <span className="ml-auto font-semibold text-white">{stats.onlineBots}</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm">
                      <div className="w-2 h-2 bg-[#FAA61A] rounded-full"></div>
                      <span className="text-gray-300">Total Servers</span>
                      <span className="ml-auto font-semibold text-white">{stats.totalServers}</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm">
                      <div className="w-2 h-2 bg-[#5865F2] rounded-full"></div>
                      <span className="text-gray-300">AI Assistant</span>
                      <span className="ml-auto font-semibold text-[#43B581]">Ready</span>
                    </div>
                  </div>
                </SidebarGroupContent>
              </SidebarGroup>
            </SidebarContent>

            <SidebarFooter className="border-t border-gray-800 p-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-gradient-to-r from-[#5865F2] to-[#7289DA] rounded-full flex items-center justify-center">
                  <span className="text-white font-semibold text-sm">U</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-white text-sm truncate">Bot Manager</p>
                  <p className="text-xs text-gray-400 truncate">Manage your Discord bots</p>
                </div>
                <Settings className="w-4 h-4 text-gray-400 hover:text-white cursor-pointer transition-colors" />
              </div>
            </SidebarFooter>
          </Sidebar>

          <main className="flex-1 flex flex-col bg-[#1a1a1a]">
            <header className="bg-[#2C2F33] border-b border-gray-800 px-6 py-4 md:hidden">
              <div className="flex items-center gap-4">
                <SidebarTrigger className="hover:bg-gray-700 p-2 rounded-lg transition-colors text-white" />
                <h1 className="text-xl font-semibold text-white">BotDash</h1>
              </div>
            </header>

            <div className="flex-1 overflow-auto">
              {children}
            </div>
          </main>
        </div>
      </SidebarProvider>
    </div>
  );
}
