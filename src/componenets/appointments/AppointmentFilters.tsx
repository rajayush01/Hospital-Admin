import { Stack, MenuItem, Select, TextField, Typography, Box } from "@mui/material";
import { useEffect, useState } from "react";

export type FilterType =
  | "today"
  | "week"
  | "month"
  | "all"
  | "custom";

export type SortOrder = "asc" | "desc";

export default function AppointmentFilters({
  current,
  onChange,
  sortOrder,
  onSortChange,
  onCustomChange,
}: {
  current: FilterType;
  onChange: (v: FilterType) => void;
  sortOrder: SortOrder;
  onSortChange: (v: SortOrder) => void;
  onCustomChange?: (from: string, to: string) => void;
}) {
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");

  useEffect(() => {
    if (current === "custom" && from && to && onCustomChange) {
      onCustomChange(from, to);
    }
  }, [current, from, to]);

  return (
    <Stack direction="row" spacing={2} alignItems="center" flexWrap="wrap">
      <Box>
        <Typography fontSize={16} variant="caption">Filter: </Typography>
        <Select
          size="small"
          value={current}
          onChange={(e) => onChange(e.target.value as FilterType)}
          sx={{ minWidth: 150 }}
        >
          <MenuItem value="today">Today</MenuItem>
          <MenuItem value="week">This Week</MenuItem>
          <MenuItem value="month">This Month</MenuItem>
          <MenuItem value="all">All</MenuItem>
          <MenuItem value="custom">Custom Range</MenuItem>
        </Select>
      </Box>

      <Box>
        <Typography fontSize={16} variant="caption">Sort By: </Typography>
        <Select
          size="small"
          value={sortOrder}
          onChange={(e) =>
            onSortChange(e.target.value as SortOrder)
          }
          sx={{ minWidth: 180 }}
        >
          <MenuItem value="desc">Newest First</MenuItem>
          <MenuItem value="asc">Oldest First</MenuItem>
        </Select>
      </Box>

      {current === "custom" && (
        <>
          <TextField
            size="small"
            type="date"
            label="From"
            InputLabelProps={{ shrink: true }}
            value={from}
            onChange={(e) => setFrom(e.target.value)}
          />

          <TextField
            size="small"
            type="date"
            label="To"
            InputLabelProps={{ shrink: true }}
            value={to}
            onChange={(e) => setTo(e.target.value)}
          />
        </>
      )}
    </Stack>
  );
}
