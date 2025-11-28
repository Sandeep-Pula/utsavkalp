import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

interface ServiceCategory {
  id: string;
  title: string;
  subtitle: string;
  image: string;
  tag?: string;
}

interface PackagePlan {
  name: string;
  duration: string;
  events: string[];
}

@Component({
  selector: 'app-services',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './services.component.html',
  styleUrls: ['./services.component.scss'],
})
export class ServicesComponent {
  // -------- MAIN SERVICE CARDS ----------
  serviceCategories: ServiceCategory[] = [
    {
      id: 'wedding',
      title: 'Weddings & Receptions',
      subtitle: 'Mandap, varmala, reception décor and full coordination.',
      image: './services_page/wedding.jpg',
      tag: 'Weddings',
    },
    {
      id: 'prewedding-shoot',
      title: 'Pre-Wedding Shoots',
      subtitle: 'Beautiful backdrops and styling for your story.',
      image: './services_page/pre-wedding.jpg',
      tag: 'Photo Shoots',
    },
    {
      id: 'housewarming',
      title: 'House Warming (Griha Pravesh)',
      subtitle: 'Pooja setup, décor and guest arrangements at home.',
      image: './services_page/gruha-pravesha.jpg',
      tag: 'Home Events',
    },
    {
      id: 'birthday',
      title: 'Birthday Celebrations',
      subtitle: 'From kids’ themes to elegant milestone parties.',
      image: './services_page/birthday.jpg',
      tag: 'Birthdays',
    },
    {
      id: 'shop-opening',
      title: 'Shop / Office Opening',
      subtitle: 'Ribbon-cutting, pooja and welcoming ambience.',
      image: './services_page/gruha-pravesha.jpg',
      tag: 'Business',
    },
    {
      id: 'half-saree',
      title: 'Half Saree Function',
      subtitle: 'Traditional décor with a graceful, modern touch.',
      image: './services_page/birthday.jpg',
      tag: 'Events',
    },
    {
      id: 'other',
      title: 'Other Family & Community Events',
      subtitle: 'Festivals, society functions and custom gatherings.',
      image: './services_page/gruha-pravesha.jpg',
      tag: 'Custom',
    },
  ];

  // --------- WEDDING PACKAGES ----------
  private weddingPackages: PackagePlan[] = [
    {
      name: 'Basic',
      duration: '2 Day Event',
      events: ['Reception', 'Wedding Day'],
    },
    {
      name: 'Pro',
      duration: '3 Day Event',
      events: ['Pre-Wedding Shoot', 'Reception', 'Wedding Day'],
    },
    {
      name: 'Premium',
      duration: '5 Day Event',
      events: [
        'Engagement + Pre-wedding Puja (Vratam Day)',
        'Haldi Pool Party',
        'Mehdi + Sangeet Event',
        'Reception',
        'Wedding Day',
      ],
    },
    {
      name: 'Elite',
      duration: '7 Day Event',
      events: [
        'Engagement + Pre-wedding Puja (Vratam Day)',
        'Haldi Pool Party',
        'Mehdi + Sangeet Event',
        'Pre-wedding Shoot, Family Gathering & Dinner',
        'Music Night & Cocktail Party',
        'Reception',
        'Wedding Day',
      ],
    },
  ];

  // --------- PRE-WEDDING SHOOT PACKAGES ----------
  private preWeddingPackages: PackagePlan[] = [
    {
      name: 'State Tour',
      duration: '1–2 Day Shoot (Within State)',
      events: [
        '1 scenic outdoor location in your state',
        '1 indoor / studio setup',
        'Professional photographer + assistant',
        'Basic props and styling guidance',
        'All edited photos (soft copies)',
      ],
    },
    {
      name: 'Bharat Tour',
      duration: '3–4 Day Shoot (Across India)',
      events: [
        'Multi-city / multi-location shoot in India',
        'Concept-based storytelling poses',
        'Candid + traditional photography team',
        'Highlight reel video (1–2 mins)',
        'Outfit & location planning support',
      ],
    },
    {
      name: 'Overseas Tour',
      duration: '5–7 Day Shoot (International)',
      events: [
        'International destination pre-wedding shoot',
        'Multiple landmark locations',
        'Cinematic video with drone (where allowed)',
        'Make-up & styling coordination',
        'Premium album with selected photos',
      ],
    },
  ];

