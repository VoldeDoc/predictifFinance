import { BsFacebook, BsInstagram, BsLink, BsTwitterX } from "react-icons/bs";
import { AuthLayout } from "../Layout/layout";
import { useEffect } from "react";

export default function MarketNewsDetails() {
    // This function implements smooth scrolling for anchor links
    useEffect(() => {
        // Function to handle smooth scrolling when an anchor link is clicked
        const handleAnchorClick = (e: any) => {
            // Make sure it's an anchor link to a section on the same page
            const href = e.currentTarget.getAttribute('href');
            if (href && href.startsWith('#')) {
                e.preventDefault();

                // Get the target element
                const targetId = href.substring(1);
                const targetElement = document.getElementById(targetId);

                if (targetElement) {
                    // Scroll smoothly to the element
                    targetElement.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });

                    // Update URL without reloading the page (optional)
                    history.pushState(null, '', href);
                }
            }
        };

        // Add the event listener to all table of contents links
        const tocLinks = document.querySelectorAll('.toc-link');
        tocLinks.forEach(link => {
            link.addEventListener('click', handleAnchorClick);
        });

        // Clean up event listeners when component unmounts
        return () => {
            tocLinks.forEach(link => {
                link.removeEventListener('click', handleAnchorClick);
            });
        };
    }, []);

    return (
        <>
            <AuthLayout>
                <div className="px-8 sm:px-16">
                    <div className="sm:text-center">
                        <h3 className="text-[#002072]">The Future of Cryptocurrency Investments</h3>
                        <p className="sm:px-6">An exploration of how index funds have become a dominant investment choice for both novice and experienced investors due to their simplicity, lower costs, and competitive returns.</p>
                        <div className="flex flex-col items-center justify-center space-y-4 my-4 sm:flex-row sm:space-y-0 sm:space-x-6">
                            <div className="flex items-center">
                                <img src="https://via.placeholder.com/40" alt="John Doe" className="rounded-full h-10 w-10 mr-2" />
                                <p><span className="font-bold">John Doe</span></p>
                            </div>
                            <div className="flex items-center">
                                <h6 className="text-gray-600">Cryptocurrency</h6>
                            </div>
                            <div className="flex items-center">
                                <h6 className="text-gray-600">September 14, 2027</h6>
                            </div>
                        </div>
                    </div>
                    <div className="flex justify-center my-6">
                        <img src="https://images.unsplash.com/photo-1621416894569-0f39ed31d247?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80" alt="Cryptocurrency concept" className="rounded-lg object-contain w-full max-w-3xl h-auto" />
                    </div>
                    <div className="flex flex-col md:flex-row gap-5">
                        <div className="w-full md:w-[70%]">
                            <div id="introduction">
                                <p className="mb-4 text-sm">Unlike actively managed funds that attempt to beat the market by selecting a variety of stocks, index funds follow a passive investment strategy. They simply track a predefined basket of stocks that represent a particular market index, such as the S&P 500 or the NASDAQ. This method offers several inherent advantages:</p>
                            </div>

                            <div id="appeal">
                                <h3 className="text-xl font-bold mb-3 text-[#002072]">The Appeal of Index Funds</h3>
                                <ul className="list-disc pl-5 space-y-2 mb-6">
                                    <li className="text-sm">
                                        <span className="font-bold">Low cost:</span>
                                        <span className="ml-1">Index funds typically have lower expense ratios than actively managed funds because they require less management effort. The reduced cost is a critical factor that directly improves investor returns over time.</span>
                                    </li>
                                    <li className="text-sm">
                                        <span className="font-bold">Transparency:</span>
                                        <span className="ml-1">Investors know exactly which assets are held by an index fund, providing greater transparency compared to the often opaque strategies employed by active fund managers.</span>
                                    </li>
                                    <li className="text-sm">
                                        <span className="font-bold">Tax Efficiency:</span>
                                        <span className="ml-1">By trading less frequently, index funds generate fewer capital gains distributions, which can be advantageous from a tax perspective.</span>
                                    </li>
                                </ul>
                            </div>

                            <div id="performance">
                                <h3 className="text-xl font-bold mb-3 text-[#002072]">Performance Over Time</h3>
                                <p className="mb-4">Numerous studies have shown that index funds consistently outperform a large portion of actively managed funds over long periods. According to the S&P Indices Versus Active (SPIVA) reports, over the last 15 years, more than 80% of active fund managers have failed to beat their respective benchmarks. This has progressively driven investors toward the more predictable performance of index funds.</p>
                            </div>

                            <div id="investor-behavior">
                                <h3 className="text-xl font-bold mb-3 text-[#002072]">Investor Behavior and Market Trends</h3>
                                <p className="mb-4">The rise of index funds also reflects a broader shift in investor behavior, where there is an increasing preference for investment options that are easy to understand and manage. This trend is coupled with the growing availability of financial information and online trading platforms that encourage a more hands-off approach to investing.</p>
                            </div>

                            <div id="conclusion">
                                <h4 className="text-lg font-bold mb-3 text-[#002072]">Conclusion</h4>
                                <p className="mb-4">As the investment landscape continues to evolve, index funds are likely to remain a popular choice for both retail and institutional investors. Their simplicity, low cost, and consistent performance make them an attractive option for those looking to build a diversified portfolio with minimal effort.</p>
                            </div>
                        </div>
                        <div className="w-full md:w-[25%]">
                            <div className="bg-gray-100 p-4 rounded-lg sticky top-4">
                                <h5 className="font-semibold mb-3">Table of Contents</h5>
                                <ul className="space-y-2">
                                    <li><a href="#introduction" className="text-gray-700 hover:text-[#002072] transition-colors toc-link">Introduction</a></li>
                                    <li><a href="#appeal" className="text-gray-700 hover:text-[#002072] transition-colors toc-link">The Appeal of Index Funds</a></li>
                                    <li><a href="#performance" className="text-gray-700 hover:text-[#002072] transition-colors toc-link">Performance Over Time</a></li>
                                    <li><a href="#investor-behavior" className="text-gray-700 hover:text-[#002072] transition-colors toc-link">Investor Behavior and Market Trends</a></li>
                                    <li><a href="#conclusion" className="text-gray-700 hover:text-[#002072] transition-colors toc-link">Conclusion</a></li>
                                </ul>
                                <div className="my-10">
                                <h5>Share</h5>
                                <div className="flex space-x-4 mt-2">
                                    <button className="bg-blue-200 hover:bg-blue-300 text-black-400 font-bold py-2 px-2 rounded-lg"><BsTwitterX /></button>
                                    <button className="bg-blue-200 hover:bg-blue-300 text-black-400 font-bold py-2 px-2 rounded-lg"><BsFacebook /></button>
                                    <button className="bg-blue-200 hover:bg-blue-300 text-black-400 font-bold py-2 px-2 rounded-lg"><BsInstagram /></button>
                                    <button className="bg-blue-200 hover:bg-blue-300 text-black-400 font-bold py-2 px-2 rounded-lg"><BsLink /></button>

                                </div>
                            </div>
                            </div>
                           
                        </div>
                    </div>
                </div>
            </AuthLayout>
        </>
    );
}