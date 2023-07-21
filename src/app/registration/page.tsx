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
import LoadingDialog from "@/component/dialog/loading";

function Page() {
  const [formState, setFormState] = React.useState({
    username: "",
    email: "",
    password: "",
    error: "",
    loading: false,
    success: false,
  });
  const router = useRouter();

  /**
   * The `handleForm` function is an asynchronous function that handles form submission, signs up a
   * user with the provided email and password, writes user data to a database, and updates the form
   * state accordingly.
   * @param {any} event - The event parameter is an object that represents the event that triggered the
   * form submission. It is typically passed as an argument to event handlers in JavaScript. In this
   * case, it is used to prevent the default form submission behavior using the `preventDefault()`
   * method.
   */
  const handleForm = async (event: any) => {
    event?.preventDefault();

    updateFormStateByKeyAndValue("loading", true);
    const email = formState.email;
    const username = formState.username;
    const password = formState.password;

    const { result, error }: { result: any; error: any } = await signUp({ email, password });
    updateFormStateByKeyAndValue("error", error?.message);
    if (result?.user != null) {
      writeUserData({
        userId: result?.user?.uid,
        user: { email, username, profile_picture: "" },
      });
      updateFormStateByKeyAndValue("success", result?.user != null);
    }
    updateFormStateByKeyAndValue("loading", false);
  };

  /**
   * The onChange function is used to handle changes in input fields and update the form state with the
   * new value.
   * @param {string} key - The key parameter is a string that represents the key or name of the form
   * field that is being updated.
   * @param event - The `event` parameter is a React `ChangeEvent` object that represents a change
   * event triggered by a user action on an input element (either a textarea or an input element).
   */
  const onChange = (key: string, event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
    event.preventDefault();
    updateFormStateByKeyAndValue(key, event.target.value);
  };

  /**
   * The function `updateFormStateByKeyAndValue` updates the form state by setting a specific key to a
   * given value.
   * @param {string} key - The key parameter is a string that represents the key of the form state
   * object that needs to be updated.
   * @param {any} value - The value parameter is the new value that you want to update for the
   * specified key in the form state.
   */
  const updateFormStateByKeyAndValue = (key: string, value: any) => {
    setFormState((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const onClose = () => {
    updateFormStateByKeyAndValue("success", false);
  };

  return (
    <Container component="main" maxWidth="xs">
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          marginTop: "10rem",
        }}
      >
        <Typography component="h1" variant="h5">
          Sign Up
        </Typography>
        <Box component="form" onSubmit={handleForm} noValidate sx={{ mt: 1 }}>
          <TextField
            margin="normal"
            required
            fullWidth
            label="Email Address"
            name="email"
            autoComplete="email"
            autoFocus
            onChange={(e) => onChange("email", e)}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            type="password"
            autoComplete="current-password"
            onChange={(e) => onChange("password", e)}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="username"
            label="Username"
            type="text"
            onChange={(e) => onChange("username", e)}
          />
          {formState.error && <FormHelperText error>{formState.error}</FormHelperText>}
          <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }}>
            Sign Up
          </Button>
          <Grid container>
            <Grid>
              <Link href="/login">{"Already have an account? Sign In"}</Link>
            </Grid>
          </Grid>
        </Box>
      </Box>
      {/* Success Modal */}
      <Dialog open={formState.success} onClose={onClose}>
        <DialogTitle>Success!</DialogTitle>
        <DialogContent>
          <DialogContentText>Sign up successful! You can now proceed to the dashboard page.</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose} color="primary">
            Okay
          </Button>
        </DialogActions>
      </Dialog>
      {/* Loading Dialog */}
      <LoadingDialog isVisible={formState.loading} />
    </Container>
  );
}

export default Page;
