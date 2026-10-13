// Editorial content. Edit freely — pages rebuild from this file.

/**
 * Customer reviews. ONLY add reviews from real customers, word-for-word, with their
 * permission to show name/photo (see docs/REVIEWS.md — FTC 16 CFR Part 465).
 * Newest first; the homepage shows the first three.
 */
export type Testimonial = {
  quote: string;
  /** As the customer agreed to be shown, e.g. "Sarah M." */
  name: string;
  /** City/state ("Whitefish, MT") or a role ("Office Manager"). */
  role: string;
  /** Optional customer-supplied photo in /public/images/reviews/, e.g. "/images/reviews/sarah-m.webp". */
  photo?: string;
  occasion?: string;
  source?: "Google" | "Website" | "Email" | "Facebook";
  rating?: 1 | 2 | 3 | 4 | 5;
};

export const testimonials: Testimonial[] = [
  {
    quote: "Thank you so much for the beautiful fresh flowers. The flowers are gorgeous and so fresh! I love them!",
    name: "Ngo Nhat Anh",
    role: "Sales Representative",
  },
  {
    quote: "I was very surprised to receive the flowers from the shop. The flowers are beautiful, fresh, and very fragrant. I will definitely support the shop again!",
    name: "Huynh Diem My",
    role: "Customer Service",
  },
  {
    quote: "I've never liked the flowers from a shop so much. They're beautiful, fresh, and fragrant too. Thank you!",
    name: "Do My Linh",
    role: "Freelancer",
  },
  {
    quote: "I'm so incredibly grateful to the shop. Our partners really love the flowers from your shop. 5 stars!",
    name: "Huynh Tieu Thu",
    role: "Head of Training Management",
  },
];

export type Article = {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  date: string; // ISO
  readMins: number;
  image: string;
  body: { h?: string; p?: string; list?: string[] }[];
};

export const articles: Article[] = [
  {
    slug: "make-your-bouquet-last",
    title: "Seven Rituals to Make Your Bouquet Last Longer",
    excerpt: "Every arrangement leaves our studio guaranteed fresh for three days or more. With a little care, most last well over a week.",
    category: "Care",
    date: "2026-09-18",
    readMins: 5,
    image: "1520763185298-1b434c919102",
    body: [
      { p: "Every IdeaBurst arrangement leaves our Kalispell studio conditioned, hydrated and guaranteed to stay fresh for at least three days. With a few simple habits, most of our bouquets look beautiful for a week or longer." },
      { h: "1. Give stems a fresh cut", p: "Before placing flowers in water, trim 1–2 cm from each stem at a 45° angle with sharp scissors or a knife. The angled cut exposes more surface for drinking and keeps stems from sitting flat on the bottom of the vase." },
      { h: "2. Start with a spotless vase", p: "Bacteria are the enemy of cut flowers. Wash your vase with warm, soapy water and rinse well before every refill." },
      { h: "3. Strip leaves below the waterline", p: "Submerged foliage decays quickly and clouds the water. Remove any leaves that would sit beneath the surface." },
      { h: "4. Use the flower food", p: "The sachet tucked into your bouquet contains sugar to feed the blooms, an acidifier to help water move up the stem, and a gentle biocide. Dissolve it fully in lukewarm water." },
      { h: "5. Refresh the water every two days", p: "Top up daily and change the water completely every second day, re-trimming the stems each time." },
      { h: "6. Mind the location", p: "Keep flowers away from direct sun, heating vents, and — surprisingly — fruit bowls. Ripening fruit releases ethylene gas, which accelerates wilting." },
      { h: "7. Edit as you go", p: "Remove any blooms that fade early. One tired stem can shorten the life of its neighbours." },
      { p: "If anything about your flowers isn't right within the first three days, send us a photo — we'll make it right. That's our freshness promise." },
    ],
  },
  {
    slug: "phalaenopsis-orchid-care",
    title: "The Unfussy Guide to Phalaenopsis Orchid Care",
    excerpt: "Orchids have a reputation for being difficult. In truth, the moth orchid thrives on a little neglect — here is how.",
    category: "Care",
    date: "2026-08-30",
    readMins: 4,
    image: "1610397648930-477b8c7f0943",
    body: [
      { p: "The Phalaenopsis — or moth orchid — is the most forgiving orchid you can own. Treated well, its blooms last six to ten weeks, and it will happily rebloom year after year." },
      { h: "Light", p: "Bright, indirect light is ideal: an east-facing window, or a few feet back from a south or west window. Leaves should be a healthy olive green; very dark leaves mean too little light, yellowish leaves too much." },
      { h: "Water", p: "Water about once a week, or when the potting bark feels dry an inch down. Run lukewarm water through the pot for 15 seconds, then let it drain completely. Never let the roots sit in water." },
      { h: "Temperature", p: "Orchids are comfortable where you are: 65–80°F during the day, slightly cooler at night. Keep them away from cold Montana drafts in winter." },
      { h: "After the blooms fall", list: ["Cut the flower spike just above the second node below the lowest bloom to encourage a new spike.", "Or cut it at the base to let the plant rest and build strength.", "Feed with a balanced orchid fertilizer at quarter strength every other watering."] },
      { p: "Questions about an orchid from our studio? Call us anytime — we love talking orchids." },
    ],
  },
  {
    slug: "grand-opening-flower-etiquette",
    title: "Grand Opening Flowers: A Modern Etiquette Guide",
    excerpt: "What to send, when to send it, and what to write on the ribbon — so your congratulations arrive with grace.",
    category: "Occasions",
    date: "2026-08-12",
    readMins: 6,
    image: "1567748157439-651aca2ff064",
    body: [
      { p: "Sending flowers to a new business is a tradition that spans cultures — a public gesture of support that wishes the owners prosperity and good fortune. Here's how to do it well." },
      { h: "Timing", p: "Aim for delivery on the morning of the opening day, before doors open, so the arrangement greets the very first customers. If the event is in the evening, a midday delivery works perfectly." },
      { h: "Choosing the arrangement", list: ["Retail and restaurants: tall, eye-catching designs that read from the doorway.", "Offices and clinics: orchids or long-lasting tropicals like anthurium, which stay beautiful for weeks.", "Salons and boutiques: lush roses and soft tones that complement the interior."] },
      { h: "Colors with meaning", p: "Red and gold symbolize luck and prosperity in many traditions; pink speaks of warmth and new beginnings; white and green suggest growth and clarity." },
      { h: "What to write on the ribbon", list: ["“Congratulations on your Grand Opening — wishing you great success!”", "“To a bright future and a thriving business.”", "“Wishing you abundance in this new chapter.”"] },
      { p: "Every grand opening order from IdeaBurst includes a complimentary ribbon with your message and a photo of the finished arrangement before it leaves our studio." },
    ],
  },
  {
    slug: "language-of-flowers",
    title: "The Language of Flowers, Rewritten for Today",
    excerpt: "Victorian floriography gave every bloom a secret meaning. We've translated the classics for modern gifting.",
    category: "Inspiration",
    date: "2026-07-24",
    readMins: 5,
    image: "1579167728798-a1cf3d595960",
    body: [
      { p: "In the 19th century, flowers carried coded messages — a whole conversation could be held in a bouquet. Many of those meanings still shape how we choose flowers today." },
      { h: "Roses", list: ["Red — deep love and respect", "Pink — gratitude and admiration", "White — new beginnings and remembrance", "Peach — sincerity and appreciation"] },
      { h: "Tulips", p: "Perfect, uncomplicated love. Yellow tulips have shed their old meaning of hopeless love and now simply say ‘cheerful thoughts’." },
      { h: "Orchids", p: "Refinement, strength and enduring beauty — a fitting gift for milestones and professional achievements." },
      { h: "Peonies", p: "Prosperity, romance and a happy marriage. Small wonder they're the most-requested wedding flower in our studio." },
      { h: "Sunflowers", p: "Loyalty and adoration — and the simplest way to bring a Big Sky afternoon indoors." },
      { p: "Not sure what to send? Tell our designers about the person and the moment, and we'll compose something that says exactly the right thing." },
    ],
  },
];