  // --------- HOUSEWARMING (GRUHA PRAVESHAM) PACKAGES ----------
  private housewarmingPackages: PackagePlan[] = [
    {
      name: 'Divine Blessings Package',
      duration: 'Simple Housewarming Setup',
      events: [
        'Purohith arrangement (1 priest)',
        'Complete puja samagri kit',
        'Kalasham, ghee lamps, agarbatti, flowers',
        'Simple rangoli at entrance',
        'Basic toran for main door (mango leaves or artificial)',
        '2 brass lamps for puja area',
        'House entry ritual setup (milk boiling, turmeric water, etc.)',
        'Basic sound system for mantras',
        'Photography – 1 basic photographer (2 hours)',
        'Simple breakfast counter for 20–30 people',
        'Water bottles, plates and cups',
        'Simple floral strands for puja room',
        'Basic cloth backdrop behind puja setup',
      ],
    },
    {
      name: 'Elegant Celebrations Package',
      duration: 'Most Booked – Décor + Services',
      events: [
        'Everything in Divine Blessings Package',
        'Upgraded décor – marigold & jasmine flowers',
        'Entrance arch with flowers',
        'Mandap-style puja area backdrop',
        'Stage carpet + brass diya stands',
        '2 photographers (candid + traditional)',
        '1 videographer (HD camera)',
        'Garland welcome for guests',
        'Mini seating arrangement (chairs with covers)',
        'Breakfast + lunch catering (50–80 people)',
        'Return-gift packing service',
        'Small photo-booth corner',
        'Shanku (conch) blowing for entry',
        'Bluetooth music + slokas playlist',
        'House fragrance diffuser setup',
        'Fruit plates + coconut ceremony assistance',
        'Fresh flower door torans & LED focus lights',
        'Entrance rangoli design',
      ],
    },
    {
      name: 'Grand Feasta Package',
      duration: 'Luxury Temple-Vibe Celebration',
      events: [
        'Everything in Elegant Celebrations Package',
        'Temple-style grand décor (Venkateswara / Ganesha floral backdrop)',
        'Heavy flower mandap & brass kalash towers',
        'Tulasi-kota style entrance decoration',
        'Professional nadaswaram + thavil team',
        '2 purohiths with mantra explanation',
        'Live streaming setup for relatives',
        'Drone aerial photography (where allowed)',
        'Candid + cinematic photo team',
        '4K videography + same-day teaser',
        'Grand guest welcome – flower shower, aarti, kumkum & akshata',
        'Exclusive catering menu (80–150 people) with live counters',
        'Banana-leaf traditional lunch',
        'Guest welcome kits (water, snacks, wet wipes, etc.)',
        'Premium return gifts (silver / oil lamps / customised gifts)',
        'House cleaning team before & after the event',
        'Security & valet parking (if needed)',
        'Dedicated event manager + support team',
        'Full pathway décor, designer rangoli & warm golden stage lighting',
        'Aroma diffusers with premium fragrances',
      ],
    },
  ];


