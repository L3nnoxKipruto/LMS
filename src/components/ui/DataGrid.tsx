import React from 'react';
import { DataGrid as MuiDataGrid, GridColDef } from '@mui/x-data-grid';
import Box from '@mui/material/Box';

export interface DataGridProps {
  rows: any[];
  columns: GridColDef[];
  pageSize?: number;
  loading?: boolean;
}

export const DataGrid: React.FC<DataGridProps> = ({
  rows,
  columns,
  pageSize = 5,
  loading = false,
}) => {
  return (
    <Box
      sx={{
        width: '100%',
        height: 380,
        '& .MuiDataGrid-root': {
          border: '1px solid #e2e8f0',
          borderColor: (theme) => theme.palette.divider,
          borderRadius: '12px',
          backgroundColor: 'background.paper',
          fontSize: '0.875rem',
          fontFamily: '"Inter", sans-serif',
        },
        '& .MuiDataGrid-cell': {
          borderColor: (theme) => theme.palette.divider,
          color: (theme) => theme.palette.text.primary,
        },
        '& .MuiDataGrid-columnHeader': {
          backgroundColor: (theme) => (theme.palette.mode === 'dark' ? '#0f172a' : '#f8fafc'),
          color: (theme) => theme.palette.text.secondary,
          fontWeight: 700,
          borderBottom: '1px solid',
          borderColor: (theme) => theme.palette.divider,
        },
        '& .MuiDataGrid-footerContainer': {
          borderTop: '1px solid',
          borderColor: (theme) => theme.palette.divider,
          backgroundColor: (theme) => (theme.palette.mode === 'dark' ? '#0f172a' : '#f8fafc'),
        },
      }}
    >
      <MuiDataGrid
        rows={rows}
        columns={columns}
        initialState={{
          pagination: {
            paginationModel: {
              pageSize: pageSize,
            },
          },
        }}
        pageSizeOptions={[5, 10, 20]}
        loading={loading}
        disableRowSelectionOnClick
      />
    </Box>
  );
};
