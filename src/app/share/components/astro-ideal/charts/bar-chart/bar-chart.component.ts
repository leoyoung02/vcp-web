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
    ApexXAxis,
    ApexPlotOptions,
    ApexGrid,
  } from "ng-apexcharts";

export type BarChartOptions = {
    series: ApexNonAxisChartSeries;
    chart: ApexChart;
    responsive: ApexResponsive[];
    labels: any;
    legend: ApexLegend;
    dataLabels: ApexDataLabels;
    fill: ApexFill,
    colors: any;
    plotOptions: ApexPlotOptions;
    xaxis: ApexXAxis;
    grid: ApexGrid,
};

@Component({
  selector: "app-astro-ideal-bar-chart",
  standalone: true,
  imports: [
    CommonModule, 
    FormsModule,
    NgApexchartsModule,
  ],
  templateUrl: "./bar-chart.component.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BarChartComponent {
    @ViewChild("chart") chart: ChartComponent | undefined;
    public chartOptions: Partial<BarChartOptions> | any;

    constructor() { }

    ngOnInit() {
        setTimeout(() => {
            this.generateChart();
        }, 500);
    }

    generateChart() {
        console.log('generateChart', this.chartOptions)
        this.chartOptions = {
            series: [
                {
                    name: '#',
                    data: [540, 470, 448, 430, 400]
                }
            ],
            chart: {
                type: "bar",
                toolbar: {
                    show: false
                }
            },
            labels: ["Evento 1", "Evento 2", "Evento 3", "Evento 4", "Evento 5"],
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
                enabled: false,
            },
            fill: {
                type: "gradient",
            },
            colors: [
                "#8352C8",
                "#A77FE0",
                "#B59ED5",
                "#D5BCF7",
                "#E3DCEE"
            ],
            plotOptions: {
                bar: {
                    distributed: true,
                    horizontal: true
                }
            },
            xaxis: {
                axisBorder: {
                    show: false
                },
                axisTicks: {
                    show: false
                },
                labels: {
                    show: false
                }
            },
            grid: {
                show: false,
                xaxis: {
                    lines: {
                        show: false
                    }
                },   
                yaxis: {
                    lines: {
                        show: false
                    }
                },
            }
        };
    }
}