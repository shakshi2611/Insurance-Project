import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button, TextField, Container, Typography, Box } from "@mui/material";
import Header from "./../components/common/Header";
import { toast } from "react-toastify";
import axios from 'axios'; 

const SignupPage = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();


  useEffect(() => {
    const loggedInUser = localStorage.getItem("user");
    if (loggedInUser) {
      navigate("/");
    }
  }, [navigate]);

  const handleSignup = (e) => {
    e.preventDefault();
    const regobj = { name, email, password };

    axios.post("http://localhost:5000/users", regobj)
      .then(() => {
        toast.success("Registered Successfully");
        navigate("/login");
      })
      .catch((err) => {
        toast.error("Failed: " + err.message);
      });
  };

  return (
    <div className="flex-1 overflow-auto relative z-10">
      <Header title="Signup" />
      <main className="max-w-7xl mx-auto py-6 px-4 lg:px-8">
        <Container component="main" maxWidth="xs">
          <Box
            sx={{
              marginTop: 8,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              backgroundColor: "rgba(255, 255, 255, 0.1)",
              borderRadius: 2,
              padding: 3,
              boxShadow: 3,
            }}
          >
            <Typography component="h1" variant="h5">
              Sign Up
            </Typography>
            <Box component="form" onSubmit={handleSignup} sx={{ mt: 1 }}>
              <TextField
                margin="normal"
                required
                fullWidth
                label="Full Name"
                autoFocus
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
              <TextField
                margin="normal"
                required
                fullWidth
                label="Email Address"
                type="email"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <TextField
                margin="normal"
                required
                fullWidth
                label="Password"
                type="password"
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{
                  mt: 3,
                  mb: 2,
                  backgroundColor: "#6366F1",
                  "&:hover": { backgroundColor: "#4F46E5" },
                }}
              >
                Sign Up
              </Button>
            </Box>
            <Typography variant="body2" color="text.secondary">
              Having an account?{" "}
              <Link
                to="/login"
                style={{ color: "#6366F1", textDecoration: "none" }}
              >
                Login here
              </Link>
            </Typography>
          </Box>
        </Container>
      </main>
    </div>
  );
};

export default SignupPage;
