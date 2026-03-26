import { useCallback, useEffect, useState } from 'react';
import { Box, Grid, Paper, TextField, Typography } from '@mui/material';
import { BarChart } from '@mui/x-charts/BarChart';
import { fetchStats, type AdminStats } from '../../api/admin';
import { brandColors } from '../../theme';

function StatCard({ title, value, subtitle }: { title: string; value: string; subtitle?: string }) {
  return (
    <Paper
      elevation={0}
      sx={{
        p: 2.5,
        borderRadius: 2,
        border: `1px solid ${brandColors.border}`,
        backgroundColor: brandColors.card,
        height: '100%',
      }}
    >
      <Typography variant="caption" sx={{ color: brandColors.textMuted, letterSpacing: '0.08em', fontWeight: 700 }}>
        {title.toUpperCase()}
      </Typography>
      <Typography variant="h4" sx={{ fontWeight: 800, mt: 1 }}>
        {value}
      </Typography>
      {subtitle && (
        <Typography variant="body2" sx={{ color: brandColors.textSecondary, mt: 0.5 }}>
          {subtitle}
        </Typography>
      )}
    </Paper>
  );
}

export default function Dashboard() {
  const today = new Date();
  const defaultFrom = new Date(today);
  defaultFrom.setDate(defaultFrom.getDate() - 30);
  const toYmd = (d: Date) => d.toISOString().slice(0, 10);

  const [from, setFrom] = useState(toYmd(defaultFrom));
  const [to, setTo] = useState(toYmd(today));
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setError(null);
    try {
      const s = await fetchStats({ from, to });
      setStats(s);
    } catch (e) {
      setStats(null);
      setError(e instanceof Error ? e.message : 'Failed to load stats');
    }
  }, [from, to]);

  useEffect(() => {
    void load();
  }, [load]);

  const chartData = stats
    ? [stats.pendingCount, stats.approvedCount, stats.rejectedCount, stats.completedCount]
    : [0, 0, 0, 0];

  return (
    <Box>
      <Typography variant="h5" sx={{ fontWeight: 800, mb: 2 }}>
        Dashboard
      </Typography>
      <Typography variant="body2" sx={{ color: brandColors.textSecondary, mb: 3 }}>
        Metrics respect bookings created in the selected date range (by submission date).
      </Typography>

      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mb: 3 }}>
        <TextField
          label="From"
          type="date"
          value={from}
          onChange={(e) => setFrom(e.target.value)}
          slotProps={{ inputLabel: { shrink: true } }}
          sx={{ minWidth: 160 }}
        />
        <TextField
          label="To"
          type="date"
          value={to}
          onChange={(e) => setTo(e.target.value)}
          slotProps={{ inputLabel: { shrink: true } }}
          sx={{ minWidth: 160 }}
        />
      </Box>

      {error && (
        <Typography color="error" sx={{ mb: 2 }}>
          {error}
        </Typography>
      )}

      {stats && (
        <>
          <Grid container spacing={2} sx={{ mb: 3 }}>
            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <StatCard title="Total requests" value={String(stats.totalBookings)} />
            </Grid>
            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <StatCard title="Pending" value={String(stats.pendingCount)} subtitle="Awaiting decision" />
            </Grid>
            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <StatCard
                title="Total miles (known)"
                value={stats.totalMiles ? stats.totalMiles.toFixed(1) : '0'}
                subtitle="Sum of recorded distances"
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <StatCard
                title="Est. revenue"
                value={`$${stats.estimatedRevenue.toFixed(0)}`}
                subtitle="Approved + completed base fares"
              />
            </Grid>
          </Grid>

          <Paper
            elevation={0}
            sx={{ p: 2, borderRadius: 2, border: `1px solid ${brandColors.border}`, backgroundColor: brandColors.card }}
          >
            <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 2 }}>
              Status distribution
            </Typography>
            <BarChart
              height={320}
              colors={[brandColors.primary]}
              xAxis={[
                {
                  scaleType: 'band',
                  data: ['Pending', 'Approved', 'Rejected', 'Completed'],
                },
              ]}
              series={[{ data: chartData, label: 'Bookings' }]}
            />
          </Paper>
        </>
      )}
    </Box>
  );
}
