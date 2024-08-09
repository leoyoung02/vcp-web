import { CommonModule } from "@angular/common";
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ViewChild,
} from "@angular/core";
import { FormsModule } from "@angular/forms";
import {
    ApexAxisChartSeries,
    ApexResponsive,
    ApexChart,
    NgApexchartsModule,
    ChartComponent,
    ApexLegend,
    ApexFill,
    ApexXAxis,
    ApexPlotOptions,
    ApexGrid,
    ApexYAxis,
    ApexDataLabels,
  } from "ng-apexcharts";
import moment from "moment";

export type TimelineOptions = {
    series: ApexAxisChartSeries;
    chart: ApexChart;
    responsive: ApexResponsive[];
    labels: any;
    legend: ApexLegend;
    fill: ApexFill,
    colors: any;
    plotOptions: ApexPlotOptions;
    xaxis: ApexXAxis;
    yaxis: ApexYAxis; 
    grid: ApexGrid;
    dataLabels: ApexDataLabels;
};

@Component({
  selector: "app-astro-ideal-timeline",
  standalone: true,
  imports: [
    CommonModule, 
    FormsModule,
    NgApexchartsModule,
  ],
  templateUrl: "./timeline.component.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TimelineComponent {
    @ViewChild("chart") chart: ChartComponent | undefined;
    public chartOptions: Partial<TimelineOptions> | any;

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
                    data: [
                        {
                            x: "Invoice",
                            y: [
                                new Date("2024-08-05").getTime(),
                                new Date("2024-08-12").getTime(),
                                new Date("2024-08-19").getTime(),
                                new Date("2024-08-26").getTime(),
                            ]
                        }
                    ]
                }
            ],
            chart: {
                type: "rangeBar",
                toolbar: {
                    show: false
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
                enabled: false,
            },
            fill: {
                type: "gradient",
            },
            colors: [
                "#A77FE0"
            ],
            plotOptions: {
                bar: {
                    distributed: true,
                    horizontal: true,
                    height: "20%"
                }
            },
            xaxis: {
                type: "datetime",
                labels: {
                    formatter: function (val: any) {
                        let formatted_date = moment(new Date(val)).format('YYYY-MM-DD');
                        var date = new Date(formatted_date);

                        let adjustedDate = date.getDate()+ date.getDay();
                        let prefixes = ['0', '1', '2', '3', '4', '5'];
                        let week = (parseInt(prefixes[0 | adjustedDate / 7]) + 1);
                        
                        let week_text = "Semana " + week;

                        return week_text;
                    }
                }
            },
            yaxis: {
                show: false,
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
                        show: true
                    }
                },
                yaxis: {
                    lines: {
                        show: false
                    }
                }
            }
        };
        this.cd.detectChanges();
    }
}