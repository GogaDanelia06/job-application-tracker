import {
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function SignInHeader() {
  return (
    <CardHeader className="space-y-1">
      <CardTitle className="text-2xl font-bold text-black">
        Sign In
      </CardTitle>

      <CardDescription className="text-gray-600">
        Enter your credentials to access your account
      </CardDescription>
    </CardHeader>
  );
}