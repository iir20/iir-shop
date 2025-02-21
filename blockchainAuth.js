class BlockchainAuth {
    constructor() {
        this.web3 = new Web3(Web3.givenProvider || 'ws://localhost:8545');
        this.contractAddress = '0x...';
        this.initContract();
    }

    async initContract() {
        const response = await fetch('/static/contract_abi.json');
        this.contractABI = await response.json();
        this.contract = new this.web3.eth.Contract(this.contractABI, this.contractAddress);
    }

    async registerUser(username) {
        const accounts = await this.web3.eth.getAccounts();
        const tx = await this.contract.methods.registerUser(username).send({from: accounts[0]});
        return tx;
    }

    async verifyUser() {
        const accounts = await this.web3.eth.getAccounts();
        return await this.contract.methods.verifyUser(accounts[0]).call();
    }
}