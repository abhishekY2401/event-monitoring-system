"use client";

import PropTypes from "prop-types"; 


import { TrendingUp } from "lucide-react";
import { Bar, BarChart, XAxis } from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  // ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

// Process event data to aggregate commits and PRs
const processEventData = (data) => {
  const result = {};

  data.forEach((event) => {
    const date = new Date(event.timestamp);
    const formattedDate = date.toLocaleDateString("en-US", {
      weekday: "long",
    });

    if (!result[formattedDate]) {
      result[formattedDate] = { commits: 0, prs: 0, merged: 0 };
    }

    if (event["action-type"].toLowerCase() === "push") {
      result[formattedDate].commits += 1;
    } else if (event["action-type"].toLowerCase() === "pull_request") {
      result[formattedDate].prs += 1;
    } else if (event["action-type"].toLowerCase() === "merge") {
      result[formattedDate].merged += 1;
    }
  });

  // Convert result to chartData format
  return Object.keys(result).map((date) => ({
    date: date,
    commits: result[date].commits,
    prs: result[date].prs,
    merged: result[date].merged
  }));
};


export function EventsChart({events}) {
  const chartData = processEventData(events);

  const chartConfig = {
    commits: {
      label: "commits",
      color: "hsl(var(--chart-1))",
    },
    prs: {
      label: "prs",
      color: "hsl(var(--chart-2))",
    },
    merged: {
      label: "merged_pr",
      color: "hsl(var(--chart-5))",
    },
  }

  return (
    <Card width={100} height={50}>
      <CardHeader>
        <CardTitle>Bar Chart - Commits & PRs</CardTitle>
        <CardDescription>Last Week</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[200px] w-200px">
          <BarChart
            accessibilityLayer
            data={chartData}
            width={10}
            height={10}
          >
            <XAxis
              dataKey="date"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(value) => value}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent />}
            />
            <Bar dataKey="commits" fill="var(--color-commits)" radius={4} />
            <Bar dataKey="prs" fill="var(--color-prs)" radius={4} />
            <Bar dataKey="merged" fill="var(--color-merged)" radius={4} />

          </BarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="flex gap-2 font-medium leading-none">
          Github Repository Usage <TrendingUp className="h-4 w-4" />
        </div>
        <div className="leading-none text-muted-foreground">
          Showing total commits & PRs for the last week
        </div>
      </CardFooter>
    </Card>
  );
}

// Add propTypes validation
EventsChart.propTypes = {
  events: PropTypes.arrayOf(
    PropTypes.shape({
      request_id: PropTypes.string.isRequired,
      author: PropTypes.string.isRequired,
      "action-types": PropTypes.string.isRequired,
      from_branch: PropTypes.string.isRequired,
      to_branch: PropTypes.string.isRequired,
      timestamp: PropTypes.string.isRequired,
    })
  ).isRequired,
};
