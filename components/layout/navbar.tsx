import Logo from "./logo";
import NavbarActions from "./navbar-actions";

export default function Navbar() {
  return (
    <header className="border-b bg-white">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6">
        <Logo />

        <NavbarActions />
      </div>
    </header>
  );
}