import React, { useState } from 'react';
import './App.css';

import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import TextField from '@mui/material/TextField';
import Stack from '@mui/material/Stack';
import IconButton from '@mui/material/IconButton';
import SendIcon from '@mui/icons-material/Send';
import Select from '@mui/material/Select';
import Modal from '@mui/material/Modal';
import MenuItem from '@mui/material/MenuItem';
import CircularProgress from '@mui/material/CircularProgress';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box'
import Typography from "@mui/material/Typography";
import { getApp } from "firebase/app";
import { getFunctions, connectFunctionsEmulator, httpsCallable, HttpsCallableResult} from "firebase/functions";
import {Container} from "@mui/material";

import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

import Header from "./Header";
import {useNavigate} from "react-router-dom";

function App() {
    const [open, setOpen] = React.useState(true);
    const [dialog_open, setDialogOpen] = React.useState(false);
    const [message, setMessage] = useState([]);
    const [port, setPort] = useState(null);
    const [text, setText] = useState("3秒間ゆっくり前進して停止してください")
    const [selectedValue, setSelectedValue] = useState('');
    const [responseWaiting, setResponseWaiting] = useState(false);
    const textEncoder = new TextEncoder();
    const [command, setCommand] = useState([]);
    const [is_running, setIsRunning] = useState(false);

    const navigate = useNavigate();
    const handleChange = (event) => {
        setSelectedValue(event.target.value);
    };

    const functions = getFunctions(getApp(), "asia-northeast1");

    // if (true) {
    //     connectFunctionsEmulator(functions, "localhost", 5001);
    // }
    const helloWorld = httpsCallable(functions,'helloWorld');
    const S = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

    const serial_read = '';

    const doCommand = async(commands, writer, index) =>{
        if(index >= commands.length) {
            writer.close();
            setIsRunning(false);
            return 0
        };
        const command = commands[index];
        const command_name = command.slice(0, command.indexOf('('));
        const command_value = command.slice(command.indexOf('(')+1, command.indexOf(')'))
        const command_i = Array.from(Array(4)).map(()=>S[Math.floor(Math.random()*S.length)]).join('');
        console.log(command_name, command_value);
        if(command_name ===  'motor_start_l'){
            const buf = JSON.stringify({i:command_i, m: "scratch.motor_start", p: { port:"A", speed: -parseFloat(command_value)/970*100, stall: true}});
            await writer.write(textEncoder.encode(buf+"\n\r"))
            doCommand(commands, writer, index + 1);
        }else if(command_name ===  "motor_start_r"){
            const buf = JSON.stringify({i:command_i, m: "scratch.motor_start", p: { port:"B", speed: parseFloat(command_value)/970*100, stall: true}});
            await writer.write(textEncoder.encode(buf+"\n\r"))
            doCommand(commands, writer, index + 1);
        }else if(command_name === 'sleep'){
            setTimeout(() => doCommand(commands, writer, index + 1), parseFloat(command_value)*1000);
        }else{
            alert('An error ocured')
            writer.close();
            setIsRunning(false);
            return 0
        }
    };
    const runCommands =  async (commands) => {
        const writer = port.writable.getWriter();
        doCommand(commands, writer, 0);
    }
    return (
        <div>
                    <header>
                <Header></Header>
            </header>
        <div className="App">
            <Modal
              open={open}
              aria-labelledby="modal-modal-title"
              aria-describedby="modal-modal-description"
            >
                <Container sx={{  position: 'absolute',
                    top: '50%',
                    left: '50%',
                    height: '80%',
                    width: '80%',
                    transform: 'translate(-50%, -50%)',
                    backgroundColor: '#CCCCFF',
                    //display: 'flex', justifyContent: 'center', alignItems: 'center',flexDirection: 'column',
                    padding: '10px',
                    overflow: 'auto'

                }}>
                    {/*<Container sx={{*/}
                    {/*    //backgroundColor: '#FFAAAA',*/}
                    {/*    height: '100%',*/}
                    {/*    width: '100%',*/}
                    {/*    overflow: 'auto'*/}
                    {/*}}>*/}
                            <Stack spacing={3}>
                                <Typography color="common.white" variant={'h3'}>
                                    Welcome to SPIKE-GPT alpha !
                                </Typography>
                                <Typography color="common.white" variant={'body'}>
                                    1. Assemble according to the following model
                                </Typography>
                                <img src={'/SPIKE.png'} width={'200'}/>
                                <Typography color="common.white" variant={'body'}>
                                    2. Please pair SPIKE prime with your PC via Bluetooth or USB cable. (Install ver. 2 on SPIKE prime)
                                </Typography>
                                <Typography color="common.white" variant={'body'}>
                                    3. Connect. (Select COM port.)
                                </Typography>
                                <Button
                                    sx={{width:'200px'}}
                                    variant="contained"
                                    disabled = {port}
                                    onClick={async ()=>{
                                        try {
                                            const ser = await navigator.serial.requestPort();
                                            await ser.open({ baudRate: 115200 });
                                            ser.addEventListener('disconnect', () => {
                                                ser.close();
                                                alert('SPIKEが切断されました');
                                                setPort(null);
                                                setOpen(true);
                                            });

                                            const reader = ser.readable.getReader();

                                            const handleData = async () => {
                                              while (true) {
                                                const { value, done } = await reader.read();
                                                if (done) {
                                                  // リーダーが終了した場合の処理
                                                  break;
                                                }
                                                // 受信したデータに対する処理
                                                const asciiString = String.fromCharCode(...value);
                                                if(asciiString.includes('')) {
                                                }else if(asciiString.includes(']')) {
                                                }else{

                                                }
                                                console.log(asciiString);
                                              }
                                            };

                                            handleData();


                                            const writer = ser.writable.getWriter();
                                            const start_ser = async() => {
                                                await writer.write(textEncoder.encode('{"i": "xxxx", "m": "program_modechange", "p": {"mode": "play"}}\n\r'));
                                                await writer.close();
                                                setPort(ser);
                                            };
                                            setTimeout(start_ser, 1000)
                                        }catch (error) {
                                            console.error('Failed to connect to serial port', error);
                                        }

                                    }}>
                                    Connect to SPIKE
                                </Button>
                                <Typography color="common.white" variant={'body'}>
                                    4. Start SPIKE-GPT !
                                </Typography>
                                <Button
                                    variant="contained"
                                    disabled = {!port}
                                    onClick={()=>setOpen(false)}
                                    sx={{width:'100px'}}
                                >
                                    start
                                </Button>
                            </Stack>
                    {/*</Container>*/}

                </Container>

            </Modal>
            <Container sx={{display: 'flex',flexDirection: 'column', paddingTop: '5%', paddingBottom: '5%', height:'100%'}}>
                <Container sx={{width: '100%', height:'50px', display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
                    <Typography color="common.white" variant={'h5'}>
                        SPIKE-GPT alpha
                    </Typography>
                </Container>
                <Container sx={{flexGrow: 1,  overflow: 'auto', padding: '10px'}}>
                    <Box sx={{height:'100%', width: '100%', overflow: 'auto', display: 'flex',flexDirection: 'column-reverse'}}>
                        {message.slice().reverse().map((element, index) => {
                          return (
                            <Container sx={{padding: '10px', backgroundColor: element.role=='user'?'#8997b2':'#4e5666'}}>
                                <Typography　component="p" color="common.white">
                                    {element.content.split('\n').map(str => {
                                      return(<>{str}<br/></>)
                                    })}
                                </Typography>
                                {element.role==='assistant'?
                                    (is_running?<CircularProgress />:<Button disabled = {!element.commands || !port || responseWaiting} variant="contained" onClick={()=>{setIsRunning(true);runCommands(element.commands)}}>
                                    RUN
                                </Button>):null}
                            </Container>
                          )
                      })}
                    </Box>
                </Container>
                <Container sx={{width: '100%', height:'100px', display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
                    <Stack sx={{width: '100%'}} direction="row"  spacing={3} alignItems="center">
                        <FormControl variant="filled" sx={{ m: 1, minWidth: 80 }}>
                            <InputLabel id="demo-simple-select-standard-label">Lang.</InputLabel>
                            <Select label="Language" value={selectedValue} onChange={handleChange}>
                                {/*<MenuItem value="option1">en</MenuItem>*/}
                                <MenuItem value="option2">jp</MenuItem>
                            </Select>
                        </FormControl>
                        <TextField value = {text} onChange = {(event) =>setText(event.target.value)} fullwidth sx={{ width: '100%' }} id="outlined-basic" label="Send order" variant="outlined" />
                        <IconButton
                            aria-label="delete"
                            size="small"
                            disabled = {responseWaiting || text===''}
                            onClick = {() => {
                                let buf = [...message, {role:'user', content:text}]
                                setMessage(buf)
                                setResponseWaiting(true);
                                helloWorld(text).then((result) => {
                                    setText('');
                                    const data = result.data;
                                    if(data.content.includes('【コマンド】') && data.content.includes('【解説】')){
                                        let command = data.content.split('\n');
                                        const index_s = command.indexOf('【コマンド】');
                                        const index_e = command.indexOf('【解説】');

                                        buf = [...buf, {...data, commands: command.slice(index_s+1, index_e-1)}]
                                        console.log(buf)
                                    }else{
                                        buf = [...buf, {role:'assistant', content:'回答不可', commands: null}]
                                    }
                                    setMessage(buf)
                                    setResponseWaiting(false);
                                }).catch(()=>{
                                    alert("何らかのエラーが発生しました");
                                    setResponseWaiting(false);
                                    setMessage([...message, {role:'assistant', content:'エラーのため回答できませんでした', commands: null}])
                                })
                            }}>
                            {!responseWaiting ? <SendIcon fontSize={"large"}/> : <CircularProgress />}
                        </IconButton>
                    </Stack>
                </Container>
            </Container>
        </div>
                    </div>
    );
}

export default App;
