import DataTableComponent from "@/components/Ui/DataTable"


function MarketZoneStock() {

    const heading = ["Stock", "Value", "Growth", "Stocks", "Sectors"];
    const data = [
        ["HRL", "940", "10%", "HRL", "TRADING IND"],
        ["MHCL", "861.9", "3%", "MHCL", "HYDRO"],
        ["HRL", "940", "10%", "HRL", "TRADING IND"],
        ["MHCL", "861.9", "3%", "MHCL", "HYDRO"],
        ["HRL", "940", "10%", "HRL", "TRADING IND"],
        ["MHCL", "861.9", "3%", "MHCL", "HYDRO"],
    ]

  return (
    <>
        <h2 className="text-gray-200 border-b border-gray-900">Stocks</h2>
        <DataTableComponent heading={heading} data={data} />
    </>
  )
}

export default MarketZoneStock