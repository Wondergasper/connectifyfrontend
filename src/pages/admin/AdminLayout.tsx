import React from 'react';
import { Link, Outlet, Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { 
  Bell,
  Search,
  ChevronRight,
  Home,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { useLogout } from '@/hooks/useAuth';
import { SidebarProvider, SidebarInset, SidebarTrigger } from '@/components/ui/sidebar';
import { AdminSidebar } from './AdminSidebar';
import { PageTransition } from '@/components/PageTransition';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

const AdminLayout = () => {
  const { user, isAuthenticated, isLoading } = useAuth();
  const location = useLocation();
  const logoutMutation = useLogout();

  if (isLoading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  if (!isAuthenticated || user?.role !== 'admin') {
    return <Navigate to="/auth" replace />;
  }

  const handleLogout = () => {
    logoutMutation.mutate();
  };

  // Generate breadcrumbs from path
  const pathnames = location.pathname.split('/').filter((x) => x);
  
  return (
    <SidebarProvider>
      <AdminSidebar />
      <SidebarInset>
        {/* Header */}
        <header className="flex h-16 shrink-0 items-center justify-between gap-2 border-b bg-card px-4 sticky top-0 z-20 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
          <div className="flex items-center gap-2">
            <SidebarTrigger className="-ml-1" />
            <div className="hidden md:block h-4 w-[1px] bg-border mx-2" />
            
            <Breadcrumb className="hidden md:block">
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbLink asChild>
                    <Link to="/admin" className="flex items-center gap-1">
                      <Home className="h-3.5 w-3.5" />
                      <span>Admin</span>
                    </Link>
                  </BreadcrumbLink>
                </BreadcrumbItem>
                {pathnames.length > 1 && pathnames.slice(1).map((value, index) => {
                  const href = `/${pathnames.slice(0, index + 2).join('/')}`;
                  const isLast = index === pathnames.length - 2;
                  const label = value.charAt(0).toUpperCase() + value.slice(1).replace(/-/g, ' ');
                  
                  return (
                    <React.Fragment key={href}>
                      <BreadcrumbSeparator />
                      <BreadcrumbItem>
                        {isLast ? (
                          <BreadcrumbPage>{label}</BreadcrumbPage>
                        ) : (
                          <BreadcrumbLink asChild>
                            <Link to={href}>{label}</Link>
                          </BreadcrumbLink>
                        )}
                      </BreadcrumbItem>
                    </React.Fragment>
                  );
                })}
              </BreadcrumbList>
            </Breadcrumb>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center bg-muted px-3 py-1.5 rounded-full w-48 lg:w-64 transition-all focus-within:ring-2 focus-within:ring-primary/20 mr-2">
              <Search className="w-4 h-4 text-muted-foreground mr-2" />
              <input 
                type="text" 
                placeholder="Quick search..." 
                className="bg-transparent border-none outline-none text-xs w-full"
              />
            </div>

            <Button variant="ghost" size="icon" className="relative transition-smooth hover:bg-muted">
              <Bell className="w-5 h-5" />
              <span className="absolute top-2 right-2 w-2 h-2 bg-destructive rounded-full border-2 border-card" />
            </Button>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-8 w-8 rounded-full border border-border/50 hover:bg-muted p-0">
                  <Avatar className="h-8 w-8 transition-transform hover:scale-105">
                    <AvatarImage src={user?.profile?.avatar} alt={user?.name} />
                    <AvatarFallback className="bg-primary/10 text-primary font-bold">
                      {user?.name?.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">{user?.name}</p>
                    <p className="text-xs leading-none text-muted-foreground">{user?.email}</p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild className="cursor-pointer">
                  <Link to="/profile/provider">Profile Settings</Link>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleLogout} className="cursor-pointer text-destructive focus:text-destructive">
                  Log out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-4 md:p-8">
          <PageTransition key={location.pathname}>
            <Outlet />
          </PageTransition>
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
};

export default AdminLayout;

