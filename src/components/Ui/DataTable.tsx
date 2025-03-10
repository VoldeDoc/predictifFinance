import DataTable from "datatables.net-react";
import DT from "datatables.net-dt";
import "datatables.net-select-dt";
import "datatables.net-responsive-dt";
import "@/styles/datatable.css";

DataTable.use(DT);

interface DataTableProps {
  heading?: string[];
  data: string[][];
}

function DataTableComponent({ heading, data }: DataTableProps) {
  return (
    <DataTable
      data={data}
      className="text-gray-200"
      options={{
        responsive: true,
        select: true,
      }}
    >
      <thead>
        <tr className="text-gray-700">
          {heading?.map((head, index) => (
            <th key={index}>{head}</th>
          ))}
        </tr>
      </thead>
    </DataTable>
  );
}

export default DataTableComponent;
