import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';

interface HeroSection {
  tagline: string;
  title: string;
  description: string;
  ctaPrimary: string;
  ctaSecondary: string;
  pillText: string;
}

interface Feature {
  title: string;
  description: string;
  icon?: string; // Optional icon class or emoji
}

interface WhyUsSection {
  title: string;
  subtitle: string;
  features: Feature[];
}

interface ServicePackage {
  title: string;
  description: string;
  price?: string;
}

interface ServicesSection {
  title: string;
  subtitle: string;
  list: string[];
  packages: ServicePackage[];
}

interface OccasionsSection {
  title: string;
  subtitle: string;
  items: string[];
}



interface Testimonial {
  text: string;
  author: string;
}

interface ContactSection {
  title: string;
  subtitle: string;
  phone: string;
  email: string;
  serviceArea: string;
}

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    RouterLinkActive
  ],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  currentYear = new Date().getFullYear();

  images = [
    'house_01.jpeg',
    'wed_01.jpeg',
    'food_01.jpeg',
    'bday01.jpg',
  ];

  currentIndex = 0;

  // Hero Section Data
  hero: HeroSection = {
    tagline: 'Premium Event & Function Management',
    title: 'At Utsav Kalp, We Craft Your Celebrations.',
    description: '“An event is never just food and farewells. It’s the one time family gathers under one roof, to laugh, bless and remember. At UtsavKalp, we want you in every moment of that togetherness — not worrying about décor, catering or coordination. You savour the family, we manage the function.”',
    ctaPrimary: 'Plan My Event',
    ctaSecondary: 'WhatsApp Us',
    pillText: 'Weddings • House Functions • Festivals • Birthdays • Corporate Events'
  };

  // Why Us Section Data
  whyUs: WhyUsSection = {
    title: 'Why Choose UtsavKalp?',
    subtitle: 'From poojas to grand weddings, our team manages your event end-to-end with a blend of tradition, creativity and professional execution.',
    features: [
      {
        title: 'End-to-End Management',
        description: 'Décor, catering, rituals, entertainment and guest coordination – one dedicated team that handles everything.',
        icon: '✨'
      },
      {
        title: 'Custom Packages',
        description: 'We design packages to suit your budget, venue size and customs while keeping the experience premium.',
        icon: '🎁'
      },
      {
        title: 'Tradition + Style',
        description: 'From kalash and mandap to modern backdrops and lighting, we blend cultural elements with contemporary aesthetics.',
        icon: '🪔'
      },
      {
        title: 'Reliable Execution',
        description: 'Clear timelines, vetted vendors and on-ground coordinators ensure your Utsav runs smoothly.',
        icon: '🤝'
      }
    ]
  };

  // Services Section Data
  services: ServicesSection = {
    title: 'Our Services & Packages',
    subtitle: 'Choose complete event management or pick only the services you need. We’ll shape a plan that fits your occasion.',
    list: [
      'Event planning & day-of coordination',
      'Stage, mandap & entrance decoration',
      'Flower, lighting & theme styling',
      'Catering & live food counters',
      'Pooja & ritual arrangements (pandit, samagri, setup)',
      'DJ, dhol, live music & anchors',
      'Photography & videography',
      'Guest welcome, seating & return gifts'
    ],
    packages: [
      {
        title: 'Griha Utsav Package',
        description: 'Perfect for housewarming, Satyanarayan pooja, naming ceremony and home functions. Includes décor, seating, pooja setup and simple catering options.'
      },
      {
        title: 'Signature Vivaah Package',
        description: 'Complete wedding-day management with mandap décor, varmala stage, baraat welcome, catering, rituals coordination and entertainment.'
      },
      {
        title: 'Celebration Plus Package',
        description: 'For birthdays, anniversaries and corporate events – theme décor, cake table, backdrop, music and catering support.'
      }
    ]
  };

  // Occasions Section Data
  occasions: OccasionsSection = {
    title: 'Celebrations We Manage',
    subtitle: 'No matter the reason to celebrate, we have the expertise to make it memorable.',
    items: [
      'Weddings',
      'Receptions',
      'Engagement',
      'Haldi & Mehendi',
      'Housewarming',
      'Naming Ceremony',
      'Birthday Parties',
      'Anniversaries',
      'Corporate Events',
      'Festivals & Poojas'
    ]
  };



  // Testimonials Section Data
  testimonials: Testimonial[] = [
    {
      text: '“UtsavKalp handled our wedding like family. Décor, food and coordination were flawless – we could truly enjoy every ritual.”',
      author: 'Rohit & Ananya'
    },
    {
      text: '“Our griha pravesh looked beautiful and everything was ready on time. Guests still talk about the food and décor.”',
      author: 'Priya S.'
    }
  ];



  ngOnInit(): void {
    setInterval(() => {
      this.currentIndex = (this.currentIndex + 1) % this.images.length;
    }, 4000); // 4 seconds
  }
}
