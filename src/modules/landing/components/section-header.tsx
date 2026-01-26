interface Props {
  kicker: string;
  title: string;
}

export function SectionHeader({ kicker, title }: Props) {
  return (
    <div className="flex items-center gap-4 mb-10">
      <div className="h-px flex-1 bg-linear-to-r from-transparent via-border to-transparent" />
      <div className="flex items-center gap-3">
        <span className="text-[10px] text-muted-foreground uppercase tracking-widest">
          {kicker}
        </span>
        <h2 className="text-2xl md:text-3xl font-bold text-foreground uppercase tracking-tight">
          {title}
        </h2>
      </div>
      <div className="h-px flex-1 bg-linear-to-r from-transparent via-border to-transparent" />
    </div>
  );
}
