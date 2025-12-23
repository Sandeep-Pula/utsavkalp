import { Component, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { EventService, CalendarEvent } from '../../services/event.service';
import { AuthService } from '../../services/auth.service';

@Component({
    selector: 'app-admin',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule],
    templateUrl: './admin.component.html',
    styleUrls: ['./admin.component.scss']
})
export class AdminComponent {
    private eventService = inject(EventService);
    private authService = inject(AuthService);
    private fb = inject(FormBuilder);
    private router = inject(Router);

    // Calendar State
    currentDate = signal(new Date());
    selectedEvent = signal<CalendarEvent | null>(null);
    isFormVisible = signal(false);
    completionValue = signal(0);

    // Search State
    isSearchVisible = signal(false);
    searchQuery = signal('');

    // Form
    eventForm: FormGroup = this.fb.group({
        title: ['', Validators.required],
        date: ['', Validators.required],
        time: ['', Validators.required],
        location: ['', Validators.required],
        type: ['wedding', Validators.required],
        planType: ['basic', Validators.required],
        description: [''],
        completionPercentage: [0]
    });

    // Computed values for calendar rendering
    currentMonthName = computed(() => {
        return this.currentDate().toLocaleString('default', { month: 'long', year: 'numeric' });
    });

    // Dynamic Service Plans
    selectedEventType = signal('wedding');

    availablePlans = computed(() => {
        const type = this.selectedEventType();
        const plans = this.EVENT_PLANS_LABELS[type] || this.EVENT_PLANS_LABELS['wedding'];
        return Object.keys(plans).map(key => ({ key, label: plans[key] }));
    });

    private readonly EVENT_PLANS_LABELS: any = {
        'wedding': { basic: 'Basic', pro: 'Pro', premium: 'Premium', elite: 'Elite' },
        'pre-wedding': { basic: 'State Tour', pro: 'Bharat Tour', premium: 'Overseas Tour' },
        'housewarming': { basic: 'Divine Blessings', pro: 'Elegant Celebrations', premium: 'Grand Feasta' },
        'birthday': { basic: 'Simple Celebration', pro: 'Classic Premium', premium: 'Royal Grand' },
        'shop-opening': { basic: 'Simple Opening', pro: 'Standard Grand', premium: 'Elite Corporate' },
        'half-saree': { basic: 'Lakshmi Package', pro: 'Sree Lakshmi', premium: 'Maha Lakshmi' },
        'other': { basic: 'Custom Plan' }
    };

    constructor() {
        // Update plans when type changes
        this.eventForm.get('type')?.valueChanges.subscribe(val => {
            this.selectedEventType.set(val);
            // Verify if current plan is valid for new type, else reset 
            const available = this.EVENT_PLANS_LABELS[val] || {};
            const currentPlan = this.eventForm.get('planType')?.value;
            if (!available[currentPlan]) {
                this.eventForm.patchValue({ planType: Object.keys(available)[0] || 'basic' });
            }
        });
    }

    // Dashboard Stats
    stats = computed(() => {
        const events = this.eventService.events();
        const now = new Date();
        const currentMonth = now.getMonth();
        const currentYear = now.getFullYear();

        const thisMonthCount = events.filter(e => {
            const d = new Date(e.date);
            return d.getMonth() === currentMonth && d.getFullYear() === currentYear;
        }).length;

        const upcomingCount = events.filter(e => new Date(e.date) >= new Date()).length;

        return {
            total: events.length,
            thisMonth: thisMonthCount,
            upcoming: upcomingCount
        };
    });

    // All Events List (Sorted by Date)
    allEventsList = computed(() => {
        const events = this.eventService.events();
        return events.sort((a, b) => a.date.localeCompare(b.date));
    });

    // Search Results
    searchResults = computed(() => {
        const query = this.searchQuery().toLowerCase().trim();
        const events = this.allEventsList();

        if (!query) return [];

        return events.filter(event =>
            event.title.toLowerCase().includes(query) ||
            event.location.toLowerCase().includes(query) ||
            event.type.toLowerCase().includes(query)
        );
    });



    // Stats Interaction State
    statModalVisible = signal(false);
    selectedStatType = signal<'total' | 'month' | 'upcoming' | null>(null);

    statModalTitle = computed(() => {
        const type = this.selectedStatType();
        switch (type) {
            case 'total': return 'All Events';
            case 'month': return 'Events This Month';
            case 'upcoming': return 'Upcoming Events';
            default: return '';
        }
    });

    statModalEvents = computed(() => {
        const type = this.selectedStatType();
        const events = this.allEventsList();
        const now = new Date();
        const currentMonth = now.getMonth();
        const currentYear = now.getFullYear();

        switch (type) {
            case 'total':
                return events;
            case 'month':
                return events.filter(e => {
                    const d = new Date(e.date);
                    return d.getMonth() === currentMonth && d.getFullYear() === currentYear;
                });
            case 'upcoming':
                return events.filter(e => new Date(e.date) >= now);
            default:
                return [];
        }
    });

