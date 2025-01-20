import PeriodFilterBar from "@/components/PeriodFilterBar";
import useMoodStreaks from "@/hooks/journal trends/useMoodStreaks";
import useMoodTrend from "@/hooks/journal trends/useMoodTrend";
import useMostUsedMoods from "@/hooks/journal trends/useMostUsedMoods";
import { ChartLine, Flame } from "lucide-react";
import React, { useEffect, useState } from "react";
import {
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const OverviewPage = () => {
  const [period, setPeriod] = useState("1 Month");
  const { mostUsedMoods, isLoading } = useMostUsedMoods(period);
  const { moodStreaks, isLoading: isStreakLoading } = useMoodStreaks(period);
  const { moodTrend, isLoading: isTrendLoading } = useMoodTrend(period);
  const [topMoodData, setTopMoodData] = useState([]);
  const [streaksData, setStreaksData] = useState([]);
  const [moodTrendData, setMoodTrendData] = useState([]);

  useEffect(() => {
    if (mostUsedMoods) {
      const data = mostUsedMoods.map((mood) => ({
        name: mood.name,
        value: mood.count,
        fill: mood.colour,
      }));
      setTopMoodData(data);
    }

    if (moodStreaks) {
      const data = moodStreaks.map((streak) => ({
        name: streak.name,
        value: streak.maxStreak,
        fill: streak.colour,
        emoji: streak.emoji,
      }));
      setStreaksData(data);
    }

    if (moodTrend) {
      const transformedData = moodTrend.reduce((acc, item) => {
        item.trends.forEach((trend) => {
          const date = new Date(trend.date).toISOString().split("T")[0];
          if (!acc[date]) {
            acc[date] = { date };
          }
          acc[date][item.mood.name] = trend.count;
        });
        return acc;
      }, {});

      const data = Object.values(transformedData);
      setMoodTrendData(data);
    }
  }, [mostUsedMoods, moodStreaks, moodTrend]);

  if (
    isLoading ||
    isStreakLoading ||
    isTrendLoading ||
    topMoodData.length === 0 ||
    streaksData.length === 0 ||
    moodTrendData.length === 0
  )
    return <p>Loading...</p>;

  return (
    <>
      <PeriodFilterBar period={period} setPeriod={setPeriod} />

      <div className="grid grid-cols-2 h-full gap-4 py-4">
        <div className="flex flex-col">
          <h2 className="flex gap-2">
            <Flame />
            Most recorded moods
          </h2>
          <div className="flex gap-4">
            <PieChart width={200} height={200}>
              <Pie data={topMoodData} dataKey="value" nameKey="name">
                {topMoodData.map((entry, index) => (
                  <Cell key={index} fill={entry.fill} />
                ))}
              </Pie>
              <Tooltip formatter={(value, name) => [`${value}`, `${name}`]} />
            </PieChart>
            <div className="pt-2">
              <h3>
                You felt{" "}
                <span style={{ color: topMoodData[0].fill }}>
                  {topMoodData[0].name}
                </span>{" "}
                the most!
              </h3>
              <ol className="font-semibold list-decimal">
                {topMoodData.map((mood, index) => (
                  <li key={index}>
                    {mood.name} - {mood.value}
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </div>

        <div>
          <h2 className="flex gap-2">
            <Flame />
            Longest streak
          </h2>
          <h3 className="pt-2">
            Your were{" "}
            <span style={{ color: streaksData[0].fill }}>
              {streaksData[0].name}
            </span>{" "}
            for {streaksData[0].value} straight days!
          </h3>
          <div className="flex gap-8 justify-start pt-2">
            <div
              className="flex flex-col size-32 justify-center items-center gap-4 text-black rounded-lg"
              style={{
                backgroundColor: streaksData[0].fill,
              }}
            >
              <h1 className="text-4xl cursor-pointer">
                {streaksData[0].emoji}
              </h1>
              <p>{streaksData[0].name}</p>
            </div>
            <ol className="font-semibold list-decimal">
              {streaksData.map((streak, index) => (
                <li key={index}>
                  {streak.name} - {streak.value} days
                </li>
              ))}
            </ol>
          </div>
        </div>

        <div className="col-span-2 h-72">
          <h2 className="flex gap-2 pb-2">
            <ChartLine /> Overall Trend
          </h2>
          <ResponsiveContainer width="95%" height="100%">
            <LineChart width={730} height={250} data={moodTrendData}>
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip contentStyle={{ backgroundColor: "#18181A" }} />
              <Legend />
              {moodTrend.map((item) => (
                <Line
                  key={item.mood._id}
                  type="monotone"
                  dataKey={item.mood.name}
                  stroke={item.mood.colour}
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </>
  );
};

export default OverviewPage;
