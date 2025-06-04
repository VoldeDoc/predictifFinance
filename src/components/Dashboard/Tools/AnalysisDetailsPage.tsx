import { useState, useEffect } from "react";
import { AuthLayout } from "@/components/Layout/layout";
import { useSearchParams } from "react-router-dom";
import { StockAreaChart } from "@/components/Chart/StockAreaChart";
import UseFinanceHook from "@/hooks/UseFinance";

interface MetaInfo {
    Symbol: string;
    AssetType: string;
    Name: string;
    Description: string;
    Sector: string;
    Industry: string;
    MarketCapitalization: string;
    PERatio: string;
    EPS: string;
    DividendYield: string;
    [key: string]: any;
}

export default function AnalysisDetailsPage1() {
    const [searchParams] = useSearchParams();
    const symbol = searchParams.get("symbol") || "";

    const { getChartData, getStockMeta } = UseFinanceHook();
    const [chartData, setChartData] = useState<{ x: number; y: number }[]>([]);
    const [metaInfo, setMetaInfo] = useState<MetaInfo | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!symbol) {
            setError("No stock symbol provided.");
            return;
        }
        const fetchAll = async () => {
            setLoading(true);
            setError(null);

            try {
                // 1) historical data
                const historical = await getChartData(symbol, "D");
                setChartData(historical);

                // 2) overview
                const overview = await getStockMeta(symbol);
                console.log("raw overview response:", overview);
                if (overview && typeof overview === "object" && "Note" in overview) {
                    setMetaInfo(null);
                    setError((overview as any).Note as string);
                }
                // Otherwise, check for a valid "Symbol" field:
                else if (overview && (overview as any).Symbol) {
                    setMetaInfo(overview as MetaInfo);
                } else {
                    setMetaInfo(null);
                    setError("No overview information found for this symbol.");
                }
            } catch (e: any) {
                console.error("Error fetching stock details:", e);
                setError("Failed to load stock details.");
            } finally {
                setLoading(false);
            }
        };
        fetchAll();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [symbol]);


    if (loading) {
        return (
            <AuthLayout>
                <div className="p-6 text-center">
                    <p className="text-gray-600">
                        Loading details for “{symbol}”…
                    </p>
                </div>
            </AuthLayout>
        );
    }

    if (error) {
        return (
            <AuthLayout>
                <div className="p-6 text-center text-red-600">
                    <p>{error}</p>
                </div>
            </AuthLayout>
        );
    }

    if (!metaInfo) {
        return (
            <AuthLayout>
                <div className="p-6 text-center text-gray-600">
                    <p>No data available for “{symbol}”.</p>
                </div>
            </AuthLayout>
        );
    }

    return (
        <AuthLayout>
            <div className="px-6 md:px-12 py-8">
                <h1 className="text-2xl font-bold text-[#002072] mb-6">
                    Market Analysis: {metaInfo.Name} ({metaInfo.Symbol})
                </h1>

                <div className="bg-white rounded-lg shadow-md p-6 space-y-8">

                    {/* Profile Section */}
                    <section>
                        <h2 className="text-xl font-bold text-blue-800 border-b pb-2 mb-4">
                            Profile
                        </h2>
                        <p className="mb-4 text-gray-700 leading-relaxed">
                            <strong>Description:</strong> {metaInfo.Description}
                        </p>
                        <div className="grid grid-cols-2 gap-4 text-gray-700">
                            <div>
                                <h3 className="font-semibold">Sector</h3>
                                <p>{metaInfo.Sector}</p>
                            </div>
                            <div>
                                <h3 className="font-semibold">Industry</h3>
                                <p>{metaInfo.Industry}</p>
                            </div>
                            <div>
                                <h3 className="font-semibold">Asset Type</h3>
                                <p>{metaInfo.AssetType}</p>
                            </div>
                        </div>
                    </section>

                    {/* Market Data Section */}
                    <section>
                        <h2 className="text-xl font-bold text-blue-800 border-b pb-2 mb-4">
                            Market Data
                        </h2>
                        <div className="grid grid-cols-2 gap-4 text-gray-700">
                            <div>
                                <h3 className="font-semibold">Market Capitalization</h3>
                                <p>
                                    ${Number(metaInfo.MarketCapitalization).toLocaleString()}
                                </p>
                            </div>
                            <div>
                                <h3 className="font-semibold">P/E Ratio</h3>
                                <p>{metaInfo.PERatio}</p>
                            </div>
                            <div>
                                <h3 className="font-semibold">EPS</h3>
                                <p>{metaInfo.EPS}</p>
                            </div>
                            <div>
                                <h3 className="font-semibold">Dividend Yield</h3>
                                <p>{metaInfo.DividendYield || "N/A"}</p>
                            </div>
                        </div>
                    </section>

                    {/* Historical Prices Section */}
                    <section>
                        <h2 className="text-xl font-bold text-blue-800 border-b pb-2 mb-4">
                            Historical Prices (Last 100 Days)
                        </h2>
                        <div className="w-full h-80">
                            <StockAreaChart
                                data={[{ name: symbol, data: chartData }]}
                                color="#3B82F6"
                                height="100%"
                            />
                        </div>
                    </section>
                </div>
            </div>
        </AuthLayout>
    );
}
