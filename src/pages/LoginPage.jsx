import { useState, useEffect } from "react";
import { Button, TextField, Container, Typography, Box } from "@mui/material";
import Header from "./../components/common/Header";
import { Link, useNavigate } from "react-router-dom";
import { toast } from 'react-toastify';
import axios from 'axios'; 

const LoginPage = ({ onLogin }) => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        if (isLoggedIn) {
            navigate('/sales');  
        }
    }, [isLoggedIn, navigate]);

    const handleLogin = async (e) => {
        e.preventDefault();  
        if (validate()) {
            try {
                const resp = await fetchUser(email);
                if (!resp || resp.length === 0) {
                    toast.error('Please enter a valid email');
                } else {
                    const user = resp[0];
                    if (user.password === password) {
                        toast.success('Login successful');
                        onLogin(); 
                        navigate('/sales'); 
                    } else {
                        toast.error('Invalid credentials, please try again');
                    }
                }
            } catch (err) {
                toast.error('Login failed: ' + err.message);
            }
        }
    };

    const fetchUser = async (email) => {
        try {
            const response = await axios.get(`http://localhost:5000/users`, {
                params: { email: email } 
            });
            return response.data; 
        } catch (error) {
            throw new Error('Network response was not ok' + error.message);
        }
    };

    const validate = () => {
        let result = true;
        if (email === '' || email === null) {
            result = false;
            toast.warning('Please enter your email');
        }
        if (password === '' || password === null) {
            result = false;
            toast.warning('Please enter your password');
        }
        return result;  
    };

    return (
        <div className='flex-1 overflow-auto relative z-10 '
        style={{ 
            background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)', 
            minHeight: '100vh',
            justifyContent: 'center',
            display: 'flex',
            alignItems: 'center'
        }} >
            {/* <Header title='Login' style={{ color: 'black' }} /> */}
            <main className='max-w-7xl mx-auto py-6 px-4 lg:px-8'>
                <Container component="main" maxWidth="xs">
                    <Box
                        sx={{
                            marginTop: 8,
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            backgroundColor: 'rgba(255, 255, 255)', 
                            borderRadius: 2,
                            padding: 3,
                            boxShadow: 3,
                        }}
                    >
                        <Typography component="h1" variant="h5" style={{ color: 'black' }}>
                            Login
                        </Typography>
                        <Box component="form" onSubmit={handleLogin} sx={{ mt: 1 }}>
                            <TextField
                                margin="normal"
                                required
                                fullWidth
                                type="email"
                                autoComplete="email"
                                placeholder="Email address"
                                value={email}
                                onChange={e => setEmail(e.target.value)}
                            />
                            <TextField
                                margin="normal"
                                required
                                fullWidth
                                placeholder="Password"
                                type="password"
                                autoComplete="current-password"
                                value={password}
                                onChange={e => setPassword(e.target.value)}
                            />
                            <Button
                                type="submit"
                                fullWidth
                                variant="contained"
                                sx={{ mt: 3, mb: 2, backgroundColor: '#1976d2', '&:hover': { backgroundColor: '#115293' } }}
                            >
                                Login
                            </Button>
                        </Box>
                        {/* <Typography variant="body2" color="text.secondary">
                            New User?{" "}
                            <Link to="/signup" 
                            style={{ color: '#fefefe', textDecoration: 'none' }}
                                onMouseOver={(e) => e.target.style.color = 'black'}
                                onMouseOut={(e) => e.target.style.color = '#fefefe'}>
                                Signup here
                            </Link>
                        </Typography> */}
                    </Box>
                </Container>
            </main>
        </div>
    );
};

export default LoginPage;
