import {
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function SignUpHeader() {
  return (
    <CardHeader className="space-y-1">
      <CardTitle className="text-2xl font-bold text-black">
        Sign Up
      </CardTitle>

      <CardDescription className="text-gray-600">
        Create an account to start tracking your job applications
      </CardDescription>
    </CardHeader>
  );
}