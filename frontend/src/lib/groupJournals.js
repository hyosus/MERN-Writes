const groupEntriesByDate = (entries, sortDirection = "desc") => {
  if (!entries) return {};

  const grouped = entries.reduce((acc, entry) => {
    const date = new Date(entry.date);
    const year = date.getFullYear();
    const month = date.toLocaleString("default", { month: "long" });

    if (!acc[year]) acc[year] = {};
    if (!acc[year][month]) acc[year][month] = [];
    acc[year][month].push(entry);
    return acc;
  }, {});

  // Sort by year
  const sortedYears = Object.keys(grouped).sort((a, b) => {
    if (sortDirection === "desc") {
      return parseInt(b) - parseInt(a);
    } else {
      return parseInt(a) - parseInt(b);
    }
  });

  // Create a new array with sorted entries
  const sortedGroupedEntries = sortedYears.map((year) => ({
    year,
    months: Object.entries(grouped[year]).map(([month, entries]) => ({
      month,
      entries,
    })),
  }));

  return sortedGroupedEntries;
};

export default groupEntriesByDate;
