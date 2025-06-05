
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'employee' | 'manager';
}

interface AuthGuardProps {
  children: React.ReactNode;
  requiredRoles?: ('admin' | 'employee' | 'manager')[];
}

export const AuthGuard = ({ children, requiredRoles }: AuthGuardProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const currentUser = sessionStorage.getItem("currentUser");
    
    if (!currentUser) {
      navigate("/auth");
      return;
    }

    const userData = JSON.parse(currentUser);
    
    if (requiredRoles && !requiredRoles.includes(userData.role)) {
      // Redirect to unauthorized page or show error
      navigate("/");
      return;
    }

    setUser(userData);
    setIsLoading(false);
  }, [navigate, requiredRoles]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800 flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return <>{children}</>;
};
