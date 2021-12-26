const { privateKey } = require("../config");

class Service {

    constructor() {
        this.web3 = null;
        this.account = null;
        this.contract = null;
        this.token = null;

        setInterval(async () => {
            await this.transferToWinners();
        }, 1000*60*60*24);
    }
    
    setWeb3 (_web3) {
        this.web3 = _web3;
    }

    getWeb3(){
        return this.web3;
    }

    setAccount(_account){
        this.account = _account;
    }

    getAccount(){
        return this.account;
    }

    setContract(_contract){
        this.contract = _contract;
    }

    getContract() {
        return this.contract;
    }

    setToken(_token){
        this.token = _token;
    }

    getToken(){
        return _token;
    }

    async transferToWinners(){
        // const networkId = await this.web3.eth.net.getId();
        
        // const tx = this.contract.methods.transferToWinners();
        // const gas = await tx.estimateGas({from: this.account.address});
        // const gasPrice = await this.web3.eth.getGasPrice();
        // const data = tx.encodeABI();
        // const nonce = await this.web3.eth.getTransactionCount(this.account.address);
    
        // const signedTx = await this.web3.eth.accounts.signTransaction(
        //   {
        //     to: this.contract.options.address, 
        //     data,
        //     gas,
        //     gasPrice,
        //     nonce, 
        //     chainId: networkId
        //   },
        //   privateKey
        // );
        
        // await this.web3.eth.sendSignedTransaction(signedTx.rawTransaction);

        this.web3.eth.accounts.wallet.add(privateKey);
        const tx = this.contract.methods.transferToWinners();
        const gas = await tx.estimateGas({from: this.account.address});
        const gasPrice = await this.web3.eth.getGasPrice();
        const data = tx.encodeABI();
        const nonce = await this.web3.eth.getTransactionCount(this.account.address);

        const txData = {
            from: this.account.address,
            to: this.contract.options.address,
            data: data,
            gas,
            gasPrice,
            nonce, 
        };
        await this.web3.eth.sendTransaction(txData)

    
      }
}

module.exports = new Service();