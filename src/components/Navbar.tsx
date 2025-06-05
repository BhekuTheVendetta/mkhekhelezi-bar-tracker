
import { Wine, Menu, LogOut, User, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'employee' | 'manager';
}

export const Navbar = () => {
  const [user, setUser] = useState<User | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const currentUser = sessionStorage.getItem("currentUser");
    if (currentUser) {
      setUser(JSON.parse(currentUser));
    }
  }, []);

  const handleLogout = () => {
    sessionStorage.removeItem("currentUser");
    navigate("/auth");
  };

  return (
    <nav className="bg-slate-900/90 backdrop-blur-md border-b border-slate-700 sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-3">
            <Wine className="w-8 h-8 text-yellow-400" />
            <div>
              <h2 className="text-xl font-bold text-white">Mkhekhelezi GLC</h2>
              <p className="text-xs text-blue-200">Bar Management</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            {(user?.role === 'admin' || user?.role === 'manager') && (
              <Button
                onClick={() => navigate("/admin")}
                variant="ghost"
                size="sm"
                className="text-yellow-400 hover:text-yellow-300"
              >
                <Shield className="w-4 h-4 mr-2" />
                Admin
              </Button>
            )}
            
            {user && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="text-blue-200 hover:text-white">
                    <User className="w-4 h-4 mr-2" />
                    {user.name}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="bg-slate-800 border-slate-600">
                  <DropdownMenuLabel className="text-white">
                    <div className="flex flex-col">
                      <span>{user.name}</span>
                      <span className="text-xs text-blue-300 capitalize">{user.role}</span>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator className="bg-slate-600" />
                  {(user.role === 'admin' || user.role === 'manager') && (
                    <>
                      <DropdownMenuItem 
                        onClick={() => navigate("/admin")}
                        className="text-yellow-400 hover:text-yellow-300 hover:bg-slate-700"
                      >
                        <Shield className="w-4 h-4 mr-2" />
                        Admin Dashboard
                      </DropdownMenuItem>
                      <DropdownMenuSeparator className="bg-slate-600" />
                    </>
                  )}
                  <DropdownMenuItem 
                    onClick={handleLogout}
                    className="text-red-300 hover:text-red-200 hover:bg-slate-700"
                  >
                    <LogOut className="w-4 h-4 mr-2" />
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
            
            <Button variant="ghost" size="sm" className="text-blue-200 hover:text-white">
              <Menu className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
};
