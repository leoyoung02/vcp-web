import { CommonModule } from "@angular/common";
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
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
    ApexFill,
    ApexDataLabels,
  } from "ng-apexcharts";

export type DonutChartOptions = {
    series: ApexNonAxisChartSeries;
    chart: ApexChart;
    responsive: ApexResponsive[];
    legend: ApexLegend;
    dataLabels: ApexDataLabels;
    fill: ApexFill,
    colors: any;
};

@Component({
  selector: "app-astro-ideal-donut",
  standalone: true,
  imports: [
    CommonModule, 
    FormsModule,
    NgApexchartsModule,
  ],
  templateUrl: "./donut.component.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DonutComponent {
    @ViewChild("chart") chart: ChartComponent | undefined;
    public chartOptions: Partial<DonutChartOptions> | any;

    constructor(private cd: ChangeDetectorRef) { }

    ngOnInit() {
        setTimeout(() => {
            this.generateChart();
        }, 500);
    }

    generateChart() {
        console.log('generateChart', this.chartOptions)
        this.chartOptions = {
            series: [44, 55, 41, 17, 15],
            labels: ["Nombre servicio", "Nombre servicio", "Nombre servicio", "Nombre servicio", "Nombre servicio"],
            chart: {
                type: "donut"
            },
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
                    return [val, label];
                },
            },
            fill: {
                type: "gradient",
            },
            colors: [
                "#A77FE0",
                "#3D107D",
                "#8039E5",
                "#D8C5F2",
                "#543E91"
            ],
        };
        this.cd.detectChanges();
    }
}