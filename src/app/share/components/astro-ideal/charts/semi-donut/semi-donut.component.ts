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
    ApexPlotOptions,
    ApexGrid,
    ApexLegend,
    ApexFill,
    ApexDataLabels,
  } from "ng-apexcharts";

export type SemiDonutChartOptions = {
    series: ApexNonAxisChartSeries;
    chart: ApexChart;
    responsive: ApexResponsive[];
    plotOptions: ApexPlotOptions;
    grid: ApexGrid;
    legend: ApexLegend;
    dataLabels: ApexDataLabels;
    fill: ApexFill,
    colors: any;
};

@Component({
  selector: "app-astro-ideal-semi-donut",
  standalone: true,
  imports: [
    CommonModule, 
    FormsModule,
    NgApexchartsModule,
  ],
  templateUrl: "./semi-donut.component.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SemiDonutComponent {
    @ViewChild("chart") chart: ChartComponent | undefined;
    public chartOptions: Partial<SemiDonutChartOptions> | any;

    constructor() { }

    ngOnInit() {
        setTimeout(() => {
            this.generateChart();
        }, 500);
    }

    generateChart() {
        console.log('generateChart', this.chartOptions)
        this.chartOptions = {
            series: [56, 44],
            labels: ["Julio 30"],
            chart: {
                type: "donut"
            },
            plotOptions: {
                pie: {
                    startAngle: -90,
                    endAngle: 90,
                    offsetY: 10
                }
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
                    if(opts && opts.seriesIndex == 0) {
                        console.log('opts', opts)
                        return parseFloat(value).toFixed(1) + "%";
                    }
                },
            },
            fill: {
                type: "gradient",
            },
            colors: [
                "#A77FE0",
                "#D9D9D9"
            ],
        };
    }
}