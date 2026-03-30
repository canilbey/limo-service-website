import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { ThemeProvider } from '@mui/material';
import theme from '../theme';
import GoogleAdsPage from '../pages/admin/GoogleAdsPage';
import * as googleAdsApi from '../api/googleAds';

const renderPage = () =>
  render(
    <ThemeProvider theme={theme}>
      <GoogleAdsPage />
    </ThemeProvider>,
  );

describe('GoogleAdsPage', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('shows setup instructions when API is not configured', async () => {
    vi.spyOn(googleAdsApi, 'fetchAdsCampaigns').mockResolvedValue({
      configured: false,
      error: 'Google Ads API is not configured.',
      dateRange: { from: '2026-01-01', to: '2026-01-31' },
      campaigns: [],
      totals: { impressions: 0, clicks: 0, costMicros: 0, conversions: 0 },
    });

    renderPage();

    await waitFor(() => {
      expect(screen.queryByLabelText(/Loading Google Ads/i)).not.toBeInTheDocument();
    });

    expect(screen.getByText(/Google Ads API is not configured on the server/i)).toBeInTheDocument();
    expect(screen.getByText(/GOOGLE_ADS_DEVELOPER_TOKEN/i)).toBeInTheDocument();
  });

  it('renders KPI cards when campaigns are returned', async () => {
    vi.spyOn(googleAdsApi, 'fetchAdsCampaigns').mockResolvedValue({
      configured: true,
      dateRange: { from: '2026-01-01', to: '2026-01-31' },
      campaigns: [
        {
          id: '1',
          name: 'Test campaign',
          status: 'ENABLED',
          impressions: 1000,
          clicks: 50,
          ctr: 0.05,
          averageCpcMicros: 2000000,
          costMicros: 100000000,
          conversions: 5,
          costPerConversionMicros: 20000000,
        },
      ],
      totals: {
        impressions: 1000,
        clicks: 50,
        costMicros: 100000000,
        conversions: 5,
        ctr: 0.05,
        costPerConversionMicros: 20000000,
      },
    });

    renderPage();

    await waitFor(() => {
      expect(screen.getByText('Test campaign')).toBeInTheDocument();
    });

    expect(screen.getByText('Top campaigns by clicks')).toBeInTheDocument();
    expect(screen.getByText('All campaigns')).toBeInTheDocument();
    expect(screen.getAllByText('$100.00').length).toBeGreaterThanOrEqual(1);
  });
});
