// Global type definitions for EMS Frontend
import { Chart as ChartJS } from 'chart.js';

declare global {
  interface Window {
    Chart: typeof ChartJS;
  }

  // Extend HTMLElement for custom properties
  interface HTMLCanvasElement {
    chart?: ChartJS;
  }
}

// Chart configuration types
export interface ChartConfig {
  type: 'line' | 'doughnut' | 'bar' | 'pie';
  data: {
    labels: string[];
    datasets: ChartDataset[];
  };
  options?: ChartOptions;
}

export interface ChartDataset {
  label?: string;
  data: number[];
  borderColor?: string | string[];
  backgroundColor?: string | string[];
  borderWidth?: number;
  fill?: boolean;
  tension?: number;
}

export interface ChartOptions {
  responsive?: boolean;
  maintainAspectRatio?: boolean;
  plugins?: {
    legend?: {
      display?: boolean;
      position?: 'top' | 'bottom' | 'left' | 'right';
    };
  };
  scales?: {
    y?: {
      beginAtZero?: boolean;
    };
    x?: {
      grid?: {
        display?: boolean;
      };
    };
  };
  cutout?: string;
}

// Application types
export interface SensorData {
  id: string;
  type: 'ph' | 'moisture' | 'water-pump' | 'feeder-pump';
  value: number;
  timestamp: string;
  status: 'active' | 'inactive' | 'warning';
}

export interface DashboardStats {
  totalSensors: number;
  activeSensors: number;
  alerts: number;
  systemStatus: 'online' | 'offline' | 'maintenance';
}

// UI Component types
export interface SidebarElement {
  toggle: HTMLElement | null;
  close: HTMLElement | null;
  sidebar: HTMLElement | null;
  content: HTMLElement | null;
}

export interface QuantitySpinner {
  container: HTMLElement;
  input: HTMLInputElement;
  plusButton: HTMLElement;
  minusButton: HTMLElement;
}

export {};