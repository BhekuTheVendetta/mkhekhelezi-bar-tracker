
import { useState } from "react";
import { LoginForm } from "@/components/auth/LoginForm";
import { SignUpForm } from "@/components/auth/SignUpForm";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Wine } from "lucide-react";

export const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <Wine className="w-10 h-10 text-yellow-400" />
            <div>
              <h1 className="text-2xl font-bold text-white">Mkhekhelezi GLC</h1>
              <p className="text-blue-200 text-sm">Bar Management System</p>
            </div>
          </div>
        </div>

        <Card className="bg-slate-800/90 backdrop-blur-md border-slate-600">
          <CardHeader>
            <CardTitle className="text-center text-white">
              {isLogin ? "Welcome Back" : "Create Account"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isLogin ? <LoginForm /> : <SignUpForm />}
            
            <div className="mt-6 text-center">
              <Button
                variant="ghost"
                onClick={() => setIsLogin(!isLogin)}
                className="text-blue-300 hover:text-white"
              >
                {isLogin ? "Need an account? Sign up" : "Already have an account? Sign in"}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Auth;
