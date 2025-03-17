import { AuthLayout } from "../Layout/layout";

export default function AnalysisDetails() {
    return (
        <AuthLayout>
            <div className="px-6 md:px-12">
                <h1 className="text-2xl font-bold text-[#002072] mb-6">Market Analysis</h1>
                
                <div className="bg-white rounded-lg shadow-md p-6 space-y-8">
                    {/* Indexes Section */}
                    <section>
                        <h2 className="text-xl font-bold text-blue-800 border-b pb-2 mb-4">Indexes</h2>
                        <p className="mb-4 text-gray-700 leading-relaxed">
                            Indexes track the performance of a collection of stocks and serve as a benchmark for overall market performance. Key examples include the S&P 500, Dow Jones Industrial Average (DJIA), and the Nasdaq Composite.
                        </p>
                        
                        <h3 className="text-lg font-semibold mb-2 text-gray-800">Current Trends:</h3>
                        <ul className="list-disc pl-5 space-y-2 mb-4 text-gray-700">
                            <li><span className="font-medium">S&P 500:</span> Generally a reflection of the U.S. economy, it shows fluctuations based on corporate earnings, Federal Reserve policy, and global events. It's in a recovery phase post-pandemic, with some volatility tied to inflation rates and interest rates.</li>
                            <li><span className="font-medium">Nasdaq:</span> Tech-heavy and more volatile. Stocks like Apple, Amazon, and Microsoft lead its performance. Recent tech pullbacks have affected it, though longer-term growth remains positive.</li>
                            <li><span className="font-medium">DJIA:</span> A mix of 30 large, established U.S. companies, typically more stable than the Nasdaq but less diverse.</li>
                        </ul>
                        
                        <h3 className="text-lg font-semibold mb-2 text-gray-800">Key Considerations:</h3>
                        <ul className="list-disc pl-5 space-y-2 text-gray-700">
                            <li>Inflation and interest rates continue to play a central role. If inflation rises or interest rates increase, it can dampen the performance of stocks, especially in tech and growth stocks.</li>
                            <li>Geopolitical risks (such as conflicts or trade disputes) can lead to volatility.</li>
                        </ul>
                    </section>

                    {/* Stocks Section */}
                    <section>
                        <h2 className="text-xl font-bold text-blue-800 border-b pb-2 mb-4">Stocks</h2>
                        <p className="mb-4 text-gray-700 leading-relaxed">
                            Stocks represent ownership in companies. The performance of stocks is linked to company earnings, industry trends, economic health, and investor sentiment.
                        </p>
                        
                        <h3 className="text-lg font-semibold mb-2 text-gray-800">Recent Trends:</h3>
                        <ul className="list-disc pl-5 space-y-2 mb-4 text-gray-700">
                            <li><span className="font-medium">Tech Stocks:</span> Companies like Tesla, Meta, and Nvidia have had growth phases due to innovation, but also corrections due to interest rate hikes and market corrections.</li>
                            <li><span className="font-medium">Energy Stocks:</span> With the push for green energy, companies like ExxonMobil and Chevron have seen strong performances, but fluctuations in oil prices (affected by OPEC decisions and geopolitical factors) are key.</li>
                            <li><span className="font-medium">Consumer Goods:</span> Companies like Coca-Cola and Procter & Gamble are often seen as stable investments, though they may be negatively impacted by inflation.</li>
                        </ul>
                        
                        <h3 className="text-lg font-semibold mb-2 text-gray-800">Key Metrics:</h3>
                        <ul className="list-disc pl-5 space-y-2 text-gray-700">
                            <li><span className="font-medium">Earnings Reports:</span> Stocks generally react to quarterly earnings reports. High earnings growth can push stock prices up.</li>
                            <li><span className="font-medium">P/E Ratios:</span> A high Price-to-Earnings ratio may indicate overvaluation.</li>
                            <li><span className="font-medium">Dividends:</span> Companies that pay reliable dividends tend to attract long-term investors.</li>
                        </ul>
                    </section>

                    {/* Commodities Section */}
                    <section>
                        <h2 className="text-xl font-bold text-blue-800 border-b pb-2 mb-4">Commodities</h2>
                        <p className="mb-4 text-gray-700 leading-relaxed">
                            Commodities are raw materials and primary agricultural products that can be bought and sold, including gold, oil, copper, and agricultural goods like wheat and corn.
                        </p>
                        
                        <h3 className="text-lg font-semibold mb-2 text-gray-800">Recent Trends:</h3>
                        <ul className="list-disc pl-5 space-y-2 mb-4 text-gray-700">
                            <li><span className="font-medium">Gold:</span> Gold often performs well during periods of inflation or economic uncertainty, as it is seen as a safe-haven asset.</li>
                            <li><span className="font-medium">Oil:</span> Fluctuates based on geopolitical tensions, global demand (like China), and OPEC+ decisions. The push towards renewable energy impacts long-term demand for oil.</li>
                            <li><span className="font-medium">Copper:</span> A leading indicator of economic activity, often impacted by industrial demand, especially from China.</li>
                        </ul>
                        
                        <h3 className="text-lg font-semibold mb-2 text-gray-800">Key Considerations:</h3>
                        <ul className="list-disc pl-5 space-y-2 text-gray-700">
                            <li>Commodity prices can be volatile due to supply and demand factors, geopolitical tensions, and economic policies.</li>
                            <li>Futures contracts can offer opportunities for speculators but come with high risk.</li>
                        </ul>
                    </section>

                    {/* Currencies Section */}
                    <section>
                        <h2 className="text-xl font-bold text-blue-800 border-b pb-2 mb-4">Currencies</h2>
                        <p className="mb-4 text-gray-700 leading-relaxed">
                            Currency markets (Forex) are affected by interest rates, economic policies, and international events.
                        </p>
                        
                        <h3 className="text-lg font-semibold mb-2 text-gray-800">Recent Trends:</h3>
                        <ul className="list-disc pl-5 space-y-2 mb-4 text-gray-700">
                            <li><span className="font-medium">US Dollar (USD):</span> The U.S. dollar has often seen strength due to the Federal Reserve's policy on interest rates, but a stronger dollar can harm U.S. exports.</li>
                            <li><span className="font-medium">Euro (EUR):</span> The euro's strength is influenced by the economic health of the EU and geopolitical developments. The European Central Bank's policies also impact its performance.</li>
                            <li><span className="font-medium">Cryptocurrencies:</span> Cryptos are often viewed as alternative stores of value and can be inversely correlated with fiat currencies during times of inflation.</li>
                        </ul>
                        
                        <h3 className="text-lg font-semibold mb-2 text-gray-800">Key Metrics:</h3>
                        <ul className="list-disc pl-5 space-y-2 text-gray-700">
                            <li><span className="font-medium">Interest Rates:</span> Central bank policies (like the U.S. Federal Reserve or ECB) have a direct impact on currency values.</li>
                            <li><span className="font-medium">Inflation:</span> Inflation rates can erode the purchasing power of a currency, leading to volatility.</li>
                        </ul>
                    </section>

                    {/* Crypto Section */}
                    <section>
                        <h2 className="text-xl font-bold text-blue-800 border-b pb-2 mb-4">Crypto</h2>
                        <p className="mb-4 text-gray-700 leading-relaxed">
                            Cryptocurrency markets are highly volatile and driven by investor sentiment, regulatory updates, and technological advancements.
                        </p>
                        
                        <h3 className="text-lg font-semibold mb-2 text-gray-800">Recent Trends:</h3>
                        <ul className="list-disc pl-5 space-y-2 mb-4 text-gray-700">
                            <li><span className="font-medium">Bitcoin:</span> Seen as "digital gold," Bitcoin often reacts to broader market sentiment. Regulatory news, adoption by institutions, and the halving event (occurring approximately every four years) affect Bitcoin's price.</li>
                            <li><span className="font-medium">Ethereum:</span> With its shift to a Proof-of-Stake (PoS) model and its strong position in the decentralized finance (DeFi) ecosystem, Ethereum has long-term growth potential.</li>
                            <li><span className="font-medium">Altcoins:</span> Other cryptocurrencies like Solana, Cardano, and Polkadot also show promise but are more speculative in nature.</li>
                        </ul>
                        
                        <h3 className="text-lg font-semibold mb-2 text-gray-800">Key Considerations:</h3>
                        <ul className="list-disc pl-5 space-y-2 text-gray-700">
                            <li><span className="font-medium">Regulation:</span> Any news of governments moving to regulate or ban cryptocurrencies can lead to sharp price movements.</li>
                            <li><span className="font-medium">Adoption and Technology:</span> The expansion of DeFi, NFTs, and institutional interest can increase demand for cryptos.</li>
                            <li><span className="font-medium">Market Sentiment:</span> Cryptocurrencies are highly sensitive to social media trends and the opinions of prominent figures (like Elon Musk).</li>
                        </ul>
                    </section>

                    {/* Real Estate Section */}
                    <section>
                        <h2 className="text-xl font-bold text-blue-800 border-b pb-2 mb-4">Real Estate</h2>
                        <p className="mb-4 text-gray-700 leading-relaxed">
                            Real estate can include residential, commercial, and industrial properties. The market is highly local, but national and global trends still play a significant role.
                        </p>
                        
                        <h3 className="text-lg font-semibold mb-2 text-gray-800">Recent Trends:</h3>
                        <ul className="list-disc pl-5 space-y-2 mb-4 text-gray-700">
                            <li><span className="font-medium">Residential Real Estate:</span> Housing prices have surged in many parts of the world, driven by low-interest rates (historically) and limited housing supply. However, the market is showing signs of cooling in certain areas due to higher mortgage rates.</li>
                            <li><span className="font-medium">Commercial Real Estate:</span> Office space and retail have been impacted by the COVID-19 pandemic as work-from-home policies have reduced demand for office space.</li>
                            <li><span className="font-medium">REITs:</span> Real estate-focused funds that provide liquidity for investors looking for exposure to property without owning physical assets.</li>
                        </ul>
                        
                        <h3 className="text-lg font-semibold mb-2 text-gray-800">Key Metrics:</h3>
                        <ul className="list-disc pl-5 space-y-2 mb-4 text-gray-700">
                            <li><span className="font-medium">Interest Rates:</span> Mortgage rates heavily influence residential real estate markets, with higher rates slowing down housing demand.</li>
                            <li><span className="font-medium">Cap Rates:</span> The capitalization rate (net income/asset value) helps determine the return on investment in commercial properties.</li>
                        </ul>
                    </section>

                    {/* Summary Section */}
                    <section className="bg-gray-50 p-4 rounded-lg">
                        <h3 className="text-lg font-semibold mb-2 text-blue-800">Summary of Key Influencers Across All Markets</h3>
                        <ul className="list-disc pl-5 space-y-2 text-gray-700">
                            <li><span className="font-medium">Interest Rates & Inflation:</span> These two factors have a direct impact on all asset classes, particularly stocks, real estate, and bonds.</li>
                            <li><span className="font-medium">Geopolitical Events:</span> International conflicts, trade agreements, and political changes can cause significant market movements.</li>
                            <li><span className="font-medium">Technological Advancement:</span> Disruptive technologies can create new market leaders and obsolete traditional business models.</li>
                            <li><span className="font-medium">Market Sentiment:</span> Investor psychology, media coverage, and social trends can drive short-term price action across all markets.</li>
                        </ul>
                    </section>
                </div>
            </div>
        </AuthLayout>
    );
}