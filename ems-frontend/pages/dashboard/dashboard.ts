// EMS Dashboard Application - TypeScript Version
// Dashboard-specific functionality with type safety

import type { SidebarElement, QuantitySpinner } from '../../types/index.js';
import type { EMSChartConfig } from '../../types/chart.js';

// Declare Chart.js and Swiper globals
declare const Chart: any;
declare const Swiper: any;

// Wait for DOM and Chart.js to be fully loaded
document.addEventListener('DOMContentLoaded', (): void => {
    console.log('🚀 EMS Dashboard Initialized (TypeScript)');
    
    initQuantitySpinner();
    
    // Initialize all charts
    initCharts();
    
    // Initialize Swiper sliders
    initSwiper();
    
    // Initialize sidebar functionality
    initSidebar();
});

// Initialize Swiper functionality
function initSwiper(): void {
    // Product single page sliders
    try {
        const thumbSlider = new Swiper(".product-thumbnail-slider", {
            slidesPerView: 3,
            spaceBetween: 20,
            autoplay: true,
            direction: "vertical",
            pagination: {
                el: ".swiper-pagination",
                clickable: true,
            },
        });

        const largeSlider = new Swiper(".product-large-slider", {
            slidesPerView: 1,
            autoplay: true,
            spaceBetween: 0,
            effect: 'fade',
            thumbs: {
                swiper: thumbSlider,
            },
        });
        
        console.log('📱 Swiper sliders initialized');
    } catch (error) {
        console.warn('⚠️ Swiper not available or elements not found:', error);
    }
}

// Initialize sidebar functionality
function initSidebar(): void {
    const sidebarElements: SidebarElement = {
        toggle: document.getElementById('sidebarToggle'),
        close: document.getElementById('sidebarclose'),
        sidebar: document.getElementById('sidebar'),
        content: document.getElementById('content')
    };

    // Toggle sidebar
    if (sidebarElements.toggle && sidebarElements.sidebar && sidebarElements.content) {
        sidebarElements.toggle.addEventListener('click', (): void => {
            sidebarElements.sidebar?.classList.toggle('collapsed');
            sidebarElements.content?.classList.toggle('expanded');
        });
    }

    // Handle sidebar close button for mobile
    if (sidebarElements.close && sidebarElements.sidebar && sidebarElements.content) {
        sidebarElements.close.addEventListener('click', (): void => {
            sidebarElements.sidebar?.classList.add('collapsed');
            sidebarElements.content?.classList.add('expanded');
        });
    }

    // Make sidebar links active when clicked
    const sidebarLinks = document.querySelectorAll('.sidebar-link') as NodeListOf<HTMLElement>;
    sidebarLinks.forEach((link: HTMLElement): void => {
        link.addEventListener('click', (): void => {
            sidebarLinks.forEach((l: HTMLElement) => l.classList.remove('active'));
            link.classList.add('active');
        });
    });
}

function initCharts(): void {
    // Revenue Chart - Multi-line chart for different revenue streams
    createChart("revenueChart", {
        type: "line",
        data: {
            labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
            datasets: [
                {
                    label: "Revenue3",
                    data: [753, 291, 847, 502, 134, 921, 678, 435, 998, 210, 567, 89],
                    borderColor: "#88B267",
                    backgroundColor: "#EEF3E9",
                    borderWidth: 2,
                    fill: true,
                    tension: 0.4,
                },
                {
                    label: "Revenue2",
                    data: [1523, 1876, 1345, 1789, 1102, 1934, 1428, 1657, 1982, 1275, 1740, 1890],
                    borderColor: "#F39C12",
                    backgroundColor: "#F9F5EE",
                    borderWidth: 2,
                    fill: true,
                    tension: 0.4,
                },
                {
                    label: "Revenue1",
                    data: [2734, 2890, 2456, 2987, 2156, 2765, 2932, 2345, 2876, 2098, 2645, 2990],
                    borderColor: "#65A1CB",
                    backgroundColor: "#E1F0FA",
                    borderWidth: 2,
                    fill: true,
                    tension: 0.4,
                },
            ],
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: { legend: { display: false } },
            scales: {
                y: { beginAtZero: true },
                x: { grid: { display: false } },
            },
        },
    });

    // Age Distribution Chart
    createChart("ageChart", {
        type: "doughnut",
        data: {
            labels: ["18-25", "25-30", "30-40", "40-60", "11-18"],
            datasets: [
                {
                    data: [25, 30, 20, 15, 20],
                    backgroundColor: ["#80BE4D", "#4699D3", "#F2D226", "#BC86E7", "#F2A52B"],
                    borderWidth: 2,
                },
            ],
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            cutout: "15%",
            plugins: { legend: { position: "bottom" } },
        },
    });

    // Gender Distribution Chart
    createChart("genderChart", {
        type: "doughnut",
        data: {
            labels: ["Female", "Male"],
            datasets: [
                {
                    data: [65, 35],
                    backgroundColor: ["#F28D6D", "#A4D4EF"],
                    borderWidth: 0,
                },
            ],
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            cutout: "15%",
            plugins: { legend: { position: "bottom" } },
        },
    });

    // Discount Sales Chart
    createChart("discountChart", {
        type: "line",
        data: {
            labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
            datasets: [
                {
                    label: "Discount Sales",
                    data: [500, 100, 200, 400, 300, 800],
                    borderColor: "#88B267",
                    backgroundColor: "#EEF3E9",
                    borderWidth: 2,
                    fill: true,
                    tension: 0.4,
                },
            ],
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: { legend: { display: false } },
            scales: {
                y: { beginAtZero: true },
                x: { grid: { display: false } },
            },
        },
    });
    
    console.log('📊 Dashboard charts initialized');
}

function createChart(id: string, config: EMSChartConfig): void {
    const ctx = document.getElementById(id) as HTMLCanvasElement | null;
    
    if (!ctx) {
        console.error(`Canvas element with id '${id}' not found`);
        return;
    }

    // Destroy existing chart if it exists
    if (ctx.chart) {
        ctx.chart.destroy();
    }

    // Create new chart with error handling
    try {
        ctx.chart = new Chart(ctx, config);
        console.log(`✅ Chart '${id}' created successfully`);
    } catch (error) {
        console.error(`❌ Failed to create chart '${id}':`, error);
    }
}

function initQuantitySpinner(): void {
    const productQtyElements = document.querySelectorAll('.product-qty') as NodeListOf<HTMLElement>;

    productQtyElements.forEach((productEl: HTMLElement): void => {
        const quantityInput = productEl.querySelector('.quantity') as HTMLInputElement | null;
        const plusButton = productEl.querySelector('.quantity-right-plus') as HTMLElement | null;
        const minusButton = productEl.querySelector('.quantity-left-minus') as HTMLElement | null;

        if (!quantityInput || !plusButton || !minusButton) {
            console.warn('Quantity spinner elements not found for:', productEl);
            return;
        }

        const spinner: QuantitySpinner = {
            container: productEl,
            input: quantityInput,
            plusButton,
            minusButton
        };

        plusButton.addEventListener('click', (e: Event): void => {
            e.preventDefault();
            const quantity = parseInt(spinner.input.value) || 0;
            spinner.input.value = (quantity + 1).toString();
        });

        minusButton.addEventListener('click', (e: Event): void => {
            e.preventDefault();
            const quantity = parseInt(spinner.input.value) || 0;
            if (quantity > 0) {
                spinner.input.value = (quantity - 1).toString();
            }
        });
    });
}

// Export functions for potential external use
export { initCharts, createChart, initSidebar, initQuantitySpinner, initSwiper };