  // --------- BIRTHDAY PACKAGES ----------
  private birthdayPackages: PackagePlan[] = [
    {
      name: 'Simple Celebration',
      duration: 'Basic Birthday Setup',
      events: [
        'Happy Birthday backdrop (fabric or printed)',
        'Basic balloon decoration (100–150 balloons)',
        'Cake table setup with cloth & skirt',
        'Simple welcome board',
        'Small themed props (for kids birthdays)',
        '1 basic photographer (2 hours)',
        'Bluetooth music system',
        'Candle + cake knife set',
        '1 coordinator to manage setup',
        'Pastel / single-colour balloon theme with minimal florals',
        'Fairy lights around backdrop (optional)',
        'Ideal for small home / apartment gatherings',
      ],
    },
    {
      name: 'Classic Premium',
      duration: 'Most Popular Birthday Package',
      events: [
        'Everything in Simple Celebration package',
        'Themed backdrop (cartoon / floral / neon / jungle / unicorn etc.)',
        'Balloon arch, pillars & stage decoration (200–300 balloons)',
        'Name LED or foam board',
        'Cake table décor with theme props',
        'Customised welcome standee',
        '1 photographer + 1 videographer',
        'Return-gift arrangement (up to 30 kids / guests)',
        'Kids fun activities – choose any two: magic show, tattoo artist, balloon artist, puppet show, pottery',
        'Games anchor for kids',
        'Simple snack counter (puffs, fries, juice, cupcakes)',
        'Confetti poppers for cake cutting',
        'Party caps & masks',
        'Color-coordinated themed décor with LED spotlights',
        'Balloon ceiling drops (optional)',
        'Perfect for halls / clubhouses with 40–60 guests',
      ],
    },
    {
      name: 'Royal Grand Birthday',
      duration: 'Elite Edition Celebration',
      events: [
        'Everything in Classic Premium package',
        'Grand designer backdrop (3D / floral / LED wall)',
        'Heavy balloon + floral hybrid decorations',
        'Entrance archway with flowers & neon signs',
        'Live character mascots for kids',
        'Theme-based stage setup (princess, superhero, jungle, space etc.)',
        'Luxury cake table décor (candles, props, fog effect)',
        'Candid + cinematic photography',
        '4K videography + highlight reel',
        'Professional MC + full games session',
        'Full kids activity zone – bouncy castle, soft play area, caricature artist, bubble show, sand art',
        'DJ & premium sound system',
        'Cold pyros for cake cutting',
        'Fog machine entry for birthday boy / girl',
        'Themed invitations (digital + print)',
        'Premium catering (veg / non-veg)',
        'Juice, mocktail & live popcorn counter + chocolate fountain',
        'Premium return gifts (toys / personalised gifts)',
        'Dedicated UtsavKalp event team (4–6 staff)',
        'Grand entrance walkway, chandeliers / LED lighting, heavy props & cut-outs, stage drapery & custom neon name signage',
        'Optional add-ons: designer theme cake, candy table, photo booth, LED dance floor, drone, live music, selfie mirror booth, balloon drops, dancers, live painting, puppet theatre, petting zoo, mascot parade, legal fireworks',
      ],
    },
  ];
  
