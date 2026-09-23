/**
 * "Clean the folio" — a remembered reading mode. The key and event are
 * shared by the header toggle and the pre-paint script in RootShell.
 */
export const CLEAN_KEY = "assf-clean-folio";
export const CLEAN_EVENT = "assf:clean-folio";

/**
 * Runs in <head> before first paint, so a reader who chose the clean leaf
 * never sees the ornament flash back on the next page.
 */
export const cleanFolioScript = `try{if(localStorage.getItem(${JSON.stringify(CLEAN_KEY)})==="1")document.documentElement.setAttribute("data-clean","")}catch(e){}`;
