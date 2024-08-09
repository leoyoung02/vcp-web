import { CommonModule } from "@angular/common";
import {
  ChangeDetectionStrategy,
  Component,
  ViewChild,
} from "@angular/core";
import { FormsModule } from "@angular/forms";
import {
    ApexNonAxisChartSeries,
    ApexResponsive,
    ApexChart,
    NgApexchartsModule,
    ChartComponent,
    ApexLegend,
    ApexDataLabels,
    ApexFill,
  } from "ng-apexcharts";

export type PieChartOptions = {
    series: ApexNonAxisChartSeries;
    chart: ApexChart;
    responsive: ApexResponsive[];
    labels: any;
    legend: ApexLegend;
    dataLabels: ApexDataLabels;
    fill: ApexFill,
    colors: any;
};

@Component({
  selector: "app-astro-ideal-pie-chart",
  standalone: true,
  imports: [
    CommonModule, 
    FormsModule,
    NgApexchartsModule,
  ],
  templateUrl: "./pie-chart.component.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PieChartComponent {
    @ViewChild("chart") chart: ChartComponent | undefined;
    public chartOptions: Partial<PieChartOptions> | any;

    constructor() { }

    ngOnInit() {
        setTimeout(() => {
            this.generateChart();
        }, 500);
    }

    generateChart() {
        console.log('generateChart', this.chartOptions)
        this.chartOptions = {
            series: [16.6, 16.6, 16.6, 16.6, 16.6, 16.6],
            chart: {
                type: "pie"
            },
            labels: ["Contacto", "Dinero", "Relaciones", "Cuerpo", "Energía", "Espiritualidad"],
            responsive: [
              {
                breakpoint: 480,
                options: {
                    chart: {
                        width: 200
                    },
                    legend: {
                        position: "bottom"
                    }
                }
              }
            ],
            legend: {
                show: false
            },
            dataLabels: {
                enabled: true,
                formatter(value: any, opts: any): any {
                    var label = opts.w.globals.labels[opts.seriesIndex];
                    var val = parseFloat(value).toFixed(1) + "%";
                    return [label, val];
                //   return (
                //     opts.w.config.labels[opts.seriesIndex] +
                //     " \n(" +
                //     parseFloat(value).toFixed(1) +
                //     "%) "
                //   );
                },
            },
            fill: {
                type: "gradient",
                // gradient: {
                //     shadeIntensity: 1,
                //     opacityFrom: 0,
                //     opacityTo: 1,
                //     stops: [0, 90, 100]
                // }
            },
            colors: [
                "#7F35E8",
                "#767AF6",
                "#2E3191",
                "#D3145A",
                "#AE6CC6",
                "#C6A2F8"
            ],
        };
    }
}