import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { Container, AppBar, Toolbar, Typography, Box } from '@mui/material';

const HomePage: React.FC = () => {
  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        SAP Process Data Viewer
      </Typography>
      <Typography variant="body1">
        Welcome to the SAP Process Data Viewer. Select an option to begin:
      </Typography>
      {/* Content will be added here */}
    </Container>
  );
};

const App: React.FC = () => {
  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            DeceSoft - SAP Process Data for Process Mining
          </Typography>
        </Toolbar>
      </AppBar>
      <Routes>
        <Route path="/" element={<HomePage />} />
      </Routes>
    </Box>
  );
};

export default App; 