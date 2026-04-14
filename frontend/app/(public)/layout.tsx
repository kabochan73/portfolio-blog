import { FilterProvider } from "./_context/FilterContext";
import PublicHeader from "./_components/PublicHeader";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <FilterProvider>
      <PublicHeader />
      <main className="mx-auto max-w-5xl px-4 py-10">{children}</main>
    </FilterProvider>
  );
}
