"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Eye,
  EyeOff,
  Mail,
  Lock,
  User,
  ArrowRight,
  Loader2,
} from "lucide-react";
import { motion } from "framer-motion";
import { login, signup } from "@/app/login/actions";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [activeTab, setActiveTab] = useState("login");
  const [showConfirmationMessage, setShowConfirmationMessage] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);
  const [signupError, setSignupError] = useState<string | null>(null);
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [isSigningUp, setIsSigningUp] = useState(false);
  const router = useRouter();
  const togglePasswordVisibility = () => setShowPassword(!showPassword);

  const handleLoginSubmit = async (formData: FormData) => {
    setIsLoggingIn(true);
    setLoginError(null);

    try {
      const result = await login(formData);
      if (result?.error) {
        setLoginError(result.error);
      } else if (result?.success) {
        router.push("/");
      }
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleSignupSubmit = async (formData: FormData) => {
    setIsSigningUp(true);
    setSignupError(null);
    setShowConfirmationMessage(false);

    try {
      const result = await signup(formData);
      if (result?.error) {
        setSignupError(result.error);
      } else if (result?.success) {
        setShowConfirmationMessage(true);
        setActiveTab("login");
        setTimeout(() => {
          setShowConfirmationMessage(false);
        }, 10000);
      }
    } finally {
      setIsSigningUp(false);
    }
  };

  const handleTabChange = (value: string) => {
    setLoginError(null);
    setSignupError(null);
    setShowConfirmationMessage(false);
    setActiveTab(value);
  };

  return (
    <div className="flex items-center justify-center min-h-screen p-4 dark:bg-gray-800 bg-background">
      <div className="w-full max-w-md">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Card className="w-full shadow-lg dark:bg-gray-900 bg-background">
            <CardHeader className="space-y-1">
              <CardTitle className="text-3xl font-bold text-center">
                Welcome
              </CardTitle>
              <CardDescription className="text-center text-gray-500">
                Login or create an account to continue
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs
                value={activeTab}
                onValueChange={handleTabChange}
                className="w-full"
              >
                <TabsList className="grid w-full grid-cols-2 mb-8 h-12 dark:bg-gray-800 bg-background">
                  <TabsTrigger
                    value="login"
                    className="text-lg data-[state=active]:dark:bg-gray-600"
                  >
                    Login
                  </TabsTrigger>
                  <TabsTrigger
                    value="signup"
                    className="text-lg data-[state=active]:dark:bg-gray-600"
                  >
                    Sign Up
                  </TabsTrigger>
                </TabsList>
                <TabsContent value="login">
                  <form
                    action={async (formData) => {
                      await handleLoginSubmit(formData);
                    }}
                    className="space-y-6"
                  >
                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: 0.1 }}
                      className="space-y-2"
                    >
                      <Label htmlFor="email" className="text-sm font-medium">
                        Email
                      </Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          placeholder="Enter your email"
                          className="pl-10 py-2"
                          required
                        />
                      </div>
                    </motion.div>
                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: 0.2 }}
                      className="space-y-2"
                    >
                      <Label htmlFor="password" className="text-sm font-medium">
                        Password
                      </Label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                        <Input
                          id="password"
                          name="password"
                          type={showPassword ? "text" : "password"}
                          placeholder="Enter your password"
                          className="pl-10 pr-10 py-2"
                          required
                        />
                        <button
                          type="button"
                          onClick={togglePasswordVisibility}
                          className="absolute right-3 top-3 text-gray-400 focus:outline-none"
                        >
                          {showPassword ? (
                            <EyeOff className="h-5 w-5" />
                          ) : (
                            <Eye className="h-5 w-5" />
                          )}
                        </button>
                      </div>
                    </motion.div>
                    {loginError && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="p-3 bg-red-50 text-red-700 rounded-md text-sm"
                      >
                        {loginError}
                      </motion.div>
                    )}
                    <motion.div>
                      <Button
                        type="submit"
                        className="w-full py-2 text-lg dark:bg-gray-600 dark:text-white"
                        disabled={isLoggingIn}
                      >
                        {isLoggingIn ? (
                          <>
                            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                            Logging in...
                          </>
                        ) : (
                          <>
                            Login <ArrowRight className="ml-2 h-5 w-5" />
                          </>
                        )}
                      </Button>
                    </motion.div>
                    <div className="text-center mt-4">
                      <Link
                        href="/reset-password"
                        className="text-sm text-primary hover:underline"
                      >
                        Forgot Password?
                      </Link>
                    </div>
                  </form>
                </TabsContent>
                <TabsContent value="signup">
                  <form
                    action={async (formData) => {
                      await handleSignupSubmit(formData);
                    }}
                    className="space-y-6"
                  >
                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: 0.1 }}
                      className="space-y-2"
                    >
                      <Label htmlFor="name" className="text-sm font-medium">
                        Full Name
                      </Label>
                      <div className="relative">
                        <User className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                        <Input
                          id="name"
                          name="name"
                          type="text"
                          placeholder="Enter your full name"
                          className="pl-10 py-2 dark:bg-gray-600 dark:text-white"
                          required
                        />
                      </div>
                    </motion.div>
                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: 0.2 }}
                      className="space-y-2"
                    >
                      <Label
                        htmlFor="signup-email"
                        className="text-sm font-medium"
                      >
                        Email
                      </Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                        <Input
                          id="signup-email"
                          name="email"
                          type="email"
                          placeholder="Enter your email"
                          className="pl-10 py-2 dark:bg-gray-600 dark:text-white"
                          required
                        />
                      </div>
                    </motion.div>
                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: 0.3 }}
                      className="space-y-2"
                    >
                      <Label
                        htmlFor="signup-password"
                        className="text-sm font-medium"
                      >
                        Password
                      </Label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                        <Input
                          id="signup-password"
                          name="password"
                          type={showPassword ? "text" : "password"}
                          placeholder="Create a password"
                          className="pl-10 pr-10 py-2"
                          required
                        />
                        <button
                          type="button"
                          onClick={togglePasswordVisibility}
                          className="absolute right-3 top-3 text-gray-400 focus:outline-none"
                        >
                          {showPassword ? (
                            <EyeOff className="h-5 w-5" />
                          ) : (
                            <Eye className="h-5 w-5" />
                          )}
                        </button>
                      </div>
                    </motion.div>
                    {signupError && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="p-3 bg-red-50 text-red-700 rounded-md text-sm"
                      >
                        {signupError}
                      </motion.div>
                    )}
                    <motion.div>
                      <Button
                        type="submit"
                        className="w-full py-2 text-lg dark:bg-gray-600 dark:text-white"
                        disabled={isSigningUp}
                      >
                        {isSigningUp ? (
                          <>
                            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                            Signing up...
                          </>
                        ) : (
                          <>
                            Sign Up <ArrowRight className="ml-2 h-5 w-5" />
                          </>
                        )}
                      </Button>
                    </motion.div>
                  </form>
                </TabsContent>
              </Tabs>
              {showConfirmationMessage && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.5 }}
                  className="mt-4 mb-4 p-3 bg-green-50 text-green-700 rounded-md text-sm"
                >
                  Please check your email for a confirmation link to complete
                  your registration.
                </motion.div>
              )}
            </CardContent>
          </Card>
        </motion.div>
        <div className="mt-8 text-center">
          <p className="text-sm text-gray-500">
            &copy; {new Date().getFullYear()} PrelimsPrep
          </p>
        </div>
      </div>
    </div>
  );
}
