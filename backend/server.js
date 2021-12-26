const express = require("express");
const bodyParser = require("body-parser");
const http = require('http');
const cors = require("cors");
const Web3 = require('web3')

const service = require("./app/service");
const { tokenABI, tokenAddress, contractABI, contractAddress, privateKey } = require("./app/config");


const app = express();

var corsOptions = {
  origin: "*"
};

app.use(cors(corsOptions));

// parse requests of content-type - application/json
app.use(bodyParser.json());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

(async () => {

  try{
  // const web3 = new Web3(new Web3.providers.HttpProvider('https://data-seed-prebsc-1-s1.binance.org:8545'));
    // const web3 = new Web3(new Web3.providers.HttpProvider(`https://rinkeby.infura.io/v3/21e6bcc402cc4195aaffb188e72f758a`));
    const web3 = new Web3(new Web3.providers.HttpProvider(`https://api.avax-test.network/ext/bc/C/rpc`));
    const account = web3.eth.accounts.privateKeyToAccount(privateKey)

    service.setWeb3(web3);
    service.setAccount(account);
    let balance = await web3.eth.getBalance(account.address)
    
    var token = new web3.eth.Contract(tokenABI, tokenAddress);
    service.setToken(token);

    balance = await token.methods.balanceOf(account.address).call();
    var contract = new web3.eth.Contract(contractABI, contractAddress);
  
    service.setContract(contract)

    console.log(balance)

  }catch(evt) {
    console.log(evt)
  }
  
 
})()

// routes
require("./app/routes/client.routes")(app);

const server = http.createServer(app);
// set port, listen for requests
const PORT = process.env.PORT || 6430;

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});
