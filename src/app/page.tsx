"use client";
import { Box, CircularProgress } from "@mui/material";

export default function Home() {
  return (
    <main>
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
        <CircularProgress />
      </Box>
    </main>
  );
}
