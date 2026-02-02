export function CornerAccents() {
  return (
    <>
      <div className="absolute top-0 left-0 w-4 h-4 border-t border-l border-indigo-600 dark:border-indigo-400" />
      <div className="absolute top-0 right-0 w-4 h-4 border-t border-r border-violet-600 dark:border-violet-400" />
      <div className="absolute bottom-0 left-0 w-4 h-4 border-b border-l border-blue-600 dark:border-blue-400" />
      <div className="absolute bottom-0 right-0 w-4 h-4 border-b border-r border-indigo-600 dark:border-indigo-400" />
    </>
  );
}