    calendarDays = computed(() => {
        const year = this.currentDate().getFullYear();
        const month = this.currentDate().getMonth();

        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);

        const daysInMonth = lastDay.getDate();
        const startingDayOfWeek = firstDay.getDay(); // 0 = Sunday

        const days: { date: string; dayNum: number; events: CalendarEvent[]; isCurrentMonth: boolean }[] = [];

        // Previous month padding
        for (let i = 0; i < startingDayOfWeek; i++) {
            days.push({ date: '', dayNum: 0, events: [], isCurrentMonth: false });
        }

        // Current month days
        const allEvents = this.eventService.events();
        for (let i = 1; i <= daysInMonth; i++) {
            const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(i).padStart(2, '0')}`;
            const dayEvents = allEvents.filter(e => e.date === dateStr);

            days.push({
                date: dateStr,
                dayNum: i,
                events: dayEvents,
                isCurrentMonth: true
            });
        }

        return days;
    });

    // State for Day Events Modal
    selectedDayEvents = signal<{ date: string; events: CalendarEvent[] } | null>(null);

    // State for Pickers
    months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

    // Infinite Years (1900 - 2100)
    availableYears = computed(() => {
        const years = [];
        for (let i = 1900; i <= 2100; i++) {
            years.push(i);
        }
        return years;
    });

    // Navigation
    prevMonth() {
        this.currentDate.update(d => new Date(d.getFullYear(), d.getMonth() - 1, 1));
    }

    nextMonth() {
        this.currentDate.update(d => new Date(d.getFullYear(), d.getMonth() + 1, 1));
    }

    onMonthChange(event: Event) {
        const select = event.target as HTMLSelectElement;
        const monthIndex = parseInt(select.value, 10);
        this.currentDate.update(d => new Date(d.getFullYear(), monthIndex, 1));
    }

    onYearChange(event: Event) {
        const select = event.target as HTMLSelectElement;
        const year = parseInt(select.value, 10);
        this.currentDate.update(d => new Date(year, d.getMonth(), 1));
    }

    // Event Handling
    onDateClick(day: { date: string; events: CalendarEvent[] }) {
        if (day.events.length > 0) {
            // Show list of events
            this.selectedDayEvents.set(day);
        } else {
            // Open add form directly
            this.openAddEventForm(day.date);
        }
    }

    closeDayEventsModal() {
        this.selectedDayEvents.set(null);
    }

    openAddEventForm(date?: string) {
        this.isFormVisible.set(true);
        this.selectedEvent.set(null);
        this.selectedDayEvents.set(null); // Close day list if open
        this.eventForm.reset();
        this.completionValue.set(0); // Reset slider display
        this.eventForm.patchValue({ type: 'wedding', completionPercentage: 0 }); // Default values
        if (date) {
            this.eventForm.patchValue({ date });
        }
    }

    closeForm() {
        this.isFormVisible.set(false);
    }

    viewEvent(event: CalendarEvent, e?: Event) {
        e?.stopPropagation();
        this.selectedEvent.set(event);
        this.selectedDayEvents.set(null); // Close day list if open
    }

    closeEventDetails() {
        this.selectedEvent.set(null);
    }

    onSubmit() {
        if (this.eventForm.valid) {
            this.eventService.addEvent(this.eventForm.value)
                .then(() => {
                    // Success: Close form and reset
                    this.closeForm();
                    this.eventForm.reset();
                })
                .catch(err => {
                    // Failure: Show error to user
                    console.error('Firestore Error:', err);
                    alert('Error saving event: ' + err.message);
                });
        } else {
            // Debug: Show which fields are invalid
            const invalidFields = [];
            const controls = this.eventForm.controls;
            for (const name in controls) {
                if (controls[name].invalid) {
                    invalidFields.push(name);
                }
            }
            alert('Form is invalid. Please fill in: ' + invalidFields.join(', '));
        }
    }

    deleteEvent(id: string) {
        if (confirm('Are you sure you want to delete this event?')) {
            this.eventService.deleteEvent(id);
            this.closeEventDetails();
        }
    }

    logout() {
        this.authService.logout().then(() => {
            this.router.navigate(['/login']);
        });
    }

    updateSliderValue(event: Event) {
        const value = parseInt((event.target as HTMLInputElement).value, 10);
        this.completionValue.set(value);
        this.eventForm.patchValue({ completionPercentage: value });
    }

    // Search Methods
    openSearch() {
        this.isSearchVisible.set(true);
    }

    closeSearch() {
        this.isSearchVisible.set(false);
        this.searchQuery.set('');
    }

    onSearchInput(event: Event) {
        const input = event.target as HTMLInputElement;
        this.searchQuery.set(input.value);
    }

    navigateToManage(eventId: string) {
        this.router.navigate(['/admin/manage-event', eventId]);
    }

    // Stats Interaction Methods
    openStatModal(type: 'total' | 'month' | 'upcoming') {
        this.selectedStatType.set(type);
        this.statModalVisible.set(true);
    }

    closeStatModal() {
        this.statModalVisible.set(false);
        this.selectedStatType.set(null);
    }
}
