import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type Props = {
  email: string;
  setEmail: (value: string) => void;
  password: string;
  setPassword: (value: string) => void;
};

export default function SignInFields({
  email,
  setEmail,
  password,
  setPassword,
}: Props) {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="email" className="text-gray-700">
          Email
        </Label>

        <Input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
          required
          className="border-gray-300 focus:border-primary focus:ring-primary"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="password" className="text-gray-700">
          Password
        </Label>

        <Input
          id="password"
          type="password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          minLength={4}
          className="border-gray-300 focus:border-primary focus:ring-primary"
        />
      </div>
    </div>
  );
}