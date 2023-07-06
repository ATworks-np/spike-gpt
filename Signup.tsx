import React, {useEffect, useState, useContext} from 'react';
import './App.css';
import { getAuth, sendSignInLinkToEmail, createUserWithEmailAndPassword } from "firebase/auth";

import {
    InputLabel,
    OutlinedInput,
    FormControl,
    FormHelperText,
  } from "@mui/material";
  import { useNavigate, useLocation} from "react-router-dom"

import Paper from '@mui/material/Paper';

import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from "@mui/material/Typography";
import { Link } from '@mui/material';
import { UserContext } from './Root';

import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';



function Signup() {
    const [email, setEmail] = useState('');
    const [emailError, setEmailError] = useState(false);
    const [password, setPassword] = useState('');
    const [comfirmPassword, setComfirmPassword] = useState('');
    const [passwordError, setPasswordError] = useState(false);
    const {user, setUser} = useContext(UserContext);

    const [open, setOpen] = useState(false);

    const navigate = useNavigate()

    const handleSubmit = async(event:any) => {
        if(!email.includes('@')) setEmailError(true);
        if(password===''||comfirmPassword==='')setPasswordError(true);
        if(password!==comfirmPassword) setPasswordError(true);
        if(emailError||passwordError) return 0;
        try {
            const auth = getAuth()
            createUserWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                const user = userCredential.user;
                navigate('/');
            })
            .catch((error) => {
                alert('Internal error');
            });
          console.log('Signup successful');
        } catch (error) {

        }
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
                                error={emailError}

                                onChange={(e) => setEmail(e.target.value)}
                                type="email"
                                autoComplete="email"
                            />
                            {emailError && <FormHelperText error>Email is not valid.</FormHelperText>}
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
                            />
                        </FormControl>
                        <FormControl variant="outlined" margin="normal" fullWidth>
                            <InputLabel htmlFor="password">Confirm Password</InputLabel>
                            <OutlinedInput
                                id="password"
                                label="Confirm Password"
                                required
                                autoFocus
                                value={comfirmPassword}
                                onChange={(e) => setComfirmPassword(e.target.value)}
                            />
                            {passwordError && <FormHelperText error>Passwords do not match.</FormHelperText>}
                        </FormControl>

                            <Button
                            variant="contained"
                            color="primary"
                            onClick={handleSubmit}
                            >
                                Sign Up
                            </Button>
                        </Stack>

                    </Paper>
                </Box>
            </Stack>
        </div>


      )
};

export default Signup;