import { Component, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { EventService, CalendarEvent } from '../../services/event.service';

@Component({
    selector: 'app-admin',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule],
    templateUrl: './admin.component.html',
    styleUrls: ['./admin.component.scss']
})
export class AdminComponent {
    private eventService = inject(EventService);
    private fb = inject(FormBuilder);

    // Calendar State
    currentDate = signal(new Date());
    selectedEvent = signal<CalendarEvent | null>(null);
    isFormVisible = signal(false);

    // Form
    eventForm: FormGroup = this.fb.group({
        title: ['', Validators.required],
        date: ['', Validators.required],
        time: ['', Validators.required],
        location: ['', Validators.required],
        type: ['wedding', Validators.required],
        description: [''],
        completionPercentage: [0]
    });

    // Computed values for calendar rendering
    currentMonthName = computed(() => {
        return this.currentDate().toLocaleString('default', { month: 'long', year: 'numeric' });
    });

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
            this.eventService.addEvent(this.eventForm.value);
            this.closeForm();
            this.eventForm.reset();
        }
    }

    deleteEvent(id: string) {
        if (confirm('Are you sure you want to delete this event?')) {
            this.eventService.deleteEvent(id);
            this.closeEventDetails();
        }
    }
}
