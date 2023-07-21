"use client";
import React from "react";
import signUp from "@/firebase/auth/signup";
import { useRouter } from "next/navigation";
import {
  Box,
  Button,
  Checkbox,
  CircularProgress,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  FormControlLabel,
  FormHelperText,
  Grid,
  Link,
  TextField,
  Typography,
} from "@mui/material";
import { writeUserData } from "@/firebase/realtime-database/writeData";

interface LoadingDialogProps {
  isVisible: boolean;
  message?: string;
}

function LoadingDialog({ isVisible, message }: LoadingDialogProps) {
  return (
    <Dialog open={isVisible}>
      <DialogTitle>{message ?? "Please wait while we process your request."}</DialogTitle>
      <DialogContent sx={{ padding: "1rem" }}>
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="1rem">
          <CircularProgress />
        </Box>
      </DialogContent>
    </Dialog>
  );
}

export default LoadingDialog;
