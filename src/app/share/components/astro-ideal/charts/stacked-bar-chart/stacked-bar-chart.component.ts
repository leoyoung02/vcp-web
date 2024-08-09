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
    ApexChart,
    NgApexchartsModule,
    ChartComponent,
    ApexDataLabels,
    ApexXAxis,
    ApexPlotOptions,
    ApexStroke,
    ApexTitleSubtitle,
    ApexYAxis,
    ApexTooltip,
    ApexFill,
    ApexLegend
  } from "ng-apexcharts";

export type StackedBarChartOptions = {
    series: ApexAxisChartSeries;
    chart: ApexChart;
    dataLabels: ApexDataLabels;
    plotOptions: ApexPlotOptions;
    xaxis: ApexXAxis;
    yaxis: ApexYAxis;
    stroke: ApexStroke;
    title: ApexTitleSubtitle;
    tooltip: ApexTooltip;
    fill: ApexFill;
    legend: ApexLegend;
    colors: any;
};

@Component({
  selector: "app-astro-ideal-stacked-bar-chart",
  standalone: true,
  imports: [
    CommonModule, 
    FormsModule,
    NgApexchartsModule,
  ],
  templateUrl: "./stacked-bar-chart.component.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StackedBarChartComponent {
    @ViewChild("chart") chart: ChartComponent | undefined;
    public chartOptions: Partial<StackedBarChartOptions> | any;

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
                    name: 'Invoice 1',
                    data: [44]
                },
                {
                    name: 'Invoice 2',
                    data: [55]
                }
            ],
            chart: {
                type: "bar",
                stacked: true,
            },
            plotOptions: {
                bar: {
                    horizontal: true
                }
            },
            stroke: {
                width: 0,
                colors: ["transparent"]
            },
            xaxis: {
                categories: ['August'],
                labels: {
                    formatter: function(val) {
                        return val;
                    }
                }
            },
            yaxis: {
                title: {
                    text: undefined
                }
            },
            tooltip: {
                y: {
                    formatter: function(val) {
                        return val;
                    }
                }
            },
            fill: {
                opacity: 1
            },
            legend: {
               show: false
            },
            dataLabels: {
                enabled: false,
            },
            colors: [
                "#8352C8",
                "#8352C8",
            ],
        };
        this.cd.detectChanges();
    }
}