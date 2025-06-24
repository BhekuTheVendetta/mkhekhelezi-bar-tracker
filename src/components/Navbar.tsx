
import { Menu, LogOut, User, Shield, FileSpreadsheet } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { User as SupabaseUser } from "@supabase/supabase-js";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface Profile {
  id: string;
  first_name: string | null;
  last_name: string | null;
  email: string | null;
  role: string;
}

export const Navbar = () => {
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setUser(session?.user ?? null);
        
        if (session?.user) {
          // Fetch user profile
          setTimeout(async () => {
            const { data: profileData } = await supabase
              .from('profiles')
              .select('*')
              .eq('id', session.user.id)
              .single();
            
            setProfile(profileData);
          }, 0);
        } else {
          setProfile(null);
        }
      }
    );

    // Check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      
      if (session?.user) {
        supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .single()
          .then(({ data: profileData }) => {
            setProfile(profileData);
          });
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/auth");
  };

  const displayName = profile?.first_name 
    ? `${profile.first_name} ${profile.last_name || ''}`.trim()
    : profile?.email?.split('@')[0] || 'User';

  return (
    <nav className="bg-slate-900/90 backdrop-blur-md border-b border-slate-700 sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-3">
            <img 
              src="/lovable-uploads/ab961674-21f0-42d2-b26e-f14098d70e52.png" 
              alt="Mkhekhelezi Bar & Grill Logo" 
              className="w-10 h-10 object-contain"
            />
            <div>
              <h2 className="text-xl font-bold text-white">Mkhekhelezi GLC</h2>
              <p className="text-xs text-blue-200">Bar Management</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <Button
              onClick={() => navigate("/stock-sheet")}
              variant="ghost"
              size="sm"
              className="text-blue-200 hover:text-white"
            >
              <FileSpreadsheet className="w-4 h-4 mr-2" />
              Stock Sheets
            </Button>

            {(profile?.role === 'admin' || profile?.role === 'manager') && (
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
            
            {user && profile && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="text-blue-200 hover:text-white">
                    <User className="w-4 h-4 mr-2" />
                    {displayName}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="bg-slate-800 border-slate-600">
                  <DropdownMenuLabel className="text-white">
                    <div className="flex flex-col">
                      <span>{displayName}</span>
                      <span className="text-xs text-blue-300 capitalize">{profile.role}</span>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator className="bg-slate-600" />
                  {(profile.role === 'admin' || profile.role === 'manager') && (
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
