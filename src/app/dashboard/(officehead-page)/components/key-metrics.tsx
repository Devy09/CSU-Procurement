'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Bar, BarChart, Line, LineChart, ResponsiveContainer, XAxis, YAxis } from "recharts"
import { ChartConfig, ChartContainer, ChartTooltip } from "@/components/ui/chart"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Package, HandCoins, ShoppingCart, PackagePlus, Gauge } from "lucide-react"
import { Button } from "@/components/ui/button"

const spendingData = [
  { month: "Jan", direct: 150000, indirect: 80000 },
  { month: "Feb", direct: 180000, indirect: 90000 },
  { month: "Mar", direct: 120000, indirect: 150000 },
  { month: "Apr", direct: 120000, indirect: 95000 },
  { month: "May", direct: 150000, indirect: 200000 },
  { month: "Jun", direct: 220000, indirect: 110000 },
  { month: "July", direct: 120000, indirect: 110000 },
  { month: "Aug", direct: 110000, indirect: 220000 },
]

const chartConfig: ChartConfig = {
  direct: {
    label: "Direct Spend",
    color: "hsl(var(--primary))",
  },
  indirect: {
    label: "Indirect Spend",
    color: "hsl(var(--danger))",
  },
}


export default function OfficeHeadDashboard() {
  const [period, setPeriod] = useState("thisMonth")

  return (
    <div className="min-h-screen p-8 bg-background">
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-col bg-red-950 text-white p-4 rounded-lg w-full">
          <div className="flex items-center gap-2 text-2xl">
            <Gauge className="h-6 w-6" />
            <span className="font-bold">Procurement Dashboard</span>
          </div>
          <p className="text-muted-foreground text-sm text-white">Monitor and manage your procurement activities</p>
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
          title="Expenditure"
          value="₱1,230,500"
          icon={<HandCoins className="h-4 w-4" />}
        />
        <StatsCard
          title="Purchase Requests"
          value="3"
          icon={<Package className="h-4 w-4" />}
        />
        <StatsCard
          title="Quotations"
          value="3"
          icon={<ShoppingCart className="h-4 w-4" />}
        />
        <StatsCard
          title="PPMP Items"
          value="30"
          icon={<PackagePlus className="h-4 w-4" />}
        />
      </div>

      <div className="mt-8 grid gap-2 lg:grid-cols-7">
        <Card className="w-[1200px]">
          <CardHeader>
            <CardTitle>Overview</CardTitle>
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
                    <SelectValue placeholder="Spending type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="direct">Shopping</SelectItem>
                    <SelectItem value="indirect">Small Value</SelectItem>
                    <SelectItem value="both">Competitive Bidding</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <TabsContent value="bar">
                <ChartContainer config={chartConfig} className="h-[400px] w-[1000px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={spendingData}>
                      <XAxis dataKey="month" />
                      <YAxis />
                      <ChartTooltip />
                      <Bar dataKey="direct" fill="var(--color-direct)" radius={[4, 4, 0, 0]} />
                      <Bar dataKey="indirect" fill="var(--color-indirect)" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </TabsContent>
              <TabsContent value="line">
                <ChartContainer config={chartConfig} className="h-[350px] w-[1000px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={spendingData}>
                      <XAxis dataKey="month" />
                      <YAxis />
                      <ChartTooltip />
                      <Line type="monotone" dataKey="direct" stroke="var(--color-direct)" strokeWidth={2} />
                      <Line type="monotone" dataKey="indirect" stroke="var(--color-indirect)" strokeWidth={2} />
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

function StatsCard({ title, value,icon }: StatsCardProps) {
  return (
    <Card className="bg-red-950 text-white">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {icon}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
      </CardContent>
    </Card>
  )
}