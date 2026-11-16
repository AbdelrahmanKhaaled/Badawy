import Link from "next/link";
import Button from "@/components/ui/Button";

export default function NotFound() {
  return (
    <main id="main" className="pt-[84px]">
      <section className="sec bg-ink">
        <div className="wrap max-w-[760px] text-center">
          <p className="font-serif text-[clamp(5rem,14vw,10rem)] italic leading-none text-accent">404</p>
          <h1 className="h-lg mt-6">This scene <em>was cut.</em></h1>
          <p className="body-copy mx-auto mt-5">The page you’re looking for doesn’t exist or has moved.</p>
          <div className="mt-10 flex flex-wrap justify-center gap-3">
            <Button href="/">Back to Home</Button>
            <Button href="/services" variant="outline">Our Services</Button>
          </div>
          <p className="mt-8 text-[.85rem] text-muted">Or <Link href="/contact" className="text-accent hover:underline">contact us</Link>.</p>
        </div>
      </section>
    </main>
  );
}
