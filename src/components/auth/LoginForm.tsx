
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { LogIn } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export const LoginForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Get users from localStorage
    const users = JSON.parse(localStorage.getItem("barUsers") || "[]");
    const user = users.find((u: any) => u.email === email && u.password === password);

    setTimeout(() => {
      if (user) {
        // Save current user session
        sessionStorage.setItem("currentUser", JSON.stringify({
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role
        }));

        toast({
          title: "Login Successful",
          description: `Welcome back, ${user.name}!`,
        });

        navigate("/");
      } else {
        toast({
          title: "Login Failed",
          description: "Invalid email or password",
          variant: "destructive",
        });
      }
      setIsLoading(false);
    }, 1000);
  };

  return (
    <form onSubmit={handleLogin} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="email" className="text-blue-200">Email</Label>
        <Input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="bg-slate-700 border-slate-600 text-white"
          placeholder="admin@mkhekhelezi.com"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="password" className="text-blue-200">Password</Label>
        <Input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="bg-slate-700 border-slate-600 text-white"
          placeholder="Enter your password"
        />
      </div>

      <Button
        type="submit"
        disabled={isLoading}
        className="w-full bg-blue-600 hover:bg-blue-700"
      >
        {isLoading ? (
          "Signing in..."
        ) : (
          <>
            <LogIn className="w-4 h-4 mr-2" />
            Sign In
          </>
        )}
      </Button>

      <Card className="bg-slate-700/50 border-slate-600">
        <CardContent className="p-4">
          <p className="text-sm text-blue-200 mb-2">Demo Accounts:</p>
          <div className="text-xs text-slate-300 space-y-1">
            <div>Admin: admin@bar.com / admin123</div>
            <div>Employee: employee@bar.com / emp123</div>
          </div>
        </CardContent>
      </Card>
    </form>
  );
};
