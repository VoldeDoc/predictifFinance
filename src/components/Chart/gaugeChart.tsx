import { Gauge } from '@mui/x-charts/Gauge';
export default function GaugeCharts(){
    return(
        <>
         <div className="transaction  bg-white px-2 py-2 flex w-72 ">
                    <div>
                        <Gauge width={100} height={100} value={70} valueMin={10} valueMax={100} />
                    </div>
                    <div>
                        <h2>Total Number of Transactions</h2>


                    </div>
                </div>
        </>
    )
}