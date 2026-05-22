import React from 'react';
import MuiPagination from '@mui/material/Pagination';
import Box from '@mui/material/Box';

export interface PaginationProps {
  count: number;
  page: number;
  onChange: (page: number) => void;
}

export const Pagination: React.FC<PaginationProps> = ({
  count,
  page,
  onChange,
}) => {
  const handleChange = (_event: React.ChangeEvent<unknown>, value: number) => {
    onChange(value);
  };

  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3, width: '100%' }}>
      <MuiPagination
        count={count}
        page={page}
        onChange={handleChange}
        color="primary"
        shape="rounded"
        size="medium"
        sx={{
          '& .MuiPaginationItem-root': {
            fontWeight: 600,
            borderRadius: '8px',
            fontFamily: '"Inter", sans-serif',
            color: '#475569',
            '&.Mui-selected': {
              backgroundColor: '#2563eb', // blue 600
              color: '#ffffff',
              '&:hover': {
                backgroundColor: '#1d4ed8',
              },
            },
          },
        }}
      />
    </Box>
  );
};
