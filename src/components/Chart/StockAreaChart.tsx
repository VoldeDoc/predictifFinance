import Chart from "react-apexcharts";
import { ApexOptions } from "apexcharts";

function generateChart(color: string | string[]): ApexOptions {
  return {
    chart: {
      toolbar: {
        show: false, // Hide the toolbar
      },
    },
    colors: Array.isArray(color) ? color : [color], // Set the color of the chart
    fill: {
      type: "gradient",
      gradient: {
        shadeIntensity: 1,
        opacityFrom: 0.7,
        opacityTo: 0.2,
        stops: [0, 90, 100],
      },
    },
    dataLabels: {
      enabled: false, // Disable data labels on the chart
    },
    stroke: {
      curve: "straight", // Smooth curved line
    },
    xaxis: {
      labels: {
        show: false, // Hide X-axis labels
      },
      axisBorder: {
        show: false, // Hide X-axis border
      },
    },
    yaxis: {
      show: false, // Hide Y-axis labels
    },
    grid: {
      show: false, // Hide gridlines
    },
    tooltip: {
      y: {
        formatter: function (val) {
          return `$ ${val}`;
        },
      },
    },
  };
}

interface StockChartProps {
  data: {
    name: string;
    data: number[];
  }[];
  color?: string | string[];
  height?: string;
}

export const StockAreaChart = ({
  data,
  color = "#77b900",
  height,
}: StockChartProps) => {
  const chartOptions = generateChart(color);
  return (
    <Chart
      options={chartOptions}
      series={data}
      type="area"
      width="100%"
      height={height ?? "100%"}
    />
  );
};
