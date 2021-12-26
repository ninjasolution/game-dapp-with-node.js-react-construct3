import React from 'react'
import { useState, useEffect } from 'react'
import BigNumber from 'big-number'
import Web3 from 'web3'
import { contractABI, contractADDRESS, tokenABI, tokenADDRESS } from './config';
import { useNavigate } from "react-router-dom"
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import LoadingOverlay from 'react-loading-overlay';
import swal from "sweetalert";
import {CopyToClipboard} from 'react-copy-to-clipboard';

const theme = createTheme();

export default function Home() {
    const [ web3, setWeb3 ] = useState(null)
    const navigate = useNavigate();
    const [ address, setAddress ] = useState('Connect');
    const [ startIsDisable, setStartIsDisable ] = useState(true);
    const [isActive, setIsActive] = useState(false);
    const [copyButtonText, setCopyButtonText] = useState('Copy to clipboard')
    const [clipBoard, setClipBoard] = useState('')

    useEffect(() => {
  
      window.ethereum.enable().then((res)=> {
        window.account = res[0]
        setAddress(res[0])
      });
      setWeb3(new Web3(Web3.givenProvider || 'https://api.avax-test.network/ext/bc/C/rpc'));
  
    }, [])
  
    const  onConnect = async () => {
      window.contract = new web3.eth.Contract(contractABI, contractADDRESS);
      window.balance = await window.contract.methods.balanceOf(window.account).call();

      if(window.balance < 10*Math.pow(10, 18)) {
        swal("Oops", "Please check your balance or network.", "error");
        return;
      }
      setStartIsDisable(false)
      console.log(window.balance)
    }
    
    const onGameStart = async () => {
        if(window.account) {
           setIsActive(true)
            var tokenContract = new web3.eth.Contract(tokenABI, tokenADDRESS);
            const decimals = await tokenContract.methods.decimals().call();
            console.log(decimals, window.balance)
            if(window.balance >= 10*Math.pow(10, decimals)) {

                await tokenContract.methods.approve(contractADDRESS, BigNumber(10*Math.pow(10, decimals))).send({from : window.account});
                await window.contract.methods.deposit(10).send({ from: window.account });
                
                console.log(window.contract)

                const bestScore = await window.contract.methods.getBestScore().call();
                console.log(bestScore, '------score');
                setIsActive(false)
                navigate("/game", { replace: true })
            }
        }
    }

    const onCopy = () => {
      setClipBoard(tokenADDRESS)
      setCopyButtonText("Is copied");
    }
  
    return (
      <ThemeProvider theme={theme}>
         <LoadingOverlay
            active={isActive}
            spinner
            text='Loading...'
            styles={{
              wrapper: {
                width: '100%',
                height: '100%',
                overflow: isActive ? 'hidden' : 'scroll'
              },
            }}
            >
          <Grid container component="main" sx={{ height: '100vh' }}>
            <CssBaseline />
            <Grid
              item
              xs={false}
              sm={4}
              md={7}
              sx={{
                backgroundImage: 'url(./gameBG.jpeg)',
                backgroundRepeat: 'no-repeat',
                backgroundColor: (t) =>
                  t.palette.mode === 'light' ? t.palette.grey[50] : t.palette.grey[900],
                backgroundSize: 'cover',
                backgroundPosition: 'center',
              }}
            />
            <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square>
              <Box
                sx={{
                  my: 8,
                  mx: 4,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                }}
              >
                
                <Typography component="h1" variant="h5">
                  Our token address
                </Typography>

                <Button
                  fullWidth
                  variant="secondary"
                  sx={{ mt: 3, mb: 2 }}
                >
                  { tokenADDRESS }
                </Button>
                <CopyToClipboard text={clipBoard}
                  onCopy={onCopy}>
                  <Button
                    fullWidth
                    variant="contained"
                    sx={{ mt: 3, mb: 2 }}
                  >
                    {copyButtonText}
                  </Button>
                </CopyToClipboard>

                <Button
                  fullWidth
                  variant="contained"
                  sx={{ mt: 3, mb: 2 }}
                  onClick={onConnect}
                >
                  Connect with Metamask
                </Button>
               
                
                <Button
                  
                  fullWidth
                  variant="contained"
                  sx={{ mt: 3, mb: 2 }}
                  onClick={onGameStart}
                  disabled={startIsDisable}
                >
                  Start Game
                </Button>

              </Box>
            </Grid>
          </Grid>
        </LoadingOverlay>
      </ThemeProvider>
    )
}
