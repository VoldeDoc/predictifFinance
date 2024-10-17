import Chart from "react-apexcharts";

import { ApexOptions } from "apexcharts";

const StackBarChart = ({ height = 410 }) => {
  const series = [
    {
      name: "Total Match",
      data: [50, 50, 20, 60, 30, 58, 10],
    },
    {
      name: "Strategies",
      data: [50, 10, 40, 20, 50, 105, 50],
    },
  ];
  const options: ApexOptions = {
    chart: {
      stacked: true,
      toolbar: {
        show: false,
      },
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: "80%",
      },
    },
    legend: {
      show: true,
      position: "bottom",
      horizontalAlign: "center",
      fontSize: "12px",
      fontFamily: "Inter",
      offsetY: 0,
      markers: {
        // width: 6,
        // height: 6,
        offsetY: 0,
        offsetX: -5,
        // radius: 12,
      },
      itemMargin: {
        horizontal: 18,
        vertical: 0,
      },
      labels: {
        colors: "#475569",
      },
    },

    dataLabels: {
      enabled: false,
    },
    stroke: {
      show: true,
      width: 2,
      colors: ["transparent"],
    },

    yaxis: {
      show: false,
      min: 0, // Set minimum value
      max: 100, // Set maximum value
      labels: {
        style: {
          colors: "#475569",
          fontFamily: "Inter",
        },
      },
    },

    xaxis: {
      categories: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
      labels: {
        offsetY: -3,
        style: {
          colors: "#475569",
          fontFamily: "Inter",
        },
      },
      axisBorder: {
        show: false,
      },
      axisTicks: {
        show: false,
      },
    },

    fill: {
      opacity: 1,
    },
    tooltip: {
      y: {
        formatter: function (val) {
          return "$ " + val + " Predict";
        },
      },
    },
    colors: ["#7B61FF", "#FFB836"],
    grid: {
      show: true,
      borderColor: "#E2E8F0",
      strokeDashArray: 3,
      position: "back",
    },
  };
  return (
    <>
      <Chart
        options={options}
        series={series}
        type="bar"
        height={height}
        width={"100%"}
      />
    </>
  );
};

export default StackBarChart;
