import React, {useEffect, useState, useContext} from 'react';
import './App.css';
import { getAuth, signOut } from "firebase/auth";

import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Grid from "@mui/material/Unstable_Grid2";
import Button from "@mui/material/Button";
import {useNavigate} from "react-router-dom";

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: 'center',
  color: theme.palette.text.secondary,
}));
function Header() {
    const auth = getAuth();
    const navigate = useNavigate()
    return (
        <div className={'Header'}>
            <Grid container spacing={2}>
              <Grid xs={2}>
                  <img src={'ATworks_dark.png'} alt={"atworks logo"} width="150"/>
              </Grid>
              <Grid xs={8}>
              </Grid>
              <Grid xs={2} >
                  <Button
                      variant="contained"
                      color="primary"
                      onClick={()=>{
                        signOut(auth).then(() => {
                          navigate('/signin')
                        }).catch((error) => {
                          // An error happened.
                        });
                      }}>
                      Sign Out
                  </Button>
              </Grid>
            </Grid>
        </div>
    )
}

export  default  Header