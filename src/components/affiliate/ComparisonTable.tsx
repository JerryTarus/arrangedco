import { CTAButton } from "./CTAButton";

type Column = { key: string; label: string };
type Row = {
  name: string;
  slug: string;
  price?: number;
  image?: string;
  [key: string]: unknown;
};

type Props = { columns: Column[]; rows: Row[] };

export function ComparisonTable({ columns, rows }: Props) {
  return (
    <div className="overflow-x-auto rounded-xl border">
      <table className="w-full text-sm">
        <thead className="bg-muted">
          <tr>
            <th className="text-left px-4 py-3 font-semibold">Product</th>
            {columns.map((col) => (
              <th key={col.key} className="text-left px-4 py-3 font-semibold">
                {col.label}
              </th>
            ))}
            <th className="px-4 py-3" />
          </tr>
        </thead>
        <tbody className="divide-y">
          {rows.map((row) => (
            <tr key={row.slug} className="hover:bg-muted/30 transition-colors">
              <td className="px-4 py-3 font-medium">{row.name}</td>
              {columns.map((col) => (
                <td key={col.key} className="px-4 py-3 text-muted-foreground">
                  {String(row[col.key] ?? "—")}
                </td>
              ))}
              <td className="px-4 py-3">
                <CTAButton slug={row.slug} productName={row.name} className="text-xs" />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
