"use client";

import Link from "next/link";
import { useLayoutEffect, useState } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";



const Stats = ({ params: { slug } }: { params: { slug: string } }) => {
  const [opacity, setOpacity] = useState({
    amount: 1,
  });
  const [waitlistData, setWaitlistData] = useState<
    {
      name: string;
      running_count: number;
      amont: number;
    }[]
  >([]);

  useLayoutEffect(() => {
    const fetchStats = async () => {
      const data = await fetch(`/api/stats?id=${slug}`, {
        cache: "no-store",
        headers: { "Content-Type": "application/json" },
      });
      const x = await data.json();
      setWaitlistData(x);
    };

    fetchStats();
  }, [slug]);

  const handleMouseEnter = (o: any) => {
    const { dataKey } = o;
    setOpacity((op) => ({ ...op, [dataKey]: 0.5 }));
  };

  const handleMouseLeave = (o: any) => {
    const { dataKey } = o;
    setOpacity((op) => ({ ...op, [dataKey]: 1 }));
  };

  const mainColor = "#0068ff";

  return (
    <div className="flex flex-col gap-8 py-4">
      <Link href={`/waitlists/${slug}`}>{"< Back"}</Link>
      <ResponsiveContainer width="100%" height={300}>
        <AreaChart
          width={1000}
          height={300}
          data={waitlistData}
          margin={{
            top: 5,
            right: 60,
            left: 20,
            bottom: 5,
          }}
        >
          <defs>
            <linearGradient id="colorRunningCount" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={mainColor} stopOpacity={0.8} />
              <stop offset="95%" stopColor={mainColor} stopOpacity={0} />
            </linearGradient>
          </defs>
          <XAxis dataKey="name" />
          <YAxis />
          <CartesianGrid strokeDasharray="3 3" />
          <Tooltip />
          <Area
            type="monotone"
            dataKey="running_count"
            stroke={mainColor}
            fillOpacity={opacity.amount}
            fill="url(#colorRunningCount)"
          />
          <Legend
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export default Stats;
