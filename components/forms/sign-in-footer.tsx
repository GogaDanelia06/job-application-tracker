import Link from "next/link";
import { Button } from "@/components/ui/button";

type Props = {
  loading: boolean;
};

export default function SignInFooter({ loading }: Props) {
  return (
    <div className="flex w-full flex-col space-y-4">
      <Button
        type="submit"
        className="w-full bg-primary hover:bg-primary/90"
        disabled={loading}
      >
        {loading ? "Signing in..." : "Sign In"}
      </Button>

      <p className="text-center text-sm text-gray-600">
        Don&apos;t have an account?{" "}
        <Link
          href="/sign-up"
          className="font-medium text-primary hover:underline"
        >
          Sign up
        </Link>
      </p>
    </div>
  );
}