import React, { useState, useEffect, useMemo, useCallback } from "react";
import DynamicBackground from "@/components/DynamicBackground";
import StarfieldOverlay from "@/components/StarfieldOverlay";
import LoadingSpinner from "@/components/LoadingSpinner";
import AnimatedNumber from "@/components/AnimatedNumber";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { DatePicker } from "@/components/ui/datepicker";
import { Switch } from "@/components/ui/switch";
import { Download } from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import Heatmap from "@/components/Heatmap";
import { exportToCSV } from "@/utils/export";
import DatabaseViewer from "@/components/DatabaseViewer";
import LogsViewer from "@/components/LogsViewer";

const API_BASE_PAPER =
  process.env.NEXT_PUBLIC_API_BASE_PAPER ||
  process.env.NEXT_PUBLIC_API_BASE ||
  "";
const API_BASE_LIVE = process.env.NEXT_PUBLIC_API_BASE_LIVE || API_BASE_PAPER;

export default function PortfolioAllocationDashboard() {
  const [activeTab, setActiveTab] = useState<
    "allocation" | "account" | "returns" | "database" | "logs"
  >("allocation");
  const [themeDark, setThemeDark] = useState(false);
  const [liveTrading, setLiveTrading] = useState(false);
  // Date range for historical charts
  const [dateRange, setDateRange] = useState<[Date, Date]>([
    new Date(Date.now() - 30 * 24 * 3600 * 1000),
    new Date(),
  ]);

  // Core data
  const [assets, setAssets] = useState<string[]>([]);
  const [filter, setFilter] = useState("");
  const [selectedAssets, setSelectedAssets] = useState<string[]>([]);
  const [allocations, setAllocations] = useState<
    { asset: string; weight: number }[]
  >([]);
  const [efficientFrontier, setEfficientFrontier] = useState<
    { risk: number; return: number }[]
  >([]);
  const [accountMetrics, setAccountMetrics] = useState<
    { name: string; value: number }[]
  >([]);
  const [portfolioReturns, setPortfolioReturns] = useState<
    { strategy: string; returns: number[] }[]
  >([]);
  const [correlations, setCorrelations] = useState<number[][]>([]); // correlation matrix
  const [varData, setVarData] = useState<{ date: string; var: number }[]>([]);

  const [errors, setErrors] = useState<Record<string, string | null>>({
    assets: null,
    frontier: null,
    optimize: null,
    account: null,
    returns: null,
    corr: null,
    var: null,
  });
  const [loading, setLoading] = useState(false);

  const safeJson = async (res: Response, endpoint: string) => {
    if (res.status === 404) throw new Error(`Endpoint not found: ${endpoint}`);
    if (!res.ok) throw new Error(`Error ${res.status}: ${res.statusText}`);
    const ct = res.headers.get("content-type") || "";
    if (!ct.includes("application/json"))
      throw new Error(`Unexpected content-type: ${ct}`);
    return res.json();
  };

  const fetchData = useCallback(
    async (endpoint: string, key: string, setter: any) => {
      try {
        const apiBase = liveTrading ? API_BASE_LIVE : API_BASE_PAPER;
        const url = `${apiBase}${endpoint}`;
        const res = await fetch(url);
        const data = await safeJson(res, endpoint);
        setter(data);
        setErrors((prev) => ({ ...prev, [key]: null }));
      } catch (e: any) {
        console.error(e);
        setErrors((prev) => ({ ...prev, [key]: e.message }));
      }
    },
    [liveTrading],
  );

  useEffect(() => {
    fetchData("/api/assets", "assets", setAssets);
    fetchData("/api/efficient_frontier", "frontier", setEfficientFrontier);
  }, [fetchData]);
  useEffect(() => {
    if (!selectedAssets.length) return;
    setLoading(true);
    fetchData("/api/optimize", "optimize", setAllocations).finally(() =>
      setLoading(false),
    );
  }, [selectedAssets, fetchData]);
  useEffect(() => {
    if (activeTab === "account")
      fetchData("/api/account_metrics", "account", setAccountMetrics);
  }, [activeTab, fetchData]);
  useEffect(() => {
    if (activeTab === "returns")
      fetchData("/api/portfolio_returns", "returns", setPortfolioReturns);
    fetchData("/api/correlations", "corr", setCorrelations);
    fetchData(
      `/api/var?start=${dateRange[0].toISOString()}&end=${dateRange[1].toISOString()}`,
      "var",
      setVarData,
    );
  }, [activeTab, dateRange, fetchData]);

  const filteredAssets = useMemo(
    () => assets.filter((a) => a.toLowerCase().includes(filter.toLowerCase())),
    [assets, filter],
  );
  const errorMessages = useMemo(
    () => Object.values(errors).filter(Boolean) as string[],
    [errors],
  );

  return (
    <div
      className={
        themeDark
          ? "min-h-screen bg-gray-900 text-white"
          : "min-h-screen bg-gray-100 text-gray-900"
      }
    >
      <DynamicBackground />
      <StarfieldOverlay />
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/40">
          <LoadingSpinner />
        </div>
      )}
      <header className="p-6 flex justify-between items-center">
        <h1 className="text-3xl font-bold">QuantBroker Dashboard</h1>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-1">
            <span className="text-sm">Paper</span>
            <Switch checked={liveTrading} onCheckedChange={setLiveTrading} />
            <span className="text-sm">Live</span>
          </div>
          <Switch checked={themeDark} onCheckedChange={setThemeDark} />
          <Button
            variant="outline"
            size="sm"
            onClick={() => exportToCSV(allocations, "allocations.csv")}
          >
            <Download className="mr-2" />
            Export Allocations
          </Button>
        </div>
      </header>
      {errorMessages.length > 0 && (
        <div className="mx-6 my-4 space-y-2">
          {errorMessages.map((msg, i) => (
            <div
              key={i}
              className="rounded-md bg-red-600/80 p-2 text-sm text-white"
            >
              {msg}
            </div>
          ))}
        </div>
      )}

      <Card className="mx-6 rounded-2xl shadow-xl p-4 bg-white/60 dark:bg-gray-800/60 backdrop-blur-md">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
          <TabsList className="bg-white dark:bg-gray-800 rounded-full p-1">
            <TabsTrigger value="allocation" className="w-1/5">
              Allocation
            </TabsTrigger>
            <TabsTrigger value="account" className="w-1/5">
              Account
            </TabsTrigger>
            <TabsTrigger value="returns" className="w-1/5">
              Returns
            </TabsTrigger>
            <TabsTrigger value="database" className="w-1/5">
              Database
            </TabsTrigger>
            <TabsTrigger value="logs" className="w-1/5">
              Logs
            </TabsTrigger>
          </TabsList>

          <TabsContent value="allocation">
            {/* Asset allocation, efficient frontier, VaR chart, correlation heatmap */}
            <div className="grid grid-cols-12 gap-6">
              <aside className="col-span-3 bg-white dark:bg-gray-800 rounded-lg shadow p-4">
                <Input
                  placeholder="Search assets"
                  value={filter}
                  onChange={(e) => setFilter(e.target.value)}
                  className="mb-3"
                />
                <div className="max-h-60 overflow-auto">
                  {filteredAssets.map((a) => (
                    <div key={a} className="flex justify-between py-1 border-b">
                      <span>{a}</span>
                      <Button
                        size="xs"
                        onClick={() =>
                          setSelectedAssets((prev) =>
                            prev.includes(a)
                              ? prev.filter((x) => x !== a)
                              : [...prev, a],
                          )
                        }
                      >
                        {selectedAssets.includes(a) ? "−" : "+"}
                      </Button>
                    </div>
                  ))}
                </div>
              </aside>
              <main className="col-span-9 space-y-6">
                <div className="grid grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>Efficient Frontier</CardHeader>
                    <CardContent>
                      <ResponsiveContainer width="100%" height={200}>
                        <LineChart data={efficientFrontier}>
                          <defs>
                            <linearGradient
                              id="frontierGradient"
                              x1="0"
                              y1="0"
                              x2="0"
                              y2="1"
                            >
                              <stop
                                offset="5%"
                                stopColor="#2563eb"
                                stopOpacity={0.8}
                              />
                              <stop
                                offset="95%"
                                stopColor="#2563eb"
                                stopOpacity={0}
                              />
                            </linearGradient>
                          </defs>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="risk" />
                          <YAxis dataKey="return" />
                          <Tooltip />
                          <Line
                            type="monotone"
                            dataKey="return"
                            stroke="#2563eb"
                            fill="url(#frontierGradient)"
                          />
                        </LineChart>
                      </ResponsiveContainer>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader>Value at Risk</CardHeader>
                    <CardContent>
                      <ResponsiveContainer width="100%" height={200}>
                        <LineChart data={varData}>
                          <defs>
                            <linearGradient
                              id="varGradient"
                              x1="0"
                              y1="0"
                              x2="0"
                              y2="1"
                            >
                              <stop
                                offset="5%"
                                stopColor="#dc2626"
                                stopOpacity={0.8}
                              />
                              <stop
                                offset="95%"
                                stopColor="#dc2626"
                                stopOpacity={0}
                              />
                            </linearGradient>
                          </defs>
                          <XAxis dataKey="date" />
                          <YAxis />
                          <Tooltip />
                          <Line
                            type="monotone"
                            dataKey="var"
                            stroke="#dc2626"
                            fill="url(#varGradient)"
                          />
                        </LineChart>
                      </ResponsiveContainer>
                    </CardContent>
                  </Card>
                </div>
                <Card>
                  <CardHeader>Correlations</CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={200}>
                      <Heatmap data={correlations} />
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              </main>
            </div>
          </TabsContent>

          <TabsContent value="account">
            <div className="grid grid-cols-4 gap-6">
              {accountMetrics.map((m) => (
                <Card
                  key={m.name}
                  className="transition-transform hover:scale-105 hover:shadow-xl"
                >
                  <CardHeader>{m.name}</CardHeader>
                  <CardContent>
                    <AnimatedNumber value={m.value} />
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="returns">
            <div className="flex items-center mb-4 space-x-4">
              <DatePicker value={dateRange} onChange={setDateRange} />
            </div>
            {portfolioReturns.map(({ strategy, returns }) => (
              <Card key={strategy} className="mb-6">
                <CardHeader>{strategy}</CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={200}>
                    <LineChart data={returns.map((v, i) => ({ x: i, y: v }))}>
                      <defs>
                        <linearGradient
                          id="returnGradient"
                          x1="0"
                          y1="0"
                          x2="0"
                          y2="1"
                        >
                          <stop
                            offset="5%"
                            stopColor="#10b981"
                            stopOpacity={0.8}
                          />
                          <stop
                            offset="95%"
                            stopColor="#10b981"
                            stopOpacity={0}
                          />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="x" />
                      <YAxis />
                      <Tooltip />
                      <Line
                        type="monotone"
                        dataKey="y"
                        stroke="#10b981"
                        dot={false}
                        fill="url(#returnGradient)"
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          <TabsContent value="database">
            <DatabaseViewer
              apiBase={liveTrading ? API_BASE_LIVE : API_BASE_PAPER}
            />
          </TabsContent>
          <TabsContent value="logs">
            <LogsViewer
              apiBase={liveTrading ? API_BASE_LIVE : API_BASE_PAPER}
            />
          </TabsContent>
        </Tabs>
      </Card>
    </div>
  );
}

/* Backend additions:
 - /api/var?start=&end=: returns historical VaR data
 - /api/correlations: returns correlation matrix
 - /api/assets, /api/efficient_frontier, /api/optimize, /api/account_metrics, /api/portfolio_returns remain
 - Add endpoints for CSV export if needed, or handle client-side
 - Ensure authentication & streaming support for real-time updates
 */
