import { useEffect, useState } from "react";
import MonthYearSelect from "../components/MonthYearSelect";
import { getTransactionsMonthly, getTransactionsSummary } from "../services/transactionService";
import type { MonthlyItem, TransactionSummary } from "../types/transactions";
import Card from "../components/Card";
import { ArrowUp, Calendar, TrendingUp, Wallet } from "lucide-react";
import { formatCurrency } from "../utils/formatter";
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip, BarChart, CartesianGrid, XAxis, YAxis, Bar, Legend } from "recharts";

const initialSummary: TransactionSummary = {
    balance: 0,
    totalExpenses: 0,
    totalIncomes: 0,
    expensesByCategory: [],
};

interface ChartLabelProps {
    name: string;
    percent: number;
}

const Dashboard = () => {
    const currentDate = new Date();
    const [year, setYear] = useState<number>(currentDate.getFullYear());
    const [month, setMonth] = useState(currentDate.getMonth() + 1);
    const [summary, setSummary] = useState<TransactionSummary>(initialSummary);
    const [monthlyItemsData, setMonthlyItemsData] = useState<MonthlyItem[]>([]);

    useEffect(() => {
        async function loadTransactionSummary() {
            const response = await getTransactionsSummary(month, year);
            setSummary(response);
        }

        loadTransactionSummary();
    }, [month, year]);

    useEffect(() => {
async function loadTransactionsMonthly() {
    console.log("Buscando histórico para:", month, year); // ← adiciona isso
    const response = await getTransactionsMonthly(month, year);
    console.log("Resposta:", response);
    setMonthlyItemsData(response.history);
}

        loadTransactionsMonthly();
    }, [month, year]);

    const renderPieChartLabel = ({ name, percent }: ChartLabelProps): string => {
        return `${name}: ${(percent * 100).toFixed(1)}%`;
    };

    const formatToolTipValue = (value: number | string): string => {
        return formatCurrency(typeof value === "number" ? value : 0)
    }

    console.log(monthlyItemsData);

    return (
        <div className="container-app py-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
                <h1 className="text-2xl font-bold mb-4 md:mb-0">
                    Dashboard
                </h1>

                <MonthYearSelect
                    month={month}
                    year={year}
                    onMonthChange={setMonth}
                    onYearChange={setYear}
                />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

                <Card
                    icon={<Wallet size={20} className="text-primary-500" />}
                    title="Saldo"
                    hover
                    glowEffect={summary.balance > 0}
                >
                    <p className={`text-2xl font-semibold mt-2 ${summary.balance > 0 ? "text-primary-500" : "text-red-300"
                        }`}>
                        {formatCurrency(summary.balance)}
                    </p>
                </Card>

                <Card
                    icon={<ArrowUp size={20} className="text-primary-500" />}
                    title="Receitas"
                    hover
                >
                    <p className="text-2xl font-semibold mt-2 text-primary-500">
                        {formatCurrency(summary.totalIncomes)}
                    </p>
                </Card>

                <Card
                    icon={<Wallet size={20} className="text-red-600" />}
                    title="Despesas"
                    hover
                >
                    <p className="text-2xl font-semibold mt-2 text-red-600">
                        {formatCurrency(summary.totalExpenses)}
                    </p>
                </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6 mt-3">
                <Card
                    icon={<TrendingUp size={20} className="text-primary-500" />}
                    title="Despesas por Categoria"
                    className="min-h-80"
                >
                    {summary.expensesByCategory.length > 0 ? (
                        <div className="h-72 mt-4">
                            <ResponsiveContainer width="100%" height={300}>
                                <PieChart>
                                    <Pie
                                        data={summary.expensesByCategory}
                                        cx="50%"
                                        cy="50%"
                                        outerRadius={80}
                                        dataKey="totalAmount"
                                        nameKey="categoryName"
                                        label={renderPieChartLabel}
                                    >
                                        {summary.expensesByCategory.map((entry) => (
                                            <Cell
                                                key={entry.categoryId}
                                                fill={entry.categoryColor}
                                            />
                                        ))}
                                    </Pie>
                                    <Tooltip formatter={formatToolTipValue} />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                    ) : (
                        <div className="flex items-center justify-center h-64 text-gray-500">
                            <p>Nenhuma despesa registrada nesse período!</p>
                        </div>

                    )}
                </Card>
                <Card icon={<Calendar size={20} className="text-primary-500" />}
                    title="Histórico Mensal"
                    className="min-h-80 p-2.5"
                >
                    <div className="h-72 mt-4">
                        {monthlyItemsData.length > 0 ? (

                            <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={monthlyItemsData} margin={{ left: 40}}>
                                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.1)"/>
                                <XAxis dataKey="name" stroke="#94a3bb" tick={{style: {textTransform: 'capitalize'}}}/>
                                <YAxis width={80} stroke="#94a3bb" tickFormatter={formatCurrency} tick={{style: {fontSize: "14px"}}} />
                                <Tooltip formatter={formatCurrency} 
                                contentStyle={{
                                    backgroundColor: '#1a1a1a',
                                    borderColor: '#2a2a2a'
                                }}
                                labelStyle={{color: '#f8f8f8'}}
                                />
                                <Legend />
                                <Bar dataKey="expenses" fill="#ff6384" name="Despesas" />
                                <Bar dataKey="income" fill="#37e359" name="Receitas" />    
                            </BarChart>
                            </ResponsiveContainer>
                        ) : (
                            <div className="flex items-center justify-center h-64 text-gray-500">
                                <p>Nenhum histórico registrado nesse período!</p>
                            </div>
                        )}
                    </div>

                </Card>
            </div>
        </div>
    );
};

export default Dashboard;