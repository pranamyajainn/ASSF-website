import { notFound, redirect } from "next/navigation";
import { previewRequest } from "@/i18n/content";
import { currentEditor } from "@/lib/cms/access";
import About from "@/views/about";
import Community from "@/views/community-services";
import Home from "@/views/home";
import Impact from "@/views/impact";
import Conservation from "@/views/manuscript-conservation";
import Rural from "@/views/rural-infrastructure";
import Trustees from "@/views/trustees";

const VIEWS: Record<string, () => Promise<React.ReactNode> | React.ReactNode> = {
  "": Home,
  about: About,
  "manuscript-conservation": Conservation,
  "rural-infrastructure": Rural,
  "community-services": Community,
  impact: Impact,
  trustees: Trustees,
};

/**
 * A page of the site as the site editor shows it: the published page, with
 * every piece of text invisibly tagged with its field, so the editor can
 * tell what was clicked and show changes in place before they're published.
 * Only signed-in editors can open it.
 */
export default async function PreviewPage({ params }: { params: Promise<{ slug?: string[] }> }) {
  if (!(await currentEditor())) redirect("/editor/sign-in");
  const { slug = [] } = await params;
  const View = VIEWS[slug.join("/")];
  if (!View) notFound();
  previewRequest().tagged = true;
  return <View />;
}