  // --------- SHOP / OFFICE OPENING PACKAGES ----------
private shop_officeOpeningPackages: PackagePlan[] = [
  {
    name: 'Simple Opening',
    duration: 'Basic Ribbon-Cut Ceremony',
    events: [
      'Ribbon cutting ceremony setup (ribbon + scissors)',
      'Simple flower toran for entrance',
      'Basic balloon decoration (100–150 balloons)',
      'Puja setup (Kalash, coconut, turmeric, flowers)',
      'One Purohith for Ganapathi / Havan',
      'Complete puja samagri kit',
      'Simple welcome board at entrance',
      'Basic sound setup (Bluetooth speaker)',
      '1 photographer for 1.5–2 hours',
      'Water bottles for 20–30 guests',
      'Minimal balloon arch with light floral touch',
      'Small rangoli design at the entrance',
      'Ideal for new shops, salons, boutiques, small offices and cafés',
    ],
  },
  {
    name: 'Standard Grand Opening',
    duration: 'Most Popular Business Launch Package',
    events: [
      'Everything in Simple Opening package',
      'Premium entrance floral arch',
      'Stage / backdrop with company logo (banner or foamboard)',
      'Balloon pillars and décor (250–350 balloons)',
      'Puja mandap setup for formal opening rituals',
      'Personalised welcome standee with brand name',
      '1 photographer + 1 videographer',
      'Traditional welcome (kumkum + akshata)',
      'Light snacks counter for guests',
      'Guest seating setup (20–40 chairs)',
      'Anchor / MC to host the opening ceremony',
      'Scent diffusers inside the shop / office',
      'Premium ribbon-cutting scissors for VIP',
      'Flower shower moment during opening',
      'Basic event lighting setup',
      'Floral torans + marigold strings at key points',
      'Optional balloon ceiling décor',
      'LED spotlights on stage and branding area',
      'Entrance rangoli for a festive welcome',
      'Perfect for clinics, mid-sized showrooms, restaurants and offices',
    ],
  },
  {
    name: 'Elite Corporate Opening',
    duration: 'Luxury Showroom / Big Office Launch',
    events: [
      'Everything in Standard Grand Opening package',
      'Designer entrance décor with grand fresh-flower arch',
      'Golden frame walkway with carpet entrance',
      'Luxurious stage setup with LED wall backdrop',
      'Company logo in 3D acrylic letters on stage',
      'Traditional Nadaswaram / Shehnai team for cultural welcome',
      'Aarti plate welcome for VIPs and chief guests',
      'Ribbon cutting + lamp lighting ceremony coordination',
      'Flower bouquets for VIP / chief guests',
      'Live coverage with 2 candid photographers and 2 videographers',
      '4K camera coverage with edits',
      'Drone shoot for outdoor / façade shots (location permitting)',
      'Media invitations and PR-style photos',
      'Social media reel creation for launch highlights',
      'Entertainment options – live band / violinist / dhol / DJ (as chosen)',
      'High-tea catering for 50–150 guests',
      'Juice / mocktail counter and hospitality staff',
      'Branded welcome gate and story backdrop',
      'LED signage boards and brand visuals',
      'Cold pyros, fog entry and confetti blast effects',
      'Premium add-ons – caricature artist, live painter, gift hamper setup',
      'Dedicated UtsavKalp team: event manager, 4–6 staff, technical crew and décor supervisors',
      'Heavy fresh-flower mandap for puja with venue-wide floral décor',
      'Grand rangoli and LED lighting wash on walls',
      'Exclusive selfie booth for guests and staff',
      'Ideal for high-profile showrooms, corporate HQs, franchises and luxury brands',
    ],
  },
];

// --------- HALF-SAREE FUNCTION PACKAGES ----------
private half_sareePackages: PackagePlan[] = [
  {
    name: 'Lakshmi Package',
    duration: 'Basic Traditional Setup',
    events: [
      'Simple backdrop (cloth or printed)',
      'Basic floral decoration (marigold strings)',
      'Optional pastel balloon garland',
      'Puja setup for coming-of-age rituals',
      '1 Purohith with complete puja samagri',
      'Chair and table setup',
      'Cake table decoration',
      'Simple welcome board',
      'Basic sound system (Bluetooth speaker)',
      '1 photographer for 2 hours',
      'Water, juice & snacks counter (20–30 guests)',
      'Traditional marigold toran at entrance',
      'Small rangoli decoration',
      'Fairy lights around backdrop',
      'Ideal for home functions and small halls',
    ],
  },
  {
    name: 'Sree Lakshmi Package',
    duration: 'Classic Most Popular Package',
    events: [
      'Everything in Simple Traditional package',
      'Grand floral backdrop (lotus / mandala / traditional theme)',
      'Flower + balloon hybrid decoration',
      'Entrance archway decoration',
      'Seating arrangement for 40–80 guests',
      'Name foam-board for the girl',
      'Cake table with full themed décor',
      'Ring-light photo booth',
      '1 photographer + 1 videographer',
      'Themed welcome standee',
      'Makeup & hair stylist for the girl',
      'Return gift counter setup',
      'Anchoring for function + games',
      'Snacks + high-tea catering (40–60 guests)',
      'Optional traditional nadaswaram music',
      'LED spotlights + warm ambience lighting',
      'Fresh flower torans & mandap-style drapes',
      'Side props (peacock / lotus pillars)',
    ],
  },
  {
    name: 'Maha Lakshmi Package',
    duration: 'Elite Grand Event',
    events: [
      'Everything in Classic Celebration package',
      
      // Designer Stage
      'Designer grand stage setup with heavy floral mandap',
      'Lotus / temple / South Indian royal theme',
      'Side pillars, orchids & chandeliers',
      '3D name board or LED neon signage',

      // Entrance Luxury Decor
      'Floral arch + crystal drapes',
      'Carpet walkway with LED pathway lights',

      // Entertainment
      'Live classical musicians (Veena / Flute / Nadaswaram)',
      'Live band or violinist (optional)',
      'Cold pyros for girl’s entry',
      'Fog walk-in entry',
      'Flower shower welcome',

      // Media & Coverage
      '2 candid photographers',
      '2 videographers including 4K camera',
      'Drone shoot (if venue allows)',
      'Same-day teaser edit',
      'Family photoshoot corner',

      // Hospitality & Food
      'Catering for 100–200 guests',
      'Live food counters — chaat, Chinese, desserts',
      'Premium sweet stalls',
      'Soft drinks & mocktail counter',
      'Dedicated serving staff',

      // Special Add-Ons
      'Live painting artist (girl portrait)',
      'Premium customized return gifts',
      'LED video wall on stage',
      'Luxury VIP sofas for stage seating',
      'Full makeup/styling team',
      'Stage-side photoshoot lighting',

      // Team
      'Event manager',
      'Decor team lead',
      '4–6 support staff',
      'Technical lighting & sound team',

      // Decoration
      'Heavy floral center stage',
      'Venue-wide floral strings',
      'Chandeliers or hanging florals',
      'Full rangoli with flower borders',
      'Aroma diffusers across venue',

      'Ideal for elite families wanting cinematic, luxury celebration',
    ],
  },
];

// --------- OTHER FAMILY & COMMUNITY EVENTS PACKAGES ----------
private othereventPackages: PackagePlan[] = [
  {
    name: 'Custom Family & Community Events',
    duration: 'Let’s Discuss & Design Your Event',
    events: [
      'We create personalised packages for family and community events such as poojas, festivals, society gatherings, cultural programs and more.',
      'Share your event details — occasion type, décor style, guest count and location — and we will design a setup that fits your need and budget.',
      'Options include décor, puja arrangements, stage setup, photography, sound, seating and food coordination.',
      'Ideal for Satyanarayan Puja, Annaprasana, Naming Ceremony, Anniversary, Diwali/Dasara celebrations, Community Meet-ups and Cultural Events.',
      'Pricing is finalised after a detailed discussion to tailor everything exactly to your expectations.',
    ],
  },
];



