'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Bar, BarChart, Line, LineChart, ResponsiveContainer, XAxis, YAxis } from "recharts"
import { ChartConfig, ChartContainer, ChartTooltip } from "@/components/ui/chart"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Package, FileText, HandCoins, ShoppingCart } from "lucide-react"
import { Button } from "@/components/ui/button"

interface MetricsData {
  totalSpend: number;
  purchaseRequestCount: number;
  officeQuotationsCount: number;
  supplierQuotationsCount: number;
  spendingData: any[];
}

interface SpendingDataPoint {
  month: string;
  shopping: number;
  smallValue: number;
  competitiveBidding: number;
}

const chartConfig: ChartConfig = {
  shopping: {
    label: "Shopping",
    color: "hsl(var(--primary))",
  },
  smallValue: {
    label: "Small Value",
    color: "hsl(var(--danger))",
  },
  competitiveBidding: {
    label: "Competitive Bidding",
    color: "hsl(var(--success))",
  },
}

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-PH', {
    style: 'currency',
    currency: 'PHP',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(amount);
}

export default function AccountantDashboard() {
  const [period, setPeriod] = useState("thisMonth")
  const [metrics, setMetrics] = useState<MetricsData | null>(null)
  const [spendingData, setSpendingData] = useState<SpendingDataPoint[]>([])

  useEffect(() => {
    async function fetchMetrics() {
      try {
        const response = await fetch('/api/key-metrics/officer-metrics')
        const data = await response.json()
        setMetrics(data)

        // Process spending data
        const processedData = processSpendingData(data.spendingData)
        setSpendingData(processedData)
      } catch (error) {
        console.error('Failed to fetch metrics:', error)
      }
    }

    fetchMetrics()
  }, [])

  function processSpendingData(rawData: any[]) {
    const monthlyData: Record<string, SpendingDataPoint> = {}
    
    rawData.forEach((item) => {
      const date = new Date(item.date)
      const month = date.toLocaleString('default', { month: 'short' })
      
      if (!monthlyData[month]) {
        monthlyData[month] = {
          month,
          shopping: 0,
          smallValue: 0,
          competitiveBidding: 0,
        }
      }

      const amount = Number(item._sum.overallTotal)

      switch (item.procurementMode.toLowerCase()) {
        case 'shopping':
          monthlyData[month].shopping = Number(amount.toFixed(2))
          break
        case 'small value':
          monthlyData[month].smallValue = Number(amount.toFixed(2))
          break
        case 'competitive bidding':
          monthlyData[month].competitiveBidding = Number(amount.toFixed(2))
          break
      }
    })

    return Object.values(monthlyData)
  }

  return (
    <div className="min-h-screen p-8 bg-background">
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Procurement Dashboard</h1>
          <p className="text-muted-foreground">Monitor and manage your procurement activities</p>
        </div>
        <div className="flex items-center gap-4">
          <Select value={period} onValueChange={setPeriod}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select period" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="today">Today</SelectItem>
              <SelectItem value="thisWeek">This Week</SelectItem>
              <SelectItem value="thisMonth">This Month</SelectItem>
              <SelectItem value="thisYear">This Year</SelectItem>
            </SelectContent>
          </Select>
          <Button>Generate Report</Button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-4 lg:grid-cols-4">
        <StatsCard
          title="Office Spend"
          value={metrics ? formatCurrency(metrics.totalSpend) : "Loading..."}
          icon={<HandCoins className="h-4 w-4" />}
        />
        <StatsCard
          title="Purchase Requests"
          value={metrics ? metrics.purchaseRequestCount.toString() : "Loading..."}
          icon={<Package className="h-4 w-4" />}
        />
        <StatsCard
          title="Offices Quotations"
          value={metrics ? metrics.officeQuotationsCount.toString() : "Loading..."}
          icon={<FileText className="h-4 w-4" />}
        />
        <StatsCard
          title="Supplier Quotations"
          value={metrics ? metrics.supplierQuotationsCount.toString() : "Loading..."}
          icon={<ShoppingCart className="h-4 w-4" />}
        />
      </div>

      <div className="mt-8 grid gap-2 lg:grid-cols-7">
        <Card className="w-[1200px]">
          <CardHeader>
            <CardTitle>Spending Analysis</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="bar">
              <div className="flex justify-between items-center mb-4">
                <TabsList>
                  <TabsTrigger value="bar">Bar Chart</TabsTrigger>
                  <TabsTrigger value="line">Line Chart</TabsTrigger>
                </TabsList>
                <Select defaultValue="direct">
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Procurement Mode" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="direct">Shopping</SelectItem>
                    <SelectItem value="indirect">Small Value</SelectItem>
                    <SelectItem value="both">Competitive Bidding</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <TabsContent value="bar">
                <ChartContainer config={chartConfig} className="h-[400px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={spendingData}>
                      <XAxis dataKey="month" />
                      <YAxis />
                      <ChartTooltip />
                      <Bar dataKey="shopping" fill="var(--color-shopping)" radius={[4, 4, 0, 0]} />
                      <Bar dataKey="smallValue" fill="var(--color-smallValue)" radius={[4, 4, 0, 0]} />
                      <Bar dataKey="competitiveBidding" fill="var(--color-competitiveBidding)" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </TabsContent>
              <TabsContent value="line">
                <ChartContainer config={chartConfig} className="h-[350px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={spendingData}>
                      <XAxis dataKey="month" />
                      <YAxis />
                      <ChartTooltip />
                      <Line type="monotone" dataKey="shopping" stroke="var(--color-shopping)" strokeWidth={2} />
                      <Line type="monotone" dataKey="smallValue" stroke="var(--color-smallValue)" strokeWidth={2} />
                      <Line type="monotone" dataKey="competitiveBidding" stroke="var(--color-competitiveBidding)" strokeWidth={2} />
                    </LineChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
        
      </div>

    </div>
  )
}

interface StatsCardProps {
  title: string;
  value: string;
  icon: React.ReactNode;
}

function StatsCard({ title, value, icon }: StatsCardProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {icon}
      </CardHeader>
      <CardContent>
        <div className="font-bold">{value}</div>
      </CardContent>
    </Card>
  )
}