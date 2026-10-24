import Image from "next/image";
import { Header } from "@/components/site/header";
import { Footer } from "@/components/site/footer";
import { Leaf, PageHero } from "@/components/site/primitives";
import { getContent } from "@/i18n/content";
import { pageMetadata } from "@/i18n/metadata";

export async function generateMetadata() {
  const { photos } = await getContent();
  return pageMetadata("photos", "/gallery/photos", photos.pageHero.body);
}

/**
 * The Foundation's photographs of its work, each at the shape it was taken
 * — never cropped to a grid — with its caption beneath, and a tap opening it
 * at full size. Photographs are added, removed and reordered in the site
 * editor; each loads only as it scrolls into view.
 */
export default async function PhotoGalleryPage() {
  const { photos, ui } = await getContent();
  const { gallery, pageHero } = photos;
  // A photograph added in the editor but not yet chosen isn't published; this is only a guard.
  const items = gallery.items.filter((photo) => photo.src);

  return (
    <>
      <Header />
      <main id="main">
        <PageHero question={ui.steps.glance} {...pageHero} />

        <Leaf id="photographs" label={gallery.label} question={ui.steps.looks}>
          <h2 className="sr-only">{gallery.label}</h2>
          {items.length ? (
            <div className="bleed-margin columns-1 gap-x-8 sm:columns-2 xl:columns-3">
              {items.map((photo, i) => (
                <figure key={`${photo.src}-${i}`} data-plate className="mb-10 break-inside-avoid">
                  <a href={photo.src} target="_blank" rel="noopener" className="group block">
                    <span
                      className="relative block w-full overflow-hidden bg-leaf-deep outline outline-1 -outline-offset-1 outline-ink/15"
                      style={{ aspectRatio: photo.ratio }}
                    >
                      <Image
                        src={photo.src}
                        alt={photo.alt}
                        fill
                        sizes="(min-width: 1280px) 22vw, (min-width: 640px) 45vw, 90vw"
                        loading={i < 2 ? "eager" : "lazy"}
                        fetchPriority={i === 0 ? "high" : "auto"}
                        className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.02]"
                      />
                    </span>
                    <span className="sr-only">{ui.gallery.open}</span>
                  </a>
                  {photo.caption ? <figcaption className="mt-3 max-w-[52ch] font-mono text-register text-ink-faint">{photo.caption}</figcaption> : null}
                </figure>
              ))}
            </div>
          ) : (
            <p className="max-w-[56ch] border-l-2 border-cinnabar/60 pl-5 text-lede text-ink">{ui.gallery.noPhotos}</p>
          )}
        </Leaf>
      </main>
      <Footer />
    </>
  );
}
