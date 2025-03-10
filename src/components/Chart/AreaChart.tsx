import Chart from "react-apexcharts";
import { ApexOptions } from "apexcharts";

function generateChart(color: string | string[]): ApexOptions {
  return {
    chart: {
      toolbar: {
        show: true, // Hide the toolbar
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
    legend: {
      show: true,
      position: "bottom",
      horizontalAlign: "center",
      fontSize: "14px",
      fontFamily: "Inter",
      offsetY: 0,
      markers: {
        offsetY: 0,
        offsetX: -5,
      },
      itemMargin: {
        horizontal: 18,
        vertical: 0,
      },
      labels: {
        colors: "#475569",
      },
    },
    stroke: {
      curve: "straight",
    },
    xaxis: {
      categories: ["10 am", "11 am", "12 pm", "1 pm", "2 pm", "3 pm", "4 pm"],
      //   min: 0,
      //   max: 3,
      labels: {
        offsetY: 5,
        style: {
          colors: "#838383",
          fontFamily: "Everett",
          fontWeight: 600,
          fontSize: "17px",
        },
      },
      axisBorder: {
        show: false,
      },
      axisTicks: {
        show: false,
      },
    },
    yaxis: {
      show: true,
      labels: {
        style: {
          colors: "#838383",
          fontFamily: "Everett",
          fontWeight: 600,
          fontSize: "17px",
        },
      },
    },
    grid: {
      show: true,
      borderColor: "#e2e8e0",
      strokeDashArray: 3,
      position: "back",
      xaxis: {
        lines: {
          show: true,
        },
      },
      yaxis: {
        lines: {
          show: true,
        },
      },
    },
    tooltip: {
      enabled: true,
    },
  };
}

interface LineChartProps {
  data: {
    name: string;
    data: number[];
  }[];
  color?: string | string[];
  height?: string | number;
  width?: string | number;
}

const AreaChart = ({
  data,
  color = "#af8fff",
  height = "100%",
  width = "100%",
}: LineChartProps) => {
  const chartOptions = generateChart(color);
  return (
    <Chart
      options={chartOptions}
      series={data}
      type="area"
      width={width}
      height={height}
    />
  );
};

export default AreaChart;
