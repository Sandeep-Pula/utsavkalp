import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

interface ServiceCategory {
  id: string;
  title: string;
  subtitle: string;
  image: string;
  tag?: string;
}

interface WeddingPackage {
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
      id: 'girl-maturity',
      title: 'Girl Maturity Function',
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

  // ===== Modal state for Step 2 =====
  showPackages = false;
  selectedService: ServiceCategory | null = null;

  // Wedding packages (from your planning sheet)
  weddingPackages: WeddingPackage[] = [
    {
      name: 'Basic',
      duration: '2 Day event',
      events: ['Reception', 'Wedding Day'],
    },
    {
      name: 'Pro',
      duration: '3 Day event',
      events: ['Reception', 'Wedding Day', 'Pre Wedding Shoot'],
    },
    {
      name: 'Premium',
      duration: '5 Day event',
      events: [
        'Engagement + Pre-wedding Puja (Vratam Day)',
        'Mehdi + Sangeet Event',
        'Haldi Pool Party',
        'Reception',
        'Wedding Day',
      ],
    },
    {
      name: 'Elite',
      duration: '7 Day event',
      events: [
        'Engagement + Pre-wedding Puja (Vratam Day)',
        'Mehdi + Sangeet Event',
        'Haldi Pool Party',
        'Pre-wedding Shoot, Family Gathering & Dinner',
        'Music Night, Cocktail Party',
        'Reception',
        'Wedding Day',
      ],
    },
    {
      name: 'Destination Wedding',
      duration: 'Custom multi-day plan',
      events: [
        'End-to-end planning across travel, stay & venue',
        'Welcome Dinner',
        'Pool / Beach Haldi',
        'Mehdi + Sangeet',
        'Wedding Day',
        'Reception / After Party',
      ],
    },
  ];

  // When a card is clicked
  onServiceClick(service: ServiceCategory): void {
    console.log('Clicked service:', service.id);

    if (service.id === 'wedding') {
      // open wedding packages modal
      this.selectedService = service;
      this.showPackages = true;
    } else {
      // For now, just log. Later you can add separate package sets.
      // alert(`${service.title} packages coming soon!`);
      this.selectedService = null;
      this.showPackages = false;
    }
  }

  // Close modal
  closePackages(): void {
    this.showPackages = false;
    this.selectedService = null;
  }
}
