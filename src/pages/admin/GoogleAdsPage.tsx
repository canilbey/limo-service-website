import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  Alert,
  Box,
  CircularProgress,
  Grid,
  Paper,
  TextField,
  Typography,
} from '@mui/material';
import { BarChart } from '@mui/x-charts/BarChart';
import { DataGrid, type GridColDef } from '@mui/x-data-grid';
import { fetchAdsCampaigns, type AdsCampaignRow, type GoogleAdsCampaignsResponse } from '../../api/googleAds';
import { brandColors } from '../../theme';

function microsToUsd(micros: number): string {
  return (micros / 1_000_000).toFixed(2);
}

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

export default function GoogleAdsPage() {
  const today = new Date();
  const defaultFrom = new Date(today);
  defaultFrom.setDate(defaultFrom.getDate() - 30);
  const toYmd = (d: Date) => d.toISOString().slice(0, 10);

  const [from, setFrom] = useState(toYmd(defaultFrom));
  const [to, setTo] = useState(toYmd(today));
  const [data, setData] = useState<GoogleAdsCampaignsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetchAdsCampaigns({ from, to });
      setData(res);
    } catch (e) {
      setData(null);
      setError(e instanceof Error ? e.message : 'Failed to load Google Ads data');
    } finally {
      setLoading(false);
    }
  }, [from, to]);

  useEffect(() => {
    void load();
  }, [load]);

  const chartSlice = useMemo(() => {
    if (!data || !data.configured || !data.campaigns.length) {
      return { names: [] as string[], clicks: [] as number[] };
    }
    const sorted = [...data.campaigns].sort((a, b) => b.clicks - a.clicks).slice(0, 10);
    return {
      names: sorted.map((c) => (c.name.length > 24 ? `${c.name.slice(0, 22)}…` : c.name)),
      clicks: sorted.map((c) => c.clicks),
    };
  }, [data]);

  const columns: GridColDef<AdsCampaignRow>[] = useMemo(
    () => [
      { field: 'name', headerName: 'Campaign', flex: 1.2, minWidth: 180 },
      { field: 'status', headerName: 'Status', width: 120 },
      { field: 'impressions', headerName: 'Impressions', type: 'number', width: 120 },
      { field: 'clicks', headerName: 'Clicks', type: 'number', width: 90 },
      {
        field: 'ctr',
        headerName: 'CTR',
        type: 'number',
        width: 90,
        valueFormatter: (v) => `${((v as number) * 100).toFixed(2)}%`,
      },
      {
        field: 'averageCpcMicros',
        headerName: 'Avg CPC',
        type: 'number',
        width: 100,
        valueFormatter: (v) => `$${microsToUsd(v as number)}`,
      },
      {
        field: 'costMicros',
        headerName: 'Cost',
        type: 'number',
        width: 100,
        valueFormatter: (v) => `$${microsToUsd(v as number)}`,
      },
      {
        field: 'conversions',
        headerName: 'Conv.',
        type: 'number',
        width: 90,
      },
      {
        field: 'costPerConversionMicros',
        headerName: 'Cost / conv.',
        type: 'number',
        width: 120,
        valueGetter: (_v, row) => row.costPerConversionMicros,
        valueFormatter: (v) =>
          v != null && typeof v === 'number' ? `$${microsToUsd(v)}` : '—',
      },
    ],
    [],
  );

  const showSetup = data && !data.configured;
  const showMetrics = data && data.configured && !error;

  return (
    <Box>
      <Typography variant="h5" sx={{ fontWeight: 800, mb: 2 }}>
        Google Ads
      </Typography>
      <Typography variant="body2" sx={{ color: brandColors.textSecondary, mb: 3 }}>
        Campaign performance from the Google Ads API for the selected date range (account totals and per-campaign
        breakdown).
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

      {loading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}>
          <CircularProgress aria-label="Loading Google Ads" />
        </Box>
      )}

      {!loading && error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {!loading && showSetup && (
        <Alert severity="info" sx={{ mb: 2 }}>
          <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1 }}>
            Google Ads API is not configured on the server
          </Typography>
          <Typography variant="body2" component="div">
            Set these environment variables on the backend and restart the API:
          </Typography>
          <Box component="ul" sx={{ pl: 2, mb: 0, mt: 1 }}>
            <li>
              <code>GOOGLE_ADS_DEVELOPER_TOKEN</code>
            </li>
            <li>
              <code>GOOGLE_ADS_CLIENT_ID</code>, <code>GOOGLE_ADS_CLIENT_SECRET</code>,{' '}
              <code>GOOGLE_ADS_REFRESH_TOKEN</code>
            </li>
            <li>
              <code>GOOGLE_ADS_CUSTOMER_ID</code> (no dashes)
            </li>
            <li>
              Optional MCC: <code>GOOGLE_ADS_LOGIN_CUSTOMER_ID</code>
            </li>
          </Box>
          <Typography variant="body2" sx={{ mt: 1 }}>
            For booking conversion tracking in the browser, set <code>VITE_GOOGLE_ADS_CONVERSION_LABEL</code> in the
            frontend env.
          </Typography>
        </Alert>
      )}

      {!loading && showMetrics && data.configured && (
        <>
          <Grid container spacing={2} sx={{ mb: 3 }}>
            <Grid size={{ xs: 12, sm: 6, md: 4 }}>
              <StatCard title="Clicks" value={String(data.totals.clicks)} />
            </Grid>
            <Grid size={{ xs: 12, sm: 6, md: 4 }}>
              <StatCard title="Impressions" value={String(data.totals.impressions)} />
            </Grid>
            <Grid size={{ xs: 12, sm: 6, md: 4 }}>
              <StatCard title="Cost (USD)" value={`$${microsToUsd(data.totals.costMicros)}`} />
            </Grid>
            <Grid size={{ xs: 12, sm: 6, md: 4 }}>
              <StatCard
                title="CTR"
                value={`${((data.totals.ctr ?? 0) * 100).toFixed(2)}%`}
                subtitle="Clicks / impressions"
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6, md: 4 }}>
              <StatCard title="Conversions" value={String(data.totals.conversions)} />
            </Grid>
            <Grid size={{ xs: 12, sm: 6, md: 4 }}>
              <StatCard
                title="Cost / conversion"
                value={
                  data.totals.costPerConversionMicros != null
                    ? `$${microsToUsd(data.totals.costPerConversionMicros)}`
                    : '—'
                }
              />
            </Grid>
          </Grid>

          {chartSlice.names.length > 0 && (
            <Paper
              elevation={0}
              sx={{
                p: 2,
                mb: 3,
                borderRadius: 2,
                border: `1px solid ${brandColors.border}`,
                backgroundColor: brandColors.card,
              }}
            >
              <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 2 }}>
                Top campaigns by clicks
              </Typography>
              <BarChart
                height={320}
                colors={[brandColors.primary]}
                margin={{ left: 80 }}
                xAxis={[
                  {
                    scaleType: 'band',
                    data: chartSlice.names,
                    tickLabelStyle: { angle: -35, textAnchor: 'end', fontSize: 11 },
                  },
                ]}
                series={[{ data: chartSlice.clicks, label: 'Clicks' }]}
              />
            </Paper>
          )}

          <Paper
            elevation={0}
            sx={{
              p: 2,
              borderRadius: 2,
              border: `1px solid ${brandColors.border}`,
              backgroundColor: brandColors.card,
              width: '100%',
            }}
          >
            <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 2 }}>
              All campaigns
            </Typography>
            <Box sx={{ width: '100%', minHeight: 360 }}>
              <DataGrid
                rows={data.campaigns}
                columns={columns}
                getRowId={(row) => row.id}
                disableRowSelectionOnClick
                pageSizeOptions={[10, 25, 50]}
                initialState={{ pagination: { paginationModel: { pageSize: 10 } } }}
                sx={{
                  border: 'none',
                  '& .MuiDataGrid-columnHeaders': { borderBottom: `1px solid ${brandColors.border}` },
                }}
              />
            </Box>
          </Paper>
        </>
      )}

      {!loading && showMetrics && data.configured && data.campaigns.length === 0 && (
        <Alert severity="warning">No campaign rows returned for this date range.</Alert>
      )}
    </Box>
  );
}
