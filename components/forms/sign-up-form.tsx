"use client";

import {
  Card,
  CardContent,
  CardFooter,
} from "@/components/ui/card";

import SignUpHeader from "./sign-up-header";
import SignUpFields from "./sign-up-fields";
import SignUpFooter from "./sign-up-footer";

import { useSignUp } from "@/hooks/use-sign-up";

export default function SignUpForm() {
  const {
    name,
    setName,
    email,
    setEmail,
    password,
    setPassword,
    error,
    loading,
    handleSubmit,
  } = useSignUp();

  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center bg-white p-4">
      <Card className="w-full max-w-md border-gray-200 shadow-lg">
        <SignUpHeader />

        <form onSubmit={handleSubmit} className="space-y-4">
          <CardContent className="space-y-4">
            {error && (
              <div className="rounded-md bg-destructive/15 p-3 text-sm text-destructive">
                {error}
              </div>
            )}

            <SignUpFields
              name={name}
              setName={setName}
              email={email}
              setEmail={setEmail}
              password={password}
              setPassword={setPassword}
            />
          </CardContent>

          <CardFooter>
            <SignUpFooter loading={loading} />
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}