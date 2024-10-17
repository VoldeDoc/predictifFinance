import Chart from "react-apexcharts";
import { ApexOptions } from "apexcharts";

const PastResultChat = ({ height = 120 }) => {
  // const series = [
  //   {
  //     name: "Total Match",
  //     data: [50, 50, 20, 60, 30, 58, 10],
  //   },
  // ];
  const series = [
    {
      name: "Marine Sprite",
      data: [44],
    },
    {
      name: "Striking Calf",
      data: [53],
    },
    {
      name: "Tank Picture",
      data: [12],
    },
    {
      name: "Bucket Slope",
      data: [9],
    },
    {
      name: "Reborn Kid",
      data: [25],
    },
  ];
  const options: ApexOptions = {
    chart: {
      stacked: true,
      stackType: "100%",
      toolbar: {
        show: false,
      },
    },
    plotOptions: {
      bar: {
        horizontal: true, // Horizontal bars
        columnWidth: "80%", // Width of the bars
      },
    },
    legend: {
      show: true,
      position: "bottom",
      horizontalAlign: "center",
      fontSize: "15px",
 
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
      width: 1,
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

      labels: {
        show: false,
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
    colors: [
      "#7B61FF",
      "#FFB836",
      "#34D399",
      "#F472B6",
      "#F59E0B",
      "#3B82F6",
      "#22C55E",
    ],
    grid: {
      show: true,
      borderColor: "#E2E8F0",
      strokeDashArray: 3,
      position: "back",
      padding: {
        bottom: 0,
      },
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

export default PastResultChat;
