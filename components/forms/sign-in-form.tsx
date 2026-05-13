"use client";

import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { useSignIn } from "@/hooks/use-sign-in";

import SignInFields from "./sign-in-fields";
import SignInFooter from "./sign-in-footer";
import SignInHeader from "./sign-in.header";

export default function SignInForm() {
  const {
    email,
    setEmail,
    password,
    setPassword,
    error,
    loading,
    handleSubmit,
  } = useSignIn();

  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center bg-white p-4">
      <Card className="w-full max-w-md border-gray-200 shadow-lg">
        <SignInHeader />

        <form onSubmit={handleSubmit} className="space-y-4">
          <CardContent className="space-y-4">
            {error && (
              <div className="rounded-md bg-destructive/15 p-3 text-sm text-destructive">
                {error}
              </div>
            )}

            <SignInFields
              email={email}
              setEmail={setEmail}
              password={password}
              setPassword={setPassword}
            />
          </CardContent>

          <CardFooter>
            <SignInFooter loading={loading} />
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}