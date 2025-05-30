
import { Wine, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";

export const Navbar = () => {
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
          
          <Button variant="ghost" size="sm" className="text-blue-200 hover:text-white">
            <Menu className="w-5 h-5" />
          </Button>
        </div>
      </div>
    </nav>
  );
};
