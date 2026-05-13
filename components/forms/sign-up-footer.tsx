import Link from "next/link";
import { Button } from "@/components/ui/button";

type Props = {
  loading: boolean;
};

export default function SignUpFooter({ loading }: Props) {
  return (
    <div className="flex flex-col space-y-4">
      <Button type="submit" className="w-full" disabled={loading}>
        {loading ? "Creating account..." : "Sign Up"}
      </Button>

      <p className="text-center text-sm text-gray-600">
        Already have an account?{" "}
        <Link
          href="/sign-in"
          className="font-medium text-primary hover:underline"
        >
          Sign in
        </Link>
      </p>
    </div>
  );
}