import { useCallback, useEffect, useMemo, useState } from 'react';
import { Box, FormControl, InputLabel, MenuItem, Select, Typography } from '@mui/material';
import { DataGrid, type GridColDef } from '@mui/x-data-grid';
import { fetchBookings, type AdminBookingRow } from '../../api/admin';
import { brandColors } from '../../theme';

export default function CustomerHistory() {
  const [rows, setRows] = useState<AdminBookingRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [status, setStatus] = useState<string>('all');
  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetchBookings({ status: status === 'all' ? undefined : status, limit: 500 });
      setRows(res.data);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to load');
      setRows([]);
    } finally {
      setLoading(false);
    }
  }, [status]);

  useEffect(() => {
    void load();
  }, [load]);

  const columns: GridColDef<AdminBookingRow>[] = useMemo(
    () => [
      { field: 'id', headerName: 'ID', width: 70 },
      { field: 'reference', headerName: 'Ref', minWidth: 110, flex: 0.6 },
      {
        field: 'customer',
        headerName: 'Customer',
        flex: 1,
        minWidth: 160,
        valueGetter: (_value, row) => `${row.title} ${row.firstName} ${row.lastName}`,
      },
      { field: 'phone', headerName: 'Phone', minWidth: 140, flex: 0.8, sortable: false },
      { field: 'pickup', headerName: 'Pickup', flex: 1, minWidth: 160 },
      { field: 'destination', headerName: 'Destination', flex: 1, minWidth: 120 },
      { field: 'serviceDate', headerName: 'Date', minWidth: 110 },
      { field: 'vehicleName', headerName: 'Vehicle', minWidth: 130, flex: 0.7 },
      { field: 'status', headerName: 'Status', minWidth: 110 },
      { field: 'createdAt', headerName: 'Submitted', minWidth: 160, flex: 0.8 },
    ],
    [],
  );

  return (
    <Box sx={{ width: '100%' }}>
      <Typography variant="h5" sx={{ fontWeight: 800, mb: 2 }}>
        Customer history
      </Typography>
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mb: 2 }}>
        <FormControl sx={{ minWidth: 200 }}>
          <InputLabel id="status-filter-label">Status</InputLabel>
          <Select
            labelId="status-filter-label"
            label="Status"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
          >
            <MenuItem value="all">All</MenuItem>
            <MenuItem value="pending">Pending</MenuItem>
            <MenuItem value="approved">Approved</MenuItem>
            <MenuItem value="rejected">Rejected</MenuItem>
            <MenuItem value="completed">Completed</MenuItem>
          </Select>
        </FormControl>
      </Box>
      {error && (
        <Typography color="error" sx={{ mb: 1 }}>
          {error}
        </Typography>
      )}
      <Box sx={{ height: 640, width: '100%' }}>
        <DataGrid
          rows={rows}
          columns={columns}
          loading={loading}
          getRowId={(r) => r.id}
          pageSizeOptions={[25, 50, 100]}
          initialState={{ pagination: { paginationModel: { pageSize: 25 } } }}
          sx={{
            borderColor: brandColors.border,
            color: '#fff',
            '& .MuiDataGrid-columnHeaders': { backgroundColor: brandColors.cardElevated },
            '& .MuiDataGrid-row:nth-of-type(even)': { backgroundColor: 'rgba(255,255,255,0.02)' },
            '& .MuiDataGrid-cell': { borderColor: brandColors.border },
          }}
        />
      </Box>
    </Box>
  );
}
