import { getMostUsedMoods } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";

export const MOST_USED_MOODS = "most_used_moods";

const useMostUsedMoods = (period, opts) => {
  const { data: mostUsedMoods, ...rest } = useQuery({
    queryKey: [MOST_USED_MOODS, period],
    queryFn: () => getMostUsedMoods(period),
    ...opts,
  });

  return { mostUsedMoods, ...rest };
};

export default useMostUsedMoods;
