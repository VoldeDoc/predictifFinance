import { useState, useEffect } from 'react';
import UseFinanceHook from '@/hooks/UseFinance';
import { ChevronDownIcon } from '@heroicons/react/24/outline';

// Define expense category type
interface Category {
  name: string;
  amount: number;
  color: string;
  percentage: number;
}

// Extended type for internal calculations
interface CategoryWithAngles extends Category {
  startAngle: number;
  endAngle: number;
}

interface PieChartProps {
  // expenseData?: Category[];
  // incomeData?: Category[];
}

const MONTHS = [
  "January","February","March","April","May","June",
  "July","August","September","October","November","December"
];

export default function PieChart(_: PieChartProps) {
  const {
    getExpenseCategories,
    getIncomeCategories,
    getBudgetPeriods,
    createBudgetItem,
  } = UseFinanceHook();

  const [periods, setPeriods] = useState<
    { id: string; label: string; startDate: string; endDate: string }[]
  >([]);
  const [selectedMonth, setSelectedMonth] = useState("June");
  const [activeTab, setActiveTab] = useState<"expense" | "income">("expense");
  const [expenseData, setExpenseData] = useState<Category[]>([]);
  const [incomeData, setIncomeData] = useState<Category[]>([]);

  const [showModal, setShowModal] = useState(false);
  const [formCategory, setFormCategory] = useState('');
  const [formItem, setFormItem] = useState('');
  const [formAmount, setFormAmount] = useState('');
  const [formDate, setFormDate] = useState('');
  const [saveloading, setSaveloading] = useState(false);
  const [categoriesList, setCategoriesList] = useState<string[]>([]);

  useEffect(() => {
    // load categories & periods
    (async () => {
      const [rawExp, rawInc, rawPeriods] = await Promise.all([
        getExpenseCategories(),
        getIncomeCategories(),
        getBudgetPeriods(),
      ]);
      setPeriods(
        rawPeriods.map((p) => ({
          id: p.id,
          label: p.label,
          startDate: p.startDate!,
          endDate: p.endDate!,
        }))
      );
      buildChart(rawExp, setExpenseData);
      buildChart(rawInc, setIncomeData);
    })();
  }, []);

  function buildChart(
    raw: { category: string; total_amount: number }[],
    set: React.Dispatch<React.SetStateAction<Category[]>>
  ) {
    const total = raw.reduce((sum, x) => sum + x.total_amount, 0);
    const colors = activeTab === "expense"
      ? ["#ECF4E9", "#E5E6E6", "#002072", "#BCBEBD", "#4FB7EF"]
      : ["#ECF4E9", "#002072", "#4FB7EF", "#BCBEBD"];

    set(
      raw.map((x, i) => ({
        name: x.category,
        amount: x.total_amount,
        color: colors[i % colors.length],
        percentage: total ? Math.round((x.total_amount / total) * 100) : 0,
      }))
    );
  }

  const data = activeTab === "expense" ? expenseData : incomeData;
  const totalAmount = data.reduce((sum, d) => sum + d.amount, 0);

  // pick current
  const currentPlan = periods.find((p) =>
    p.label.toLowerCase().includes(selectedMonth.toLowerCase())
  );
  const planId = currentPlan?.id;
  // const totalAmount = currentData.reduce((sum, d) => sum + d.amount, 0);

  // angles
  const dataWithAngles: CategoryWithAngles[] = data.map((item, idx) => {
    const prevAngle = data
      .slice(0, idx)
      .reduce((sum, e) => sum + e.percentage * 3.6, 0);
    return {
      ...item,
      startAngle: prevAngle,
      endAngle: prevAngle + item.percentage * 3.6,
    };
  });

  const generatePieSegment = (start: number, end: number, r: number, ir: number) => {
    const spacing = 2;
    const a1 = (start + spacing / 2 - 90) * Math.PI / 180;
    const a2 = (end - spacing / 2 - 90) * Math.PI / 180;
    const x1 = r * Math.cos(a1), y1 = r * Math.sin(a1);
    const x2 = r * Math.cos(a2), y2 = r * Math.sin(a2);
    const x3 = ir * Math.cos(a2), y3 = ir * Math.sin(a2);
    const x4 = ir * Math.cos(a1), y4 = ir * Math.sin(a1);
    const large = end - start > 180 ? 1 : 0;
    return `M ${x1} ${y1} A ${r} ${r} 0 ${large} 1 ${x2} ${y2} L ${x3} ${y3} A ${ir} ${ir} 0 ${large} 0 ${x4} ${y4} Z`;
  };

  // const months = [
  //   'January', 'February', 'March', 'April', 'May', 'June',
  //   'July', 'August', 'September', 'October', 'November', 'December'
  // ];

  const openForm = async () => {
    setShowModal(true);

    const cats = activeTab === 'expense'
      ? ['feeding', 'rent', 'entertainment', 'education', 'other']
      : ['salary', 'investment', 'allowance', 'gift', 'other'];
    setCategoriesList(cats);
    setFormCategory(cats[0]);

  };

  // const submitForm = async () => {
  //   const payload = {
  //     category: formCategory,
  //     item: formItem,
  //     amount: formAmount,
  //     date: formDate,
  //   };
  //   try {
  //     if (activeTab === 'expense') {
  //       await addExpense(payload);
  //     } else {
  //       await addIncome(payload);
  //     }
  //     setShowModal(false);
  //     // reload chart data
  //     // you can simply re-run the useEffect by toggling activeTab
  //     setActiveTab(activeTab === 'expense' ? 'income' : 'expense');
  //     setActiveTab(activeTab);
  //   } catch (err) {
  //     console.error(err);
  //   }
  // };

  const handleSave = async () => {
    if (!planId) {
      return alert("No budget period found for " + selectedMonth);
    }
    setSaveloading(true);
    await createBudgetItem({
      plan_id: planId,
      category: formCategory,
      item: formItem,
      amount: formAmount,
      date: formDate,
      source: activeTab,
    });
    setShowModal(false);
    setSaveloading(false);

    // re-fetch categories for just that source
    const fresh = activeTab === "expense"
      ? await getExpenseCategories()
      : await getIncomeCategories();
    buildChart(fresh, activeTab === "expense" ? setExpenseData : setIncomeData);
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-sm mt-6">
      {/* Header with tabs and filter */}
      <div className="flex flex-col mb-4">
        <div className="flex justify-between items-center mb-3">
          <h2 className="text-lg font-semibold">Statistics</h2>

          <div className="relative">
            <select
              className="bg-gray-50 border px-2 py-1 rounded"
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
            >
              {MONTHS.map((m) => (
                <option key={m} value={m}>
                  {m}
                </option>
              ))}
            </select>
            <ChevronDownIcon className="absolute right-2 top-2 h-4 w-4 text-gray-500" />
          </div>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-200">
          <button
            className={`py-2 px-4 font-medium text-sm ${activeTab === 'expense'
              ? 'border-b-2 border-blue-500 text-blue-600'
              : 'text-gray-500'
              }`}
            onClick={() => setActiveTab('expense')}
          >
            Expense
          </button>
          <button
            className={`py-2 px-4 font-medium text-sm ${activeTab === 'income'
              ? 'border-b-2 border-blue-500 text-blue-600'
              : 'text-gray-500'
              }`}
            onClick={() => setActiveTab('income')}
          >
            Income
          </button>
        </div>
      </div>

      <div className="flex flex-col items-center">
        {/* Pie chart */}
        <div className="relative w-56 h-56 mb-8">
          {/* Center circle with total */}
          <div className="absolute inset-0 flex flex-col items-center justify-center z-10 rounded-full bg-white w-28 h-28 m-auto">
            <p className="text-sm text-gray-500">Total {activeTab === 'expense' ? 'Expense' : 'Income'}</p>
            <p className="font-bold text-lg">${totalAmount.toLocaleString()}</p>
          </div>

          {/* SVG for pie chart with increased spacing between segments */}
          <svg viewBox="-100 -100 200 200" className="w-full h-full">
            {dataWithAngles.map(d => (
              <path
                key={d.name}
                d={generatePieSegment(d.startAngle, d.endAngle, 90, 40)}
                fill={d.color}
                stroke="#fff"
                strokeWidth="2"
              />
            ))}
          </svg>
        </div>

        {/* Legend */}
        <div className="w-full space-y-4">
          {dataWithAngles.map(d => (
            <div key={d.name} className="flex items-center justify-between">
              <div className="flex items-center">
                <div
                  className="w-8 h-8 rounded-md flex items-center justify-center text-xs font-medium mr-3"
                  style={{ backgroundColor: d.color }}
                >
                  {d.percentage}%
                </div>
                <span className="text-sm font-medium capitalize">{d.name}</span>
              </div>
              <span className="text-sm font-semibold">
                ${d.amount.toLocaleString()}
              </span>
            </div>
          ))}
          <button
            onClick={openForm}
            className="px-3 py-1 bg-indigo-600 text-white rounded"
          >
            Add {activeTab === 'expense' ? 'Expense' : 'Income'}
          </button>
        </div>
      </div>
      {/* modal */}
      {showModal && (
        <div className="fixed z-[100] inset-0 bg-[rgb(0,0,0,0.3)] bg-opacity-30 flex items-center justify-center">
          <div className="bg-white p-6 rounded shadow-lg w-80">
            <h3 className="font-semibold mb-4">
              Add {activeTab === 'expense' ? 'Expense' : 'Income'}
            </h3>

            <label className="block mb-2 text-sm">Category</label>
            <select
              className="w-full mb-4 p-2 border rounded capitalize"
              value={formCategory}
              onChange={(e) => setFormCategory(e.target.value)}
            >
              {(activeTab === "expense"
                ? ["feeding", "rent", "entertainment", "education", "other"]
                : ["salary", "investment", "allowance", "gift", "other"]
              ).map((c) => (
                <option className="!capitalize" key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>

            <label className="block mb-2 text-sm">Item</label>
            <input
              value={formItem}
              onChange={e => setFormItem(e.target.value)}
              className="w-full mb-4 p-2 border rounded"
            />

            <label className="block mb-2 text-sm">Amount</label>
            <input
              type="number"
              value={formAmount}
              onChange={e => setFormAmount(e.target.value)}
              className="w-full mb-4 p-2 border rounded"
            />

            <label className="block mb-2 text-sm">Date</label>
            <input
              type="date"
              value={formDate}
              onChange={e => setFormDate(e.target.value)}
              className="w-full mb-4 p-2 border rounded"
            />

            <div className="flex justify-end space-x-2">
              <button
                onClick={() => setShowModal(false)}
                className="px-3 py-1 border rounded"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="px-3 py-1 bg-blue-600 text-white rounded"
              >
                {saveloading ? 'Saving...' : 'Save'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}