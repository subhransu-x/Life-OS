import Link from "next/link";

export function QuickNavigation() {
  const links = [
    { name: "Expenses", href: "/expenses", color: "bg-blue-100 text-blue-700" },
    { name: "Journal", href: "/journal", color: "bg-purple-100 text-purple-700" },
    { name: "Habits", href: "/habits", color: "bg-green-100 text-green-700" },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      {links.map((link) => (
        <Link
          key={link.name}
          href={link.href}
          className={`p-6 rounded-xl flex items-center justify-center text-lg font-semibold transition-transform hover:scale-105 ${link.color}`}
        >
          {link.name}
        </Link>
      ))}
    </div>
  );
}
