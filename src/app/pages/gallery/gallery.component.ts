import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

interface GalleryItem {
  id: number;
  type: 'image' | 'video';
  src: string;
  caption: string;
  category: string;
  description: string;
}

interface Testimonial {
  id: number;
  name: string;
  role: string; // e.g., "Bride", "Corporate Client"
  text: string;
  rating: number;
}

@Component({
  selector: 'app-gallery',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './gallery.component.html',
  styleUrl: './gallery.component.scss'
})
export class GalleryComponent {

  galleryItems: GalleryItem[] = [
    {
      id: 1,
      type: 'image',
      src: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSfzC6LczudJjgGg9hpQ1xgmepcSSQSujYZRQ&s',
      caption: 'Royal Mandap Decor',
      category: 'Wedding',
      description: 'A luxurious setup featuring cascading florals and golden accents for a regal wedding ceremony.'
    },
    {
      id: 2,
      type: 'image',
      src: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      caption: 'Sangeet Night Lighting',
      category: 'Pre-Wedding',
      description: 'Dynamic lighting and vibrant drapes created an energetic atmosphere for this musical evening.'
    },
    {
      id: 3,
      type: 'image',
      src: 'https://images.unsplash.com/photo-1469334031218-e382a71b716b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      caption: 'Outdoor Haldi Setup',
      category: 'Haldi',
      description: 'Bright marigolds and traditional props brought this sunny outdoor Haldi ceremony to life.'
    },
    {
      id: 4,
      type: 'image',
      src: 'https://lyonsdjs.com/wp-content/uploads/2014/08/Corporate-Gala.jpg',
      caption: 'Corporate Gala Dinner',
      category: 'Corporate',
      description: 'Sophisticated table settings and ambient lighting for a high-profile corporate awards night.'
    },
    {
      id: 5,
      type: 'image',
      src: 'https://images.unsplash.com/photo-1527529482837-4698179dc6ce?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      caption: 'Traditional Griha Pravesh',
      category: 'House Function',
      description: 'Elegant floral rangolis and traditional decor marking a beautiful new beginning.'
    },
    {
      id: 6,
      type: 'video',
      src: 'https://wp-media-partyslate.imgix.net/2020/06/photo-856e37ee-6f37-4d3e-baed-506d24065dd7.jpg?auto=compress%2Cformat&ixlib=php-3.3.1', // Placeholder image for video thumbnail
      caption: 'Wedding Highlights Reel',
      category: 'Video',
      description: 'Capturing the most emotional and joyous moments from a three-day wedding extravaganza.'
    }
  ];

  testimonials: Testimonial[] = [
    {
      id: 1,
      name: 'Priya & Rahul',
      role: 'Wedding Clients',
      text: 'UtsavKalp made our dream wedding a reality. The decor was exactly what we imagined, and the coordination was flawless.',
      rating: 5
    },
    {
      id: 2,
      name: 'Mrs. Sharma',
      role: 'Housewarming Host',
      text: 'Thank you for the beautiful arrangements for our Griha Pravesh. The traditional setup was perfect.',
      rating: 5
    },
    {
      id: 3,
      name: 'TechCorp India',
      role: 'Corporate Event',
      text: 'Professional, timely, and elegant. Our annual gala was a huge success thanks to the UtsavKalp team.',
      rating: 4
    }
  ];

  getStars(rating: number): number[] {
    return Array(rating).fill(0);
  }
}
