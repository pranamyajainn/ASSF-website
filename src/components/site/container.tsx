import type { ReactNode } from "react";

/** Page gutter + max width, shared by every band so the margins line up. */
export function Container({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={`mx-auto w-full max-w-[86rem] px-5 sm:px-8 lg:px-12 ${className}`}>
      {children}
    </div>
  );
}
