import { CommonModule } from "@angular/common";
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Input,
  ViewChild,
} from "@angular/core";
import { FormsModule } from "@angular/forms";
import {
    NgApexchartsModule,
    ChartComponent,
    ApexAxisChartSeries,
    ApexChart,
    ApexXAxis,
    ApexDataLabels,
    ApexTitleSubtitle,
    ApexStroke,
    ApexGrid,
    ApexFill,
    ApexMarkers,
    ApexYAxis,
    ApexResponsive,
    ApexLegend
  } from "ng-apexcharts";

export type LineChartOptions = {
    series: ApexAxisChartSeries;
    chart: ApexChart;
    xaxis: ApexXAxis;
    dataLabels: ApexDataLabels;
    grid: ApexGrid;
    fill: ApexFill;
    markers: ApexMarkers;
    yaxis: ApexYAxis;
    stroke: ApexStroke;
    title: ApexTitleSubtitle;
    responsive: ApexResponsive;
    legend: ApexLegend;
    colors: any;
};

@Component({
  selector: "app-astro-ideal-line-chart",
  standalone: true,
  imports: [
    CommonModule, 
    FormsModule,
    NgApexchartsModule,
  ],
  templateUrl: "./line-chart.component.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LineChartComponent {
    @Input() labels: any;
    @Input() data: any;
    
    @ViewChild("chart") chart: ChartComponent | undefined;
    public chartOptions: Partial<LineChartOptions> | any;

    constructor(private cd: ChangeDetectorRef) { }

    ngOnInit() {
        setTimeout(() => {
            this.generateChart();
        }, 500);
    }

    generateChart() {
        this.chartOptions = {
            series: [
                {
                    name: 'Invoice',
                    data: this.data
                }
            ],
            chart: {
                height: 90,
                type: "line",
                toolbar: {
                    show: false
                }
            },
            stroke: {
                width: 10,
                curve: "smooth"
            },
            labels: this.labels,
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
                gradient: {
                    shade: "dark",
                    gradientToColors: ["#A77FE0"],
                    shadeIntensity: 1,
                    type: "horizontal",
                    opacityFrom: 1,
                    opacityTo: 1,
                    stops: [0, 100, 100, 100]
                }
            },
            plotOptions: {
                bar: {
                    distributed: true,
                    horizontal: true
                }
            },
            xaxis: {
                type: "category",
                categories: this.labels
            },
            yaxis: {
                show: false,
                min: 0,
                forceNiceScale: true,
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
                padding: {
                    left: 40,
                    right: 40
                },
            },
            colors: ["#A77FE0"]
        };
        this.cd.detectChanges();
    }
}