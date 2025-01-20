import { getMoodTrends } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";

export const MOOD_TREND = "mood-trend";

const useMoodTrend = (period, opts) => {
  const { data: moodTrend, ...rest } = useQuery({
    queryKey: [MOOD_TREND, period],
    queryFn: () => getMoodTrends(period),
    ...opts,
  });

  return { moodTrend, ...rest };
};

export default useMoodTrend;
