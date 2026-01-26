import { Component, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { EventService, CalendarEvent } from '../../services/event.service';
import { AuthService } from '../../services/auth.service';
import { NgApexchartsModule } from "ng-apexcharts";
import {
    ApexAxisChartSeries,
    ApexChart,
    ApexXAxis,
    ApexTitleSubtitle,
    ApexStroke,
    ApexDataLabels,
    ApexYAxis,
    ApexTooltip,
    ApexGrid,
    ApexLegend,
    ApexPlotOptions,
    ApexNonAxisChartSeries,
    ApexResponsive,
    ApexFill,
    ApexMarkers
} from "ng-apexcharts";

export type ChartOptions = {
    series: ApexAxisChartSeries | ApexNonAxisChartSeries;
    chart: ApexChart;
    xaxis?: ApexXAxis;
    yaxis?: ApexYAxis;
    title?: ApexTitleSubtitle;
    labels?: string[];
    colors?: string[];
    legend?: ApexLegend;
    plotOptions?: ApexPlotOptions;
    dataLabels?: ApexDataLabels;
    tooltip?: ApexTooltip;
    stroke?: ApexStroke;
    grid?: ApexGrid;
    responsive?: ApexResponsive[];
    fill?: ApexFill;
    markers?: ApexMarkers;
};

@Component({
    selector: 'app-admin',
    standalone: true,
    imports: [
        CommonModule,
        ReactiveFormsModule,
        MatCardModule,
        MatButtonModule,
        MatIconModule,
        MatDividerModule,
        MatProgressBarModule,
        NgApexchartsModule
    ],
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

    // View State
    viewMode = signal<'dashboard' | 'statistics'>('dashboard');

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
            upcoming: upcomingCount,
            completed: events.filter(e => e.status === 'completed').length
        };
    });

    // Analytics Data (Computed)
    monthlyEventsChart = computed<ChartOptions>(() => {
        const events = this.eventService.events();
        const year = new Date().getFullYear();
        const monthCounts = Array(12).fill(0);

        events.forEach(e => {
            const d = new Date(e.date);
            if (d.getFullYear() === year) {
                monthCounts[d.getMonth()]++;
            }
        });

        return {
            series: [{
                name: "Events",
                data: monthCounts
            }],
            chart: {
                height: 350,
                type: "bar",
                fontFamily: 'inherit',
                toolbar: { show: false }
            },
            plotOptions: {
                bar: {
                    borderRadius: 4,
                    columnWidth: '45%',
                    distributed: true
                }
            },
            dataLabels: { enabled: false },
            legend: { show: false },
            colors: ['#800000', '#D4AF37', '#800000', '#D4AF37', '#800000', '#D4AF37', '#800000', '#D4AF37', '#800000', '#D4AF37', '#800000', '#D4AF37'],
            grid: {
                borderColor: '#f1f1f1',
                strokeDashArray: 4,
            },
            xaxis: {
                categories: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
                labels: {
                    style: { colors: '#777' }
                },
                axisBorder: { show: false },
                axisTicks: { show: false }
            },
            yaxis: {
                labels: {
                    style: { colors: '#777' }
                }
            },
            title: {
                text: `Monthly Events (${year})`,
                align: 'left',
                style: {
                    fontSize: '16px',
                    fontWeight: '600',
                    fontFamily: 'Playfair Display, serif',
                    color: '#800000'
                }
            }
        };
    });

    eventTypeChart = computed<ChartOptions>(() => {
        const events = this.eventService.events();
        const typeCounts: { [key: string]: number } = {};

        events.forEach(e => {
            const type = e.type || 'Other';
            typeCounts[type] = (typeCounts[type] || 0) + 1;
        });

        const labels = Object.keys(typeCounts).map(t => t.charAt(0).toUpperCase() + t.slice(1).replace('-', ' '));
        const data = Object.values(typeCounts);

        return {
            series: data,
            chart: {
                type: "donut",
                height: 350,
                fontFamily: 'inherit'
            },
            labels: labels,
            colors: ['#800000', '#D4AF37', '#C0C0C0', '#4CAF50', '#2196F3', '#FF9800', '#9C27B0'],
            legend: {
                position: 'bottom',
                fontSize: '14px',
                fontFamily: 'inherit'
            },
            dataLabels: { enabled: false },
            responsive: [{
                breakpoint: 480,
                options: {
                    chart: { width: 200 },
                    legend: { position: 'bottom' }
                }
            }],
            title: {
                text: "Events by Category",
                align: 'left',
                style: {
                    fontSize: '16px',
                    fontWeight: '600',
                    fontFamily: 'Playfair Display, serif',
                    color: '#800000'
                }
            }
        };
    });

    revenueChart = computed<ChartOptions>(() => {
        const events = this.eventService.events().filter(e => e.status !== 'completed');
        // Sort by date for line chart
        const sortedEvents = [...events].sort((a, b) => a.date.localeCompare(b.date)).slice(0, 10); // Last 10 upcoming

        const costs = sortedEvents.map(e => e.budget || 0);
        const dates = sortedEvents.map(e => {
            const d = new Date(e.date);
            return `${d.getDate()}/${d.getMonth() + 1}`;
        });

        return {
            series: [{
                name: "Budget",
                data: costs
            }],
            chart: {
                height: 350,
                type: "area",
                fontFamily: 'inherit',
                toolbar: { show: false }
            },
            dataLabels: { enabled: false },
            stroke: {
                curve: 'smooth',
                width: 2,
                colors: ['#D4AF37']
            },
            fill: {
                type: "gradient",
                gradient: {
                    shadeIntensity: 1,
                    opacityFrom: 0.7,
                    opacityTo: 0.9,
                    stops: [0, 90, 100],
                    colorStops: [
                        { offset: 0, color: "#D4AF37", opacity: 0.4 },
                        { offset: 100, color: "#D4AF37", opacity: 0 }
                    ]
                }
            },
            xaxis: {
                categories: dates,
                labels: { style: { colors: '#777' } },
                tooltip: { enabled: false }
            },
            yaxis: {
                labels: {
                    formatter: (value) => { return "₹" + (value / 1000) + "k" },
                    style: { colors: '#777' }
                }
            },
            grid: {
                borderColor: '#f1f1f1',
                strokeDashArray: 4,
            },
            markers: {
                size: 5,
                colors: ['#fff'],
                strokeColors: '#D4AF37',
                strokeWidth: 2,
                hover: { size: 7 }
            },
            title: {
                text: "Budget Overview (Upcoming)",
                align: 'left',
                style: {
                    fontSize: '16px',
                    fontWeight: '600',
                    fontFamily: 'Playfair Display, serif',
                    color: '#800000'
                }
            }
        };
    });

    // All Events List (Active Only - Sorted by Date)
    allEventsList = computed(() => {
        const events = this.eventService.events();
        return events
            .filter(e => e.status !== 'completed')
            .sort((a, b) => a.date.localeCompare(b.date));
    });

    // Search Results (Global Search)
    searchResults = computed(() => {
        const query = this.searchQuery().toLowerCase().trim();
        const events = this.eventService.events().sort((a, b) => a.date.localeCompare(b.date));

        if (!query) return [];

        return events.filter(event =>
            event.title.toLowerCase().includes(query) ||
            event.location.toLowerCase().includes(query) ||
            event.type.toLowerCase().includes(query)
        );
    });



    // Stats Interaction State
    statModalVisible = signal(false);
    selectedStatType = signal<'total' | 'month' | 'upcoming' | 'completed' | null>(null);

    statModalTitle = computed(() => {
        const type = this.selectedStatType();
        switch (type) {
            case 'total': return 'All Events';
            case 'month': return 'Events This Month';
            case 'upcoming': return 'Upcoming Events';
            case 'completed': return 'Completed Events';
            default: return '';
        }
    });

    statModalEvents = computed(() => {
        const type = this.selectedStatType();
        const events = this.eventService.events().sort((a, b) => a.date.localeCompare(b.date));
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
                return events.filter(e => new Date(e.date) >= now && e.status !== 'completed');
            case 'completed':
                return events.filter(e => e.status === 'completed');
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
    openStatModal(type: 'total' | 'month' | 'upcoming' | 'completed') {
        this.selectedStatType.set(type);
        this.statModalVisible.set(true);
    }

    closeStatModal() {
        this.statModalVisible.set(false);
        this.selectedStatType.set(null);
    }

    setView(mode: 'dashboard' | 'statistics') {
        this.viewMode.set(mode);
    }
}
