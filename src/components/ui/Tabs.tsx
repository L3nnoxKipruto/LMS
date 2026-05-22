import React from 'react';
import MuiTabs from '@mui/material/Tabs';
import MuiTab from '@mui/material/Tab';
import Box from '@mui/material/Box';

interface TabItem {
  label: string;
  value: string | number;
}

export interface TabsProps {
  tabs: TabItem[];
  value: string | number;
  onChange: (value: string | number) => void;
}

export const Tabs: React.FC<TabsProps> = ({ tabs, value, onChange }) => {
  const handleChange = (_event: React.SyntheticEvent, newValue: string | number) => {
    onChange(newValue);
  };

  return (
    <Box sx={{ borderBottom: 1, borderColor: 'divider', width: '100%' }}>
      <MuiTabs
        value={value}
        onChange={handleChange}
        aria-label="JifunzeHub Platform Tabs"
        variant="scrollable"
        scrollButtons="auto"
        sx={{
          '& .MuiTabs-indicator': {
            backgroundColor: '#2563eb', // blue 600
            height: 2,
          },
          '& .MuiTab-root': {
            textTransform: 'none',
            fontSize: '0.875rem',
            fontWeight: 600,
            minWidth: 90,
            padding: '12px 16px',
            color: '#64748b', // slate 500
            '&.Mui-selected': {
              color: '#2563eb',
            },
            '&:hover': {
              color: '#1d4ed8',
            },
          },
        }}
      >
        {tabs.map((tab) => (
          <MuiTab key={tab.value} label={tab.label} value={tab.value} />
        ))}
      </MuiTabs>
    </Box>
  );
};
