type WordmarkProps = {
  compact?: boolean;
  className?: string;
};

export function Wordmark({ compact = false, className }: WordmarkProps) {
  return (
    <span className={className} aria-label="The Puzzle, Public House">
      <span aria-hidden="true">{compact ? "TP" : "The Puzzle"}</span>
      {!compact && <small aria-hidden="true">Public House</small>}
    </span>
  );
}
