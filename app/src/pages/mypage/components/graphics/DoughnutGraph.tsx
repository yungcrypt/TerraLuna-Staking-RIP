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
        const radiusValues = ['95%','90%','85%','80%']
        const cutoutValues = ['40','40','40','40']
            return {

          data: [value, total],
          backgroundColor: color,
          borderWidth: 0,
          hoverOffset: 3,
          borderRadius:15,
          spacing:0,
          radius: radiusValues[i],
          cutout: cutoutValues[i],
          margin: '5px'
          }

        })
        console.log(this.dataSet)
        this.chart.data.datasets = this.dataSet;
      } else {
        this.chart.data.labels = ['blank'];
        this.chart.data.datasets[0].data = [1];
        this.chart.data.datasets[0].backgroundColor = ['#c2c2c2'];
      }
    }

    this.chart.update();
  }

  private createChart = () => {
    this.radiusValues = ['95%','95%','95%','95%']      
    this.cutoutValues = ['20','20','20','20']

    this.dataSet = []
    this.props.data.length > 0
    ? this.props.data.map(({ label, value, color, total }, i) => {
            return this.dataSet.push({

          data: [value, total],
          backgroundColor: color,
          borderWidth: 0,
          hoverOffset: 1,
          borderRadius:15,
          spacing:0,
          radius: this.radiusValues[i],
          cutout: this.cutoutValues[i],


                    })}) : console.log('noData')
    console.log(this.dataSet)
    this.chart = new Chart(this.canvasRef.current!, {
      type: 'doughnut',
      options: {
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
        this.props.data.length > 0
          ? {
              labels: this.props.data.map(({ label }) => label),
              datasets: this.dataSet,
            }
          : {
              labels: ['blank'],
              datasets: [
                {
                  data: [1],
                  backgroundColor: ['#c2c2c2'],
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
