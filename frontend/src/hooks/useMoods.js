import { getAllMoods } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";

export const MOODS = "moods";

const useMoods = (opts) => {
  const { data: moods, ...rest } = useQuery({
    queryKey: [MOODS],
    queryFn: getAllMoods,
    ...opts,
  });

  return { moods, ...rest };
};

export default useMoods;
