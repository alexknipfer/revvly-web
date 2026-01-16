interface VehicleStatCardProps {
  label: string;
  value: string | number;
}

export function VehicleStatCard({ label, value }: VehicleStatCardProps) {
  return (
    <div className="flex flex-col gap-0.5">
      <span className="text-xs text-muted-foreground">{label}</span>
      <span className="text-lg font-semibold tabular-nums">{value}</span>
    </div>
  );
}
