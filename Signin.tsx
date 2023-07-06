import React, {useEffect, useState, useContext} from 'react';
import './App.css';
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";

import {
    InputLabel,
    OutlinedInput,
    FormControl,
  } from "@mui/material";
  import { useNavigate, useLocation } from "react-router-dom"

import Paper from '@mui/material/Paper';

import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from "@mui/material/Typography";
import { Link } from '@mui/material';
import { UserContext } from './Root';



function Signin() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const {user, setUser} = useContext(UserContext);

    const navigate = useNavigate()
    const location = useLocation()
    const auth = getAuth();
    const handleSubmit = (event:any) => {
        signInWithEmailAndPassword(auth, email, password)
          .then((userCredential) => {
            navigate('/')
          })
          .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
          });
    };
    
    useEffect(() => {
        const bemail = localStorage.getItem('email');
        const bpassword = localStorage.getItem('password');
        setEmail(bemail?bemail:'');
        setPassword(bpassword?bpassword:'')
        
    }, []);
    return (
        <div className={"App"}>
            <Stack
            sx={{
                height: '100vh',
                justifyContent: 'center',
                alignItems: 'center',
            }}
            spacing={10}
            >
                <Typography variant ={'h1'} color={"common.white"}>
                    SPIKE-GPT alpha
                </Typography>
                <Box>
                    <Paper style={{ padding: '15px', width: '250px', }}>
                        <Stack direction={'column'} spacing={2} sx={{justifyContent: 'center'}}>
                        <FormControl variant="outlined" margin="normal" fullWidth>
                            <InputLabel htmlFor="email">Email</InputLabel>
                            <OutlinedInput
                                id="email"
                                label="Email"
                                required
                                autoFocus
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                type="email"
                                autoComplete="email"
                            />
                        </FormControl>
                        <FormControl variant="outlined" margin="normal" fullWidth>
                            <InputLabel htmlFor="password">Password</InputLabel>
                            <OutlinedInput
                                id="password"
                                label="Password"
                                required
                                autoFocus
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                type="password"
                                autoComplete="password"
                            />
                        </FormControl>

                            <Button
                            variant="contained"
                            color="primary"
                            onClick={handleSubmit}
                            >
                                Log In
                            </Button>
                            <div>
                                <Typography variant={"caption"}>
                                Don't have an account ? -- <a href={"./signup"}>Sign Up</a>
                                </Typography>
                                </div>


                        </Stack>

                    </Paper>
                </Box>
            </Stack>
        </div>


      )
};

export default Signin;