import Image from "next/image";
import Link from "next/link";
import { Container } from "./primitives";
import { nav, org } from "@/content/shared";

export function Footer() {
  return (
    <footer className="bg-ink pb-16 pt-14">
      <Container>
        <div className="grid gap-x-12 gap-y-10 lg:grid-cols-2">
          <div>
            <div className="flex items-center gap-4">
              <Image
                src="/images/logo/assf-logo-footer.png"
                alt={org.nameLatin}
                width={2485}
                height={3794}
                className="h-16 w-auto bg-parchment-bright/95 p-1.5"
              />
              <p className="text-3xl text-gold">
                {org.sealDeva} <span className="text-gold/80">॥</span>
              </p>
            </div>
            <p className="mt-5 text-lg text-parchment/90">{org.nameDeva}</p>
            <p className="mt-1 text-lg text-parchment/70">{org.tagline}</p>
            <p className="mt-5 font-sans text-sm text-parchment/70">
              NGO registration {org.registration}
            </p>
          </div>

          <div>
            <h2 className="font-sans text-sm tracking-wide text-parchment/65">
              Registered office
            </h2>
            <address className="mt-3 max-w-[38ch] text-lg not-italic leading-relaxed text-parchment/90">
              {org.office}
            </address>
          </div>

          <div>
            <h2 className="font-sans text-sm tracking-wide text-parchment/65">
              Contact
            </h2>
            <p className="mt-3 text-lg text-parchment/90">
              <a href={`tel:${org.phone.replace(/\s/g, "")}`} className="hover:text-parchment-bright">
                {org.phone}
              </a>
            </p>
            <p className="mt-1">
              <a
                href={`mailto:${org.email}`}
                className="text-lg text-accent underline decoration-accent/40 underline-offset-[5px] hover:decoration-accent"
              >
                {org.email}
              </a>
            </p>
          </div>

          <div>
            <h2 className="font-sans text-sm tracking-wide text-parchment/65">
              Banking
            </h2>
            <p className="mt-3 text-lg text-parchment/90">{org.bank.branch}</p>
            <p className="mt-1 text-lg text-parchment/90">
              {org.bank.account} <span className="text-parchment/45">|</span>{" "}
              {org.bank.ifsc}
            </p>
          </div>
        </div>

        <nav aria-label="Footer" className="mt-12 border-t border-parchment/15 pt-8">
          <ul className="flex flex-wrap gap-x-8 gap-y-3">
            <li>
              <Link href="/" className="text-base text-parchment/75 hover:text-parchment-bright">
                Home
              </Link>
            </li>
            {nav.map((item) => (
              <li key={item.label}>
                <Link
                  href={item.href}
                  className="text-base text-parchment/75 hover:text-parchment-bright"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </Container>
    </footer>
  );
}
