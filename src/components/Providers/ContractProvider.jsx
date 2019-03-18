import React from 'react';
import axios from "axios";
import web3 from "../../utils/web3.js";

export var ContractContext = React.createContext();

class ContractProvider extends React.Component {
  constructor(props) {
    super(props);

    this.accessContractFunction = async (contractInstance, functionName, value = 0) => {
      console.log("access contract in provider, function in question: ", functionName );
      console.log("value of the contract access function: ", value);
      let accounts =  await web3.eth.getAccounts();
      //contract address in instance: contractInstance.options.address
      let results;
      if(functionName !== 'deposit_funds'){
        console.log("no value to add for access contract function");
        results = await contractInstance.methods[functionName]()
        .send({
          from: accounts[0]//,
          //min transaction cost is 2100, then 4 gas for a zero byte, 68 gas for non-zeros
          //gas: '500000',
          //gasLimit: '500000'
        });
      }
      else{
        results = await contractInstance.methods[functionName]()
        .send({
          from: accounts[0],
          value: web3.utils.toWei(value, 'ether')
        });
      }
      console.log('access function in provider finished, result: ', results);
      return results;
    }

    this.accessContractFunctionWithArgs = async (contractInstance, functionName, args) => {
      console.log("access contract function with args accessed");
      let accounts =  await web3.eth.getAccounts();
      //testing arg params for number input, if so, converting to wei:
      for (var i = 0; i < args.length; i++){
         //if it starts with a period, needs to start with 0 to be converted to wei:
        if (args[i][0] === '.'){
            args[i] = '0' + args[i];
          }
        //-------------------------SUPER JANKY OPERATION TO COMPARE A NUMBER STRING TO ITSELF AND EXCLUDE ADDRESSES-----------------------------
        if(Number(args[i]).toString() === args[i].toString()){
          args[i] = web3.utils.toWei(args[i], 'ether');
        }
      }
      console.log("access contract with args ready, args preened: ", functionName, args);
      //need to destructure the ...args here so they are passed as literal args rather than an [Array]
      let results = await contractInstance.methods[functionName](...args)
        .send({
          from: accounts[0]
        });
      console.log('access function with args in provider finished, result: ', results);
      return results;
    }

    this.getFirstAccount = async () => {
      let accounts =  await web3.eth.getAccounts();
      return accounts[0];
    }
    this.accessContractViewFunction = async (contractInstance, functionName) => {
      console.log("view contract in provider, function in question: ", functionName );
      let accounts =  await web3.eth.getAccounts();
      //contract address in instance: contractInstance.options.address
      let results;
      results = await contractInstance.methods[functionName]()
      .call({
        from: accounts[0]//,
        //gas: '500000'
      });
      console.log('access function in provider finished, result: ', results);
      return results;
    }
    this.getContractsByAddress = async (publicAddress) => {
      if(!publicAddress){
        publicAddress = await this.getFirstAccount();
      }
      console.log("getting accounts by address: ", publicAddress);
      const getUser = process.env.REACT_APP_BACK_END_SERVER + 'getUser';
      let results = await axios.put(getUser, {publicAddress: publicAddress}).then(
        (res) => {
          console.log("result from getUser: ", res.data);
          if(!res.data.contracts){
            console.log("no contracts found");
            return 0;
          }
          else {
            console.log("returning contracts:", res.data.contracts);
            return res.data.contracts;
          }
        });
      return results;
    }
    this.state = {
      accessContractFunctionWithArgs : this.accessContractFunctionWithArgs,
      accessContractFunction : this.accessContractFunction,
      accessContractViewFunction : this.accessContractViewFunction,
      getFirstAccount: this.getFirstAccount,
      getContractsByAddress: this.getContractsByAddress,
      factory: {
        factoryContractAddress: '0x89C6f43180330A7Ce7F5c95c902eeC9930119778',
        factoryContractAbi: [
          {
            "anonymous": false,
            "inputs": [
              {
                "indexed": false,
                "name": "_newContract",
                "type": "address"
              },
              {
                "indexed": false,
                "name": "actionTo",
                "type": "address"
              },
              {
                "indexed": false,
                "name": "toDeposit",
                "type": "uint256"
              },
              {
                "indexed": false,
                "name": "action",
                "type": "string"
              }
            ],
            "name": "NewContract",
            "type": "event"
          },
          {
            "constant": false,
            "inputs": [
              {
                "name": "_depositor",
                "type": "address"
              },
              {
                "name": "_request_amount",
                "type": "uint256"
              }
            ],
            "name": "service_agreement",
            "outputs": [],
            "payable": false,
            "stateMutability": "nonpayable",
            "type": "function"
          }
        ],
        childAbi: {
          service_agreement: [
          {
            "inputs": [
              {
                "name": "_depositor",
                "type": "address"
              },
              {
                "name": "_creator",
                "type": "address"
              },
              {
                "name": "_request_amount",
                "type": "uint256"
              }
            ],
            "payable": false,
            "stateMutability": "nonpayable",
            "type": "constructor"
          },
          {
            "anonymous": false,
            "inputs": [
              {
                "indexed": false,
                "name": "depositor",
                "type": "address"
              },
              {
                "indexed": false,
                "name": "weiAmount",
                "type": "uint256"
              }
            ],
            "name": "Deposited",
            "type": "event"
          },
          {
            "anonymous": false,
            "inputs": [
              {
                "indexed": false,
                "name": "creator",
                "type": "address"
              },
              {
                "indexed": false,
                "name": "depositor",
                "type": "address"
              },
              {
                "indexed": false,
                "name": "action",
                "type": "string"
              }
            ],
            "name": "Destroyed",
            "type": "event"
          },
          {
            "anonymous": false,
            "inputs": [
              {
                "indexed": false,
                "name": "actionTo",
                "type": "address"
              },
              {
                "indexed": false,
                "name": "action",
                "type": "string"
              }
            ],
            "name": "NextAction",
            "type": "event"
          },
          {
            "anonymous": false,
            "inputs": [
              {
                "indexed": false,
                "name": "",
                "type": "bool"
              }
            ],
            "name": "FINISHED",
            "type": "event"
          },
          {
            "constant": false,
            "inputs": [],
            "name": "deposit_funds",
            "outputs": [],
            "payable": true,
            "stateMutability": "payable",
            "type": "function"
          },
          {
            "constant": false,
            "inputs": [],
            "name": "agree_upon_services_delivered",
            "outputs": [],
            "payable": true,
            "stateMutability": "payable",
            "type": "function"
          },
          {
            "constant": false,
            "inputs": [],
            "name": "withdraw_and_terminate_contract",
            "outputs": [],
            "payable": true,
            "stateMutability": "payable",
            "type": "function"
          },
          {
            "constant": false,
            "inputs": [],
            "name": "cancel",
            "outputs": [],
            "payable": true,
            "stateMutability": "payable",
            "type": "function"
          },
          {
            "constant": true,
            "inputs": [],
            "name": "get_balance",
            "outputs": [
              {
                "name": "",
                "type": "uint256"
              }
            ],
            "payable": false,
            "stateMutability": "view",
            "type": "function"
          },
          {
            "constant": true,
            "inputs": [],
            "name": "see_owner",
            "outputs": [
              {
                "name": "",
                "type": "address"
              }
            ],
            "payable": false,
            "stateMutability": "view",
            "type": "function"
          },
          {
            "constant": true,
            "inputs": [],
            "name": "see_depositor",
            "outputs": [
              {
                "name": "",
                "type": "address"
              }
            ],
            "payable": false,
            "stateMutability": "view",
            "type": "function"
          }
        ]},
        oracle: ''
      }
    };
  }


  render() {
    return (
      <ContractContext.Provider value={this.state}>
        {this.props.children}
      </ContractContext.Provider>
    );
  }
}

export default ContractProvider;
