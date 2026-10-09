import { Button, Container } from "./primitives";
import { getContent } from "@/i18n/content";

/**
 * The custodian's call that closes the home page: the mission is the
 * manuscripts, so the last thing asked is whether the reader holds any.
 */
export async function Survey() {
  const { home, shared } = await getContent();
  const { survey } = home;
  const { org } = shared;
  const tel = `tel:${org.phone.replace(/\s/g, "")}`;
  return (
    <section
      id="survey"
      className="on-dark scroll-mt-6 bg-cloth text-leaf"
      style={{ backgroundImage: "var(--weave)" }}
    >
      <Container>
        <div className="grid gap-x-16 gap-y-10 py-16 md:grid-cols-[5.5rem_minmax(0,1fr)] md:py-20 lg:grid-cols-[7.5rem_minmax(0,1fr)_minmax(0,22rem)] lg:py-24">
          <p aria-hidden="true" className="hidden font-display text-[2.4rem] leading-none text-orpiment md:block">
            ॥
          </p>
          <div className="min-w-0">
            <h2 className="max-w-[16ch] text-balance font-display text-title font-medium">
              {survey.heading}
            </h2>
            <p className="mt-6 max-w-[54ch] text-lede text-leaf/90">{survey.body}</p>
            <div className="mt-9">
              <Button href={survey.primary.href} variant="outline-dark">
                {survey.primary.label}
              </Button>
            </div>
          </div>
          <div className="self-end md:col-start-2 lg:col-start-auto">
            <p className="font-mono text-register text-orpiment">{survey.callLabel}</p>
            <a
              href={tel}
              className="mt-3 block font-display text-[clamp(2rem,1.4rem+2.2vw,3rem)] font-medium leading-none tracking-[-0.01em] underline decoration-leaf/30 decoration-2 underline-offset-[10px] hover:decoration-orpiment"
            >
              {org.phone}
            </a>
            <p className="mt-5 font-mono text-register text-leaf/85">{org.email}</p>
          </div>
        </div>
      </Container>
    </section>
  );
}
