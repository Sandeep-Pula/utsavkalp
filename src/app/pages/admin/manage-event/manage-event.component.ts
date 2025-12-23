import { Component, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { EventService, CalendarEvent } from '../../../services/event.service';

interface ChecklistItem {
  label: string;
  completed: boolean;
}

@Component({
  selector: 'app-manage-event',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './manage-event.component.html',
  styleUrls: ['./manage-event.component.scss']
})
export class ManageEventComponent {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private eventService = inject(EventService);

  eventId = this.route.snapshot.paramMap.get('id');
  event = signal<CalendarEvent | null>(null);
  checklist = signal<ChecklistItem[]>([]);

  // Checklists Definitions
  private readonly EVENT_PLANS: any = {
    'wedding': {
      basic: { label: 'Basic Plan', items: [{ label: 'Reception', completed: false }, { label: 'Wedding Day', completed: false }] },
      pro: { label: 'Pro Plan', items: [{ label: 'Pre-Wedding Shoot', completed: false }, { label: 'Reception', completed: false }, { label: 'Wedding Day', completed: false }] },
      premium: {
        label: 'Premium Plan',
        items: [
          { label: 'Engagement + Pre-wedding Puja (Vratam Day)', completed: false },
          { label: 'Haldi Pool Party', completed: false },
          { label: 'Mehdi + Sangeet Event', completed: false },
          { label: 'Reception', completed: false },
          { label: 'Wedding Day', completed: false }
        ]
      },
      elite: {
        label: 'Elite Plan',
        items: [
          { label: 'Engagement + Pre-wedding Puja (Vratam Day)', completed: false },
          { label: 'Haldi Pool Party', completed: false },
          { label: 'Mehdi + Sangeet Event', completed: false },
          { label: 'Pre-wedding Shoot, Family Gathering & Dinner', completed: false },
          { label: 'Music Night & Cocktail Party', completed: false },
          { label: 'Reception', completed: false },
          { label: 'Wedding Day', completed: false }
        ]
      }
    },
    'pre-wedding': {
      basic: {
        label: 'State Tour',
        items: [
          { label: '1 scenic outdoor location in your state', completed: false },
          { label: '1 indoor / studio setup', completed: false },
          { label: 'Professional photographer + assistant', completed: false },
          { label: 'Basic props and styling guidance', completed: false },
          { label: 'All edited photos (soft copies)', completed: false }
        ]
      },
      pro: {
        label: 'Bharat Tour',
        items: [
          { label: 'Multi-city / multi-location shoot in India', completed: false },
          { label: 'Concept-based storytelling poses', completed: false },
          { label: 'Candid + traditional photography team', completed: false },
          { label: 'Highlight reel video (1–2 mins)', completed: false },
          { label: 'Outfit & location planning support', completed: false }
        ]
      },
      premium: {
        label: 'Overseas Tour',
        items: [
          { label: 'International destination pre-wedding shoot', completed: false },
          { label: 'Multiple landmark locations', completed: false },
          { label: 'Cinematic video with drone (where allowed)', completed: false },
          { label: 'Make-up & styling coordination', completed: false },
          { label: 'Premium album with selected photos', completed: false }
        ]
      }
    },
    'housewarming': {
      basic: {
        label: 'Divine Blessings',
        items: [
          { label: 'Purohith arrangement (1 priest)', completed: false },
          { label: 'Complete puja samagri kit', completed: false },
          { label: 'Kalasham, ghee lamps, agarbatti, flowers', completed: false },
          { label: 'Simple rangoli at entrance', completed: false },
          { label: 'House entry ritual setup', completed: false },
          { label: 'Photography (2 hours)', completed: false },
          { label: 'Simple breakfast counter', completed: false }
        ]
      },
      pro: {
        label: 'Elegant Celebrations',
        items: [
          { label: 'Upgraded décor – marigold & jasmine', completed: false },
          { label: 'Entrance arch with flowers', completed: false },
          { label: '2 photographers (candid + traditional)', completed: false },
          { label: '1 videographer (HD camera)', completed: false },
          { label: 'Garland welcome for guests', completed: false },
          { label: 'Catering (50–80 people)', completed: false },
          { label: 'Return-gift packing service', completed: false }
        ]
      },
      premium: {
        label: 'Grand Feasta',
        items: [
          { label: 'Temple-style grand décor', completed: false },
          { label: 'Professional nadaswaram + thavil team', completed: false },
          { label: '2 purohiths with explanation', completed: false },
          { label: 'Live streaming setup', completed: false },
          { label: 'Drone aerial photography', completed: false },
          { label: 'Exclusive catering menu (80–150 people)', completed: false },
          { label: 'Premium return gifts', completed: false }
        ]
      }
    },
    'birthday': {
      basic: { label: 'Simple Celebration', items: [{ label: 'Cake Table', completed: false }, { label: 'Balloon Decor (100 balloons)', completed: false }, { label: 'Basic Photographer', completed: false }] },
      pro: { label: 'Classic Premium', items: [{ label: 'Themed Backdrop', completed: false }, { label: 'Balloon Arch (200-300 balloons)', completed: false }, { label: 'Photo + Video', completed: false }, { label: 'Kids Activities', completed: false }] },
      premium: { label: 'Royal Grand', items: [{ label: 'Designer 3D Backdrop', completed: false }, { label: 'Live Characters', completed: false }, { label: 'Cinematic Photo/Video', completed: false }, { label: 'DJ & Sound', completed: false }, { label: 'Premium Catering', completed: false }] }
    },
    'shop-opening': {
      basic: { label: 'Simple Opening', items: [{ label: 'Ribbon Cutting Setup', completed: false }, { label: 'Puja Setup', completed: false }, { label: 'Basic Decor', completed: false }] },
      pro: { label: 'Standard Grand', items: [{ label: 'Floral Arch', completed: false }, { label: 'Balloon Pillars', completed: false }, { label: 'Sound System', completed: false }, { label: 'Catering (Snacks)', completed: false }] },
      premium: { label: 'Elite Corporate', items: [{ label: 'Designer Stage', completed: false }, { label: 'Live Music/Band', completed: false }, { label: 'Media Coverage', completed: false }, { label: 'High Tea Catering', completed: false }] }
    },
    'half-saree': {
      basic: { label: 'Lakshmi Package', items: [{ label: 'Simple Backdrop', completed: false }, { label: 'Puja Setup', completed: false }, { label: 'Photographer', completed: false }] },
      pro: { label: 'Sree Lakshmi', items: [{ label: 'Grand Floral Backdrop', completed: false }, { label: 'Entrance Arch', completed: false }, { label: 'Photo + Video', completed: false }, { label: 'Makeup Artist', completed: false }] },
      premium: { label: 'Maha Lakshmi', items: [{ label: 'Designer Stage & Mandap', completed: false }, { label: 'Live Musicians', completed: false }, { label: 'Cinematic Coverage', completed: false }, { label: 'Premium Catering', completed: false }] }
    },
    'other': {
      basic: { label: 'Custom Plan', items: [{ label: 'Initial Consultation', completed: false }, { label: 'Define Requirements', completed: false }] }
    }
  };

  constructor() {
    if (this.eventId) {
      this.loadEvent();
    }
  }

  loadEvent() {
    const allEvents = this.eventService.events();
    const found = allEvents.find(e => e.id === this.eventId);

    if (found) {
      this.event.set(found);

      if (found.checklist && found.checklist.length > 0) {
        this.checklist.set(JSON.parse(JSON.stringify(found.checklist)));
      } else {
        // Find default plan for this type
        const type = found.type || 'wedding'; // Default to wedding if undefined
        const defaultPlan = this.EVENT_PLANS[type] ? Object.keys(this.EVENT_PLANS[type])[0] : 'basic';
        this.initializeChecklist(found.planType || defaultPlan);
      }
    }
  }

  initializeChecklist(planKey: string) {
    const eventType = this.event()?.type || 'wedding';
    const typePlans = this.EVENT_PLANS[eventType] || this.EVENT_PLANS['wedding'];

    // Fallback if planKey doesn't exist in this type
    if (!typePlans[planKey]) {
      planKey = Object.keys(typePlans)[0] || 'basic';
    }

    const planData = typePlans[planKey];
    const items = planData ? planData.items : [];

    // Deep copy
    this.checklist.set(JSON.parse(JSON.stringify(items)));
  }

  toggleItem(index: number) {
    this.checklist.update(items => {
      const newItems = [...items];
      newItems[index].completed = !newItems[index].completed;
      return newItems;
    });
  }

  calculateProgress(): number {
    const items = this.checklist();
    if (items.length === 0) return 0;
    const completed = items.filter(i => i.completed).length;
    return Math.round((completed / items.length) * 100);
  }

  saveProgress() {
    if (!this.eventId) return;

    const progress = this.calculateProgress();
    const checklistData = this.checklist();
    const currentPlan = this.event()?.planType || 'basic'; // Use existing, or we might need to track it in a signal if it changes

    this.eventService.updateEvent(this.eventId, {
      checklist: checklistData,
      completionPercentage: progress,
      planType: currentPlan
    });

    alert('Progress saved!');
    this.router.navigate(['/admin']);
  }

  changePlan(newType: string) {
    const eventType = this.event()?.type || 'wedding';
    const typePlans = this.EVENT_PLANS[eventType] || this.EVENT_PLANS['wedding'];
    const newPlanLabel = typePlans[newType]?.label || newType;

    if (confirm(`Switching to ${newPlanLabel} will reset your current checklist progress. Continue?`)) {
      this.event.update(e => e ? { ...e, planType: newType } : null);
      this.initializeChecklist(newType);
    }
  }

  goBack() {
    this.router.navigate(['/admin']);
  }

  get planTypeDisplay(): string {
    const type = this.event()?.planType || 'basic';
    const eventType = this.event()?.type || 'wedding';
    const plan = this.EVENT_PLANS[eventType]?.[type];
    return plan ? plan.label : type.toUpperCase();
  }

  onPlanChange(event: Event) {
    const select = event.target as HTMLSelectElement;
    this.changePlan(select.value);
  }

  get currentPlanOptions() {
    const eventType = this.event()?.type || 'wedding';
    const plans = this.EVENT_PLANS[eventType] || this.EVENT_PLANS['wedding'];
    return Object.keys(plans).map(key => ({
      key: key,
      label: plans[key].label
    }));
  }
}
