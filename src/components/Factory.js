import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import web3 from "../utils/web3.js";
import CircularProgress from '@material-ui/core/CircularProgress';
import axios from 'axios';
import _ from 'lodash';
let price = require('crypto-price')

let factory;

const styles = theme => ({
  root: {
    width: '90%',
  },
  button: {
    marginTop: theme.spacing.unit,
    marginRight: theme.spacing.unit,
  },
  actionsContainer: {
    marginBottom: theme.spacing.unit * 2,
  },
  resetContainer: {
    padding: theme.spacing.unit * 3,
  },
  textField: {
    marginLeft: theme.spacing.unit,
    marginRight: theme.spacing.unit,
  },
  dense: {
    marginTop: 16,
  },
  menu: {
    width: 200,
  },
});

class Factory extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      toAddress: '',
      loading: false,
      deployedContractAddress: '',
      contractAddress: '',
      constructorArgs: [],
      weiAmount: '',
      price: []
    };
  }

  componentWillMount = async () => {
    console.log("props at factory component mount: ", this.props)
    factory = await new web3.eth.Contract(this.props.factoryContractAbi, this.props.factoryContractAddress);
    console.log("factory contract created, ", factory);
  }
  constructorArguments = () => {
    console.log("constructor arguments accessed, ", this.props.factoryContractAbi);
    //loops through factory ABI and shows a text field with the proper placeholder
    for (var i = 0; i < this.props.factoryContractAbi.length; i++){
      if(this.props.factoryContractAbi[i].name === this.props.contractType){
        return this.props.factoryContractAbi[i].inputs.map((input, key) => {
          let type = "text";
          if (input.type === "uint256") {type = "number"}
          return <div>
            <TextField
            id="outlined-name"
            margin="normal"
            variant="outlined"
            key={key}
            type={type}
            placeholder={_.startCase(_.toLower(input.name))}
            value={this.state.constructorArgs[key]}
            onChange={e => this.handleInput(e, key)}
            />
            {type === "number" ? <p>Value in dollars: {this.state.price[key]}</p> : null}
            <br/>
          </div>
        });
      }
    }
  }
  handleInput = async (e, key) => {
    //assign old input to new arg to keep value
    let constructorArgs = this.state.constructorArgs;
    let prices = this.state.price;
    // switch values to what user is inputting
    constructorArgs[key] = e.target.value;
    let number = Number(e.target.value);
    let amount = await price.getCryptoPrice('USD', 'ETH').then(obj => {
        return number * obj.price;
    }).catch(err => {
        console.log(err)
    });
    prices[key] = amount.toString();
    //set that back to args to pass the constructor
    //NOTE!!! WEI CONVERSIONS ARE HANDLED IN THE PROVIDER
    this.setState({
      constructorArgs: constructorArgs,
      price: prices
    });
  }

  accessContractFunction = async () => {
    this.setState({
      loading: true
    });
    let results = await this.props.utilities.accessContractFunctionWithArgs(factory, this.props.contractType, this.state.constructorArgs);
    this.setState({
      loading: false,
      deployedContractAddress: results.events.NewContract.returnValues._newContract,
      results: results
    });
    const contractRoute = process.env.REACT_APP_BACK_END_SERVER + 'contract';
    //{toAddress, fromAddress, actionNeeded, action}
    let actionFrom = await this.props.utilities.getFirstAccount();
    axios.put(contractRoute, {
      actionFrom: actionFrom, 
      actionTo: results.events.NewContract.returnValues.actionTo,
      contractAddress: this.state.deployedContractAddress,
      abi: this.props.deployedFactoryContractAbi,
      depositedValue: results.events.NewContract.returnValues.toDeposit,
      action: results.events.NewContract.returnValues.action
    }).then(
      (res) => {
        console.log("contractRoute access complete, ", res);
      });
    
  }
  render() {
    const { classes } = this.props;

    return (
      <div>
      <div className={classes.root}>
      <p>Use this button to deploy a simple escrow with the depositor as the address in this field:</p>
        {this.constructorArguments()}
        <Button
          variant="contained"
          color="primary"
          onClick={this.accessContractFunction}
          className={classes.button}
        >
          Deploy Contract
        </Button>
      </div>
      {this.state.loading ?  <CircularProgress className={classes.progress} /> : <p>Example addresses (2): 0x59001902537Fa775f2846560802479EccD7B93Af
        or 0x72BA71fBB2aAdf452aE63AFB2582aA9AE066eAA0 (1)
      </p>}
      
      <p>See deployed contract address here:
      {this.state.deployedContractAddress  ? this.state.deployedContractAddress : null}</p>
      </div>
    );
  }
}

Factory.propTypes = {
  classes: PropTypes.object,
};

export default withStyles(styles)(Factory);
