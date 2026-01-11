// Chart.js type definitions for EMS Frontend
// Extends the global Chart.js types for our specific use case

declare module 'chart.js' {
  interface Chart {
    destroy(): void;
  }
}

// Global Chart.js declaration
declare global {
  const Chart: {
    new (ctx: HTMLCanvasElement, config: any): {
      destroy(): void;
      update(): void;
      render(): void;
    };
    register(...components: any[]): void;
  };
}

// Additional Chart.js related types for EMS
export interface EMSChartConfig {
  type: 'line' | 'doughnut' | 'bar' | 'pie';
  data: {
    labels: string[];
    datasets: EMSChartDataset[];
  };
  options?: EMSChartOptions;
}

export interface EMSChartDataset {
  label?: string;
  data: number[];
  borderColor?: string | string[];
  backgroundColor?: string | string[];
  borderWidth?: number;
  fill?: boolean;
  tension?: number;
}

export interface EMSChartOptions {
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

export {};