export const faqs: { q: string; a: string }[] = [
  { q: "Do you offer same-day delivery?", a: "Yes. Orders placed before 2:00 PM Mountain Time are delivered the same day within Kalispell and most of the Flathead Valley. Orders after 2 PM are delivered the next day, or on any future date you choose." },
  { q: "How much does delivery cost?", a: "Delivery is free within Kalispell city limits (59901, 59903, 59904). Flathead Valley towns such as Whitefish, Columbia Falls and Bigfork are $12, and greater Flathead & Glacier-area addresses are $20. Check any ZIP on our Delivery page." },
  { q: "Will I see my arrangement before it's delivered?", a: "Always. We email you a photo of your finished arrangement before it leaves the studio, and confirm the delivery time once it's on its way." },
  { q: "How long will my flowers stay fresh?", a: "Every arrangement is guaranteed fresh for at least 3 days; with simple care most last a week or more. Orchids bloom for 6–10 weeks. If anything isn't right, send us a photo within 3 days and we'll replace it or refund you." },
  { q: "Can I include a personal message?", a: "Of course. Add your card message at checkout (up to 250 characters). We hand-write every card. For grand opening arrangements, your message is printed on a satin ribbon." },
  { q: "What if a flower in the design isn't available?", a: "We buy fresh every morning, so seasonal availability occasionally changes. If a bloom is unavailable we'll substitute one of equal or greater value in the same color story and style — and you'll see it in the photo before delivery." },
  { q: "What if the recipient isn't home?", a: "Our driver will call the recipient, leave the arrangement in a safe, shaded location if appropriate, or arrange redelivery the same day at no extra cost. Add any instructions at checkout." },
  { q: "How do flower subscriptions work?", a: "Choose a size and a frequency (weekly, every two weeks or monthly). Your card is billed on each delivery cycle and you can pause, skip or cancel anytime by emailing or calling us." },
  { q: "Which payment methods do you accept?", a: "All major credit and debit cards, Apple Pay and Google Pay through Stripe's secure checkout. We never see or store your card details." },
  { q: "Do you deliver outside Montana?", a: "Our own drivers serve the Flathead Valley. For orders elsewhere in the US, call our 24/7 hotline — we can often arrange delivery through a trusted partner florist." },
];
