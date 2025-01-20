import { getMoodStreaks } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";

export const MOOD_STREAKS = "mood_streaks";

const useMoodStreaks = (period, opts) => {
  const { data: moodStreaks, ...rest } = useQuery({
    queryKey: [MOOD_STREAKS, period],
    queryFn: () => getMoodStreaks(period),
    ...opts,
  });

  return { moodStreaks, ...rest };
};

export default useMoodStreaks;
