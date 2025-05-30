
import { UserManagement } from "@/components/admin/UserManagement";
import { Navbar } from "@/components/Navbar";
import { Shield } from "lucide-react";

const Admin = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <div className="flex items-center space-x-3 mb-4">
            <Shield className="w-10 h-10 text-yellow-400" />
            <div>
              <h1 className="text-4xl font-bold text-white bg-gradient-to-r from-yellow-400 to-yellow-200 bg-clip-text text-transparent">
                Administrator Dashboard
              </h1>
              <p className="text-blue-200 text-lg">Manage users and system settings</p>
            </div>
          </div>
        </div>

        <UserManagement />
      </div>
    </div>
  );
};

export default Admin;