  // ---------- MODAL STATE ----------
  showPackages = false;
  modalTitle = '';
  modalSubtitle = '';
  displayedPackages: PackagePlan[] = [];

  // ---------- EVENT HANDLERS ----------
  onServiceClick(service: ServiceCategory): void {
    switch (service.id) {
      case 'wedding':
        this.modalTitle = 'Wedding & Reception Packages';
        this.modalSubtitle =
          'Choose the wedding plan that fits your celebration – from a simple 2-day event to a full destination experience.';
        this.displayedPackages = this.weddingPackages;
        this.showPackages = true;
        break;

      case 'prewedding-shoot':
        this.modalTitle = 'Pre-Wedding Shoot Packages';
        this.modalSubtitle =
          'From short scenic shoots to grand international love stories – pick the pre-wedding experience that matches your dream.';
        this.displayedPackages = this.preWeddingPackages;
        this.showPackages = true;
        break;

      case 'housewarming':
        this.modalTitle = 'Griha Pravesh (Housewarming) Packages';
        this.modalSubtitle =
          'From a simple divine setup to a grand temple-style celebration, choose the housewarming package that suits your family.';
        this.displayedPackages = this.housewarmingPackages;
        this.showPackages = true;
        break;
      
      case 'birthday':
        this.modalTitle = 'Blessed Birthday Packages';
        this.modalSubtitle =
          'Celebrate birthdays with joy and blessings. Choose from our curated packages to make your special day unforgettable.';
        this.displayedPackages = this.birthdayPackages;
        this.showPackages = true;
        break;
      case 'shop-opening':
        this.modalTitle = 'A Good Start with Shop/Office Opening Packages';
        this.modalSubtitle =
          'Mark the beginning of your business journey with our specialized shop/office opening packages, designed to bring prosperity and success.';
        this.displayedPackages = this.shop_officeOpeningPackages;
        this.showPackages = true;
        break;
      case 'half-saree':
        this.modalTitle = 'Half Saree Function Packages';
        this.modalSubtitle =
          'Celebrate this traditional milestone with our elegant half saree function packages, blending cultural charm with modern sophistication.';
        this.displayedPackages = this.half_sareePackages;
        this.showPackages = true;
      break;
      case 'other':
        this.modalTitle = 'Other Family & Community Event Packages';
        this.modalSubtitle =
          'From festivals to society functions, explore our versatile packages designed to make any gathering special and memorable.';
        this.displayedPackages = this.othereventPackages;
        this.showPackages = true;
      break;

      default:
        // for other cards we can add later
        this.showPackages = false;
        this.displayedPackages = [];
        break;
    }
  }

  closePackages(): void {
    this.showPackages = false;
  }
}
