"use client";

export function PrintButton() {
  return (
    <button type="button" onClick={() => window.print()} className="cursor-pointer rounded-md bg-cinnabar px-5 py-2.5 text-leaf hover:bg-cinnabar-deep">
      Print
    </button>
  );
}
