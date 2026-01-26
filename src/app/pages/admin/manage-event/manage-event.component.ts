import { Component, inject, signal, computed, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DragDropModule, CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { ActivatedRoute, Router } from '@angular/router';
import { toObservable } from '@angular/core/rxjs-interop';
import { debounceTime, switchMap, tap, merge, filter } from 'rxjs';
import { EventService, CalendarEvent, Guest, Vendor } from '../../../services/event.service';

interface ChecklistItem {
  label: string;
  completed: boolean;
  status?: 'todo' | 'in-progress' | 'done';
  note?: string;
  expense?: number;
}

interface StaffMember {
  id: string;
  name: string;
  role: string;
  contact?: string;
}

@Component({
  selector: 'app-manage-event',
  standalone: true,
  imports: [CommonModule, FormsModule, DragDropModule],
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
  staff = signal<StaffMember[]>([]);
  guests = signal<Guest[]>([]);
  vendors = signal<Vendor[]>([]);
  totalBudget = signal<number>(0);
  savingStatus = signal<'saved' | 'saving' | 'error'>('saved');

  // Tab State
  activeTab = signal<'overview' | 'guests' | 'vendors' | 'budget'>('overview');

  // Checklist View Mode
  checklistView = signal<'list' | 'kanban'>('list');

  totalSpent = computed(() => {
    const checklistSpent = this.checklist().reduce((sum, item) => sum + (item.expense || 0), 0);
    const vendorSpent = this.vendors().reduce((sum, v) => sum + (v.amountPaid || 0), 0);
    // Note: Should we count 'contractAmount' or 'amountPaid' against budget? 
    // Usually Contract Amount is the committed cost, so let's track Contract Amount for budget usage if available.
    // But for visual consistency with "Total Spent", maybe paid? 
    // Let's stick to Expenses + Vendor Paid for now, or maybe Vendor Contract Amount is safer for budget planning.
    // Let's use Vendor Paid for "Spent" and maybe show "Committed" separately later.
    return checklistSpent + vendorSpent;
  });

  remainingBudget = computed(() => {
    return this.totalBudget() - this.totalSpent();
  });

  guestStats = computed(() => {
    const list = this.guests();
    return {
      total: list.length,
      attending: list.filter(g => g.rsvpStatus === 'attending').length,
      pending: list.filter(g => g.rsvpStatus === 'pending').length,
      declined: list.filter(g => g.rsvpStatus === 'declined').length
    };
  });

  vendorStats = computed(() => {
    const list = this.vendors();
    return {
      total: list.length,
      hired: list.filter(v => v.status === 'hired' || v.status === 'signed' || v.status === 'completed').length,
      cost: list.reduce((sum, v) => sum + (v.contractAmount || 0), 0),
      paid: list.reduce((sum, v) => sum + (v.amountPaid || 0), 0)
    };
  });

  // Checklists Definitions
  private readonly EVENT_PLANS: any = {
    wedding: {
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
    // Auto-save logic
    const checklist$ = toObservable(this.checklist);
    const staff$ = toObservable(this.staff);
    const budget$ = toObservable(this.totalBudget);
    const guests$ = toObservable(this.guests);
    const vendors$ = toObservable(this.vendors);

    merge(checklist$, staff$, budget$, guests$, vendors$)
      .pipe(
        filter(() => !!this.event()), // Only save if event is loaded
        tap(() => this.savingStatus.set('saving')),
        debounceTime(2000),
        switchMap(() => this.saveData())
      )
      .subscribe({
        next: () => {
          this.savingStatus.set('saved');
        },
        error: (err) => {
          console.error('Auto-save error', err);
          this.savingStatus.set('error');
        }
      });

    if (this.eventId) {
      this.loadEvent();
    }
  }

  async saveData() {
    if (!this.eventId) return;

    const progress = this.calculateProgress();
    const checklistData = this.checklist();
    const staffData = this.staff();
    const guestData = this.guests();
    const vendorData = this.vendors();
    const currentPlan = this.event()?.planType || 'basic';

    await this.eventService.updateEvent(this.eventId, {
      checklist: checklistData,
      assignedStaff: staffData,
      completionPercentage: progress,
      planType: currentPlan,
      budget: this.totalBudget(),
      guests: guestData,
      vendors: vendorData,
      status: this.event()?.status || 'upcoming'
    });
  }

  loadEvent() {
    const allEvents = this.eventService.events();
    const found = allEvents.find(e => e.id === this.eventId);

    if (found) {
      this.event.set(found);

      if (found.checklist && found.checklist.length > 0) {
        // Migration: Ensure status exists
        const items = found.checklist.map(item => ({
          ...item,
          status: item.status || (item.completed ? 'done' : 'todo')
        }));
        this.checklist.set(JSON.parse(JSON.stringify(items)));
      } else {
        // Find default plan for this type
        const type = found.type || 'wedding'; // Default to wedding if undefined
        const defaultPlan = this.EVENT_PLANS[type] ? Object.keys(this.EVENT_PLANS[type])[0] : 'basic';
        this.initializeChecklist(found.planType || defaultPlan);
      }

      if (found.assignedStaff) {
        this.staff.set(JSON.parse(JSON.stringify(found.assignedStaff)));
      }

      if (found.budget) {
        this.totalBudget.set(found.budget);
      }

      if (found.guests) {
        this.guests.set(JSON.parse(JSON.stringify(found.guests)));
      }

      if (found.vendors) {
        this.vendors.set(JSON.parse(JSON.stringify(found.vendors)));
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

    // Deep copy & init status
    const initializedItems = items.map((i: any) => ({ ...i, status: 'todo' }));
    this.checklist.set(JSON.parse(JSON.stringify(initializedItems)));
  }

  newTaskName = '';

  addTask() {
    if (this.newTaskName && this.newTaskName.trim()) {
      this.checklist.update(items => [
        ...items,
        { label: this.newTaskName.trim(), completed: false, status: 'todo' }
      ]);
      this.newTaskName = ''; // Clear input
    }
  }

  drop(event: CdkDragDrop<ChecklistItem[]>) {
    // If moving within same container (List view or same Kanban column)
    if (event.previousContainer === event.container) {
      this.checklist.update(items => {
        // Logic differs slightly because 'items' in update is the FULL list, 
        // but event.container.data is just the subset if in Kanban.
        // For simplicity in list view, it's straightforward.
        // For Kanban, we rely on the component mapping, but here we update the main source.
        // Actually, for Kanban reordering within same column, we need to map indices back to the main array.
        // But let's simplify: List View uses this. Kanban will use a separate handler or we adapt this.

        // If in list view, it's just index swap
        if (this.checklistView() === 'list') {
          const newItems = [...items];
          moveItemInArray(newItems, event.previousIndex, event.currentIndex);
          return newItems;
        }
        return items; // Kanban reorder to be handled specifically if needed, or see below
      });
    } else {
      // Kanban Drag-Drop between columns
      const item = event.previousContainer.data[event.previousIndex];
      const newStatus = event.container.id as 'todo' | 'in-progress' | 'done';

      this.updateItemStatus(item, newStatus);
    }
  }

  // Kanban Specific Helpers
  get todoItems() { return this.checklist().filter(i => i.status === 'todo' || (!i.status && !i.completed)); }
  get inProgressItems() { return this.checklist().filter(i => i.status === 'in-progress'); }
  get doneItems() { return this.checklist().filter(i => i.status === 'done' || (!i.status && i.completed)); }

  updateItemStatus(item: ChecklistItem, status: 'todo' | 'in-progress' | 'done') {
    this.checklist.update(items => {
      return items.map(i => {
        if (i === item || (i.label === item.label && i.note === item.note)) {
          return {
            ...i,
            status: status,
            completed: status === 'done'
          };
        }
        return i;
      });
    });
  }

  toggleItem(index: number) {
    this.checklist.update(items => {
      const newItems = [...items];
      newItems[index].completed = !newItems[index].completed;
      // Sync status
      newItems[index].status = newItems[index].completed ? 'done' : 'todo';
      return newItems;
    });
  }

  calculateProgress(): number {
    const items = this.checklist();
    if (items.length === 0) return 0;
    const completed = items.filter(i => i.completed).length;
    return Math.round((completed / items.length) * 100);
  }

  async saveProgress() {
    await this.saveData();
    alert('Progress saved!');
    this.router.navigate(['/admin']);
  }

  newStaffName = '';
  newStaffRole = '';

  addStaff() {
    if (this.newStaffName.trim() && this.newStaffRole.trim()) {
      this.staff.update(current => [
        ...current,
        {
          id: Date.now().toString(),
          name: this.newStaffName.trim(),
          role: this.newStaffRole.trim()
        }
      ]);
      this.newStaffName = '';
      this.newStaffRole = '';
    }
  }

  removeStaff(index: number) {
    this.staff.update(current => current.filter((_, i) => i !== index));
  }

  // GUEST MANAGEMENT
  newGuestName = '';
  newGuestGroup: Guest['group'] = 'friend';

  addGuest() {
    if (this.newGuestName.trim()) {
      this.guests.update(current => [
        {
          id: Date.now().toString(),
          name: this.newGuestName.trim(),
          rsvpStatus: 'pending',
          group: this.newGuestGroup
        },
        ...current
      ]);
      this.newGuestName = '';
    }
  }

  removeGuest(index: number) {
    this.guests.update(current => current.filter((_, i) => i !== index));
  }

  // VENDOR MANAGEMENT
  newVendorName = '';
  newVendorCategory = 'Catering';

  addVendor() {
    if (this.newVendorName.trim()) {
      this.vendors.update(current => [
        {
          id: Date.now().toString(),
          name: this.newVendorName.trim(),
          category: this.newVendorCategory,
          status: 'evaluating'
        },
        ...current
      ]);
      this.newVendorName = '';
    }
  }

  removeVendor(index: number) {
    this.vendors.update(current => current.filter((_, i) => i !== index));
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

  toggleCompletion() {
    this.event.update(e => {
      if (!e) return null;
      return { ...e, status: e.status === 'completed' ? 'upcoming' : 'completed' };
    });
    // Trigger auto-save immediately to persist change
    this.saveData();
  }
}
