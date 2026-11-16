/** Central asset map. Files live in /public/images (copied from /images, originals untouched). */
export const assets = {
  logo: { src: "/images/logo.png", width: 4200, height: 3752, alt: "Badawy Productions logo" },
  hero: { src: "/images/hero.png", alt: "Cinematographer operating a cinema camera under warm studio light" },
  about: { src: "/images/about-us.png", alt: "A Badawy Productions crew member on set beside a studio light" },
  whyChoose: { src: "/images/why-choose-us.png", alt: "Cinema camera on a slider under warm light" },
  figures: { src: "/images/figures.png", alt: "Sunset over layered mountain silhouettes" },
  story: { src: "/images/your-story.png", alt: "Filmmaker silhouette with a camera on a tripod at sunset" },
  capture: [
    { src: "/images/capture-1.png", alt: "Wedding couple portrait", label: "Weddings", position: "50% 35%" },
    { src: "/images/capture-2.png", alt: "Luxury watch product photography", label: "Products", position: "50% 42%" },
    { src: "/images/capture-3.png", alt: "Portrait of a woman in warm light", label: "Portraits", position: "50% 30%" },
    { src: "/images/capture-4.png", alt: "Live event with stage lighting", label: "Events", position: "50% 50%" },
  ],
  works: [
    { src: "/images/work-1.png", alt: "Bride and groom embracing in golden light", position: "50% 40%" },
    { src: "/images/work-2.png", alt: "Perfume bottle with water droplets", position: "50% 50%" },
    { src: "/images/work-3.png", alt: "Cinematic portrait of a young man", position: "50% 30%" },
    { src: "/images/work-4.png", alt: "Conference stage with blue spotlights and audience", position: "50% 50%" },
  ],
  // Brand logos come from the mockup. They do NOT imply real commercial relationships - see content.ts
  clients: [
    { name: "Coca-Cola", src: "/images/client-cocacola.webp", width: 330, height: 104 },
    { name: "Samsung", src: "/images/client-samsung.webp", width: 330, height: 51 },
    { name: "Emirates", src: "/images/client-emirates.webp", width: 330, height: 228 },
    { name: "Vodafone", src: "/images/client-vodafone.webp", width: 330, height: 82 },
    { name: "Uber", src: "/images/client-uber.webp", width: 330, height: 115 },
  ],
} as const;

