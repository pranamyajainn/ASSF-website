import Image from "next/image";
import { Heading, Leaf, Prose } from "./primitives";
import { getContent } from "@/i18n/content";

/**
 * The work, up close: the Foundation's own field photographs set as an
 * album page — columns of mixed shapes, each print mounted with its plate
 * number and a caption that says only where and when it was taken. Nothing
 * is cropped to a uniform grid; a bundle on red cloth and a monk bending
 * over a folio keep the shapes they were photographed in.
 */
export async function UpClose() {
  const { home } = await getContent();
  const { upClose } = home;

  return (
    <Leaf id="up-close" label={upClose.label}>
      <Heading>{upClose.heading}</Heading>
      <Prose>
        <p>{upClose.lede}</p>
      </Prose>

      <div className="bleed-margin mt-12 columns-1 gap-6 sm:columns-2 lg:columns-3 lg:gap-8">
        {upClose.items.map((item, i) => (
          <figure key={item.src} data-plate className="rise-on-scroll mb-8 break-inside-avoid lg:mb-10">
            <div
              className="relative w-full overflow-hidden bg-leaf-deep outline outline-1 -outline-offset-1 outline-ink/15"
              style={{ aspectRatio: item.ratio }}
            >
              <Image
                src={item.src}
                alt={item.alt}
                fill
                loading={i < 3 ? "eager" : "lazy"}
                sizes="(min-width: 1024px) 26vw, (min-width: 640px) 45vw, 90vw"
                className="object-cover"
              />
            </div>
            <figcaption className="mt-3 font-mono text-register text-ink-faint">{item.caption}</figcaption>
          </figure>
        ))}
      </div>
    </Leaf>
  );
}
