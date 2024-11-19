import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { login, signup } from "@/app/login/actions";
import Script from "next/script";
import { GoogleSignIn } from "@/components/auth/google-sign-in";
import { Separator } from "@/components/ui/separator";

export default function LoginPage() {
  return (
    <>
      <div className="flex min-h-screen items-center justify-center bg-gray-100">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-2xl font-bold">Sign In</CardTitle>
            <CardDescription>
              Enter your email and password to access your account.
            </CardDescription>
          </CardHeader>
          <form action={login}>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="text"
                  placeholder="Enter your email"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="Enter your password"
                  required
                />
              </div>
            </CardContent>
            <CardFooter className="flex-col gap-2">
              <Button type="submit" className="w-full">
                Sign In
              </Button>
              <Button className="w-full" formAction={signup} variant="outline">
                Sign Up
              </Button>
            </CardFooter>
          </form>
          <div className="relative">
            <div className="absolute inset-0 flex items-center px-6">
              <Separator />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">
                Or continue with
              </span>
            </div>
          </div>
          <div className="flex justify-center p-6">
            <GoogleSignIn />
          </div>
        </Card>
      </div>
      <Script src="https://accounts.google.com/gsi/client"></Script>
    </>
  );
}
