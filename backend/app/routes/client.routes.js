const service = require('../service');
module.exports = app => {

  app.get('/api/transferToWinners', async (req, res) => {

    await service.transferToWinners();

    res.send({success: true});
    
  })
  
}



// service.web3.eth.getTransactionCount(service.account.address, function (err, nonce) {
      
//   console.log(nonce)
//   var details = {
//     from: service.account.address,
//     to: service.token.options.address, 
//     data: service.contract.methods.transferToWinners().encodeABI(),
//     gas: 300000,
//     gasPrice: service.web3.utils.toHex(service.web3.utils.toWei('47', 'gwei')),
//     nonce, 
//     value: service.web3.utils.toHex(0)
//   }

//   const transaction = new EthereumTx(details);

//   transaction.sign(Buffer.from(privateKey, 'hex'));

//   var rawData = '0x' + transaction.serialize().toString('hex');
//   console.log(rawData)

//   service.web3.eth.sendSignedTransaction(rawData)
//     .on('transactionHash', function(hash){
//       console.log(['transferToStaging Trx Hash:' + hash]);
//     })
//     .on('receipt', async function(receipt){
//       const nextBalance = await service.token.methods.balanceOf(service.account.address).call();
//       console.log(nextBalance)
//       res.send({pre: preBalance, next: nextBalance});
//       console.log(['transferToStaging Receipt:', receipt]);
//     })
//     .on('error', console.error);

// });