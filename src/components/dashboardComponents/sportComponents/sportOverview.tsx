"use client"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useState } from "react"
import { HomeTab } from "./hometab"
import { LiveMatchTab } from "./livematchTab"

const SportOverviewTopBar = () => {

    const [activeTab, setActiveTab] = useState("live")

    const handleTabChange = (tab: string) => {
        setActiveTab(tab)
    }

  return (
    <>
       <div className="w-full rounded-full flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <Tabs value={activeTab} onValueChange={handleTabChange}>
                <TabsList className="w-full justify-start overflow-x-auto overflow-y-hidden rounded-md bg-[#F2FEFF]">
                    <TabsTrigger
                            value="live"
                            className="px-4 h-8 rounded-md text-xs sm:text-sm text-slate-600 data-[state=active]:bg-[#0E808D] data-[state=active]:text-white"
                        >
                        Live
                    </TabsTrigger>
                    <TabsTrigger
                        value="fixtures"
                            className="px-4 h-8 rounded-md text-xs sm:text-sm text-slate-600 data-[state=active]:bg-[#0E808D] data-[state=active]:text-white"
                        >
                        Fixtures
                    </TabsTrigger>

                      {/* <TabsTrigger
                value="leagues"
                className="px-4 h-8 rounded-md text-xs sm:text-sm text-slate-600 data-[state=active]:bg-[#0E808D] data-[state=active]:text-white"
            >
                Leagues
            </TabsTrigger>
            <TabsTrigger
                value="club-management"
                className="px-4 h-8 rounded-md text-xs sm:text-sm text-slate-600 data-[state=active]:bg-[#0E808D] data-[state=active]:text-white"
            >
                Club Management
            </TabsTrigger> */}
            </TabsList>
              </Tabs>
    </div>
    {/* Tabs Content */}
    {activeTab === "fixtures" && <HomeTab />}
    {activeTab === "live" && <LiveMatchTab />}
    </>
 
  )
}

export const SportOverview = () => {
  return (
    <div className="w-full">
      <SportOverviewTopBar />
    </div>  
  )
}
