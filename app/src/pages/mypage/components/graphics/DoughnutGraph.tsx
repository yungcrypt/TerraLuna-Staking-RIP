import { Chart } from 'chart.js';
import React, { Component, createRef } from 'react';

export interface ChartItem {
  label: string;
  value: number;
  color: string;
}

export interface DoughnutChartProps {
  data: ChartItem[];
  onFocus: (dataIndex: number) => void;

}

export class DoughnutChart extends Component<DoughnutChartProps> {
  private canvasRef = createRef<HTMLCanvasElement>();
  private chart!: Chart;

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
  /*  if (this.props.data !== prevProps.data) {
      if (this.props.data.length > 0) {
        this.chart.data.labels = this.props.data.map(({ label }) => label);
        this.chart.data.datasets[0].data = this.props.data.map(
          ({ value }) => value,
        );
        this.chart.data.datasets[0].backgroundColor = this.props.data.map(
          ({ color }) => color,
        );
      } else {
        this.chart.data.labels = ['blank'];
        this.chart.data.datasets[0].data = [1];
        this.chart.data.datasets[0].backgroundColor = ['#c2c2c2'];
      }
    }

    this.chart.update();
 */ }

  private createChart = () => {
    this.chart = new Chart(this.canvasRef.current!, {
      type: 'doughnut',
      options: {
        cutout: '75%',
        radius: '97%',
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
              datasets: [
                {
                  data: this.props.data.map(({ value }, i: number) => {
                    if (i === 0) {
                        return value
                    }
                    if (i === 4) {
                        return value
                    }
                    return 
                  }),
                  backgroundColor: [(this.props.data[0].color), 'green'],
                  borderWidth: 0,
                  hoverOffset: 7,
                  borderRadius:15,
                  spacing:0,
                },
                {
                  data: this.props.data.map(({ value }, i: number) => {
                    if (i === 1) {
                        console.log(value)
                        return value
                    }
                    if (i === 4) {
                        console.log(value)
                        return value
                    }
                    return 
                  }),
                  backgroundColor: ['black','white'],
                  borderWidth: 0,
                  hoverOffset: 7,
                  borderRadius:15,
                  spacing:0,
                  
                },
                {
                  data: this.props.data.map(({ value }, i: number) => {
                    if (i === 2) {
                        return value
                    }
                    if (i === 4) {
                        return value
                    }
                    return 
                  }),
                  backgroundColor: ['black','white'],
                  borderWidth: 0,
                  hoverOffset: 7,
                  borderRadius:15,
                  spacing:0,
                  
                },
                {
                  data: this.props.data.map(({ value }, i: number) => {
                    if (i === 3) {
                        return value
                    }
                    if (i === 4) {
                        return value
                    }

                    return
                  }),
                  backgroundColor: ['black','white'],
                  borderWidth: 0,
                  hoverOffset: 7,
                  borderRadius:15,
                  spacing:0,
                  
                },
              ],
            }
          : {
              labels: ['blank'],
              datasets: [
                {
                  data: [1],
                  backgroundColor: ['#c2c2c2'],
                  borderWidth: 0,
                  hoverOffset: 7,
        borderRadius:15,
        spacing:-50,
                },
              ],
            },
    });
  };
}
