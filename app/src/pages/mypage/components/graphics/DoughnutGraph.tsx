import { Chart } from 'chart.js';
import React, { Component, createRef } from 'react';

export interface ChartItem {
  label: string;
  value: number;
  color: string[];
  total:number;
}

export interface DoughnutChartProps {
  data: ChartItem[];
  onFocus: (dataIndex: number) => void;

}

export class DoughnutChart extends Component<DoughnutChartProps> {
  private canvasRef = createRef<HTMLCanvasElement>();
  private chart!: Chart;
  private dataSet: any[];
  private radiusValues: any[];
  private cutoutValues: any[]
  
  render() {
    return <canvas ref={this.canvasRef} />;
  }

  componentWillUnmount() {
    this.chart?.destroy();
  }

  shouldComponentUpdate(nextProps: Readonly<DoughnutChartProps>): boolean {
    return this.props.data !== nextProps.data;
  }

  componentDidMount() {
    this.createChart();
  }

  componentDidUpdate(prevProps: Readonly<DoughnutChartProps>) {
    if (this.props.data !== prevProps.data) {
      if (this.props.data.length > 0) {
        this.chart.data.labels = this.props.data.map(({ label }) => label);
        //@ts-ignore

     this.dataSet = this.props.data.map(({ label, value, color, total }, i) => {
        const radiusValues = ['100%','90%','80%']
        const cutoutValues = ['45','45','45']
        if (i === 0) {
        }
            return {

          data: [value, total],
          backgroundColor: color,
          borderWidth: 0,
          hoverOffset: 3,
          borderRadius:15,
          spacing:0,
          radius: radiusValues[i],
          cutout: cutoutValues[i],
          margin: '5px',
          borderJoinStyle:'round'
          }

        })
        console.log(this.dataSet)
        this.chart.data.datasets = this.dataSet;
      }}

    this.chart.update();
  }

  private createChart = () => {
    this.radiusValues = ['100%','90%','80%']      
    this.cutoutValues = ['45','45','45']

    this.dataSet = []
    console.log(this.dataSet)
    this.chart = new Chart(this.canvasRef.current!, {
      type: 'doughnut',
      options: {
        animation: {animateRotate:false,},
        hover: {mode: null},
        plugins: {
          legend: {
            display: false,
          },
          tooltip: {
            enabled: false,
          },
        },
        onHover: (event, elements) => {
          this.props.onFocus(elements[0]?.index ?? -1);
        },
      },
      data:
           {
              labels: ['blank'],
              datasets: [
                {
                  data: [1],
                  backgroundColor: ['rgba(0,0,0,0.01)'],
                  borderWidth: 0,
                  hoverOffset: 15,
        borderRadius:15,
        spacing:0,
                },
              ],
            },
    });
  };
}
