import React, { Component } from 'react';
import {Grid, Button, Form } from 'react-bootstrap';
import sampleContract from './sampleContract';
import web3 from './web3';
import './App.css';
const ethExplorerURL = "https://rinkeby.etherscan.io/";

class App extends Component {

  state = {
      currCelsiusTemp: '',
      currKelvinTemp : '',
      newTemp        : null,
      transactionHash: null
  };

  setNewTempVal = (event) => {
    event.stopPropagation();
    event.preventDefault();
    const newTemp = event.target.value;
    console.log(newTemp);
    this.setState({newTemp});
  }

  setTemp = async(event) =>{
    event.preventDefault();
    //bring in user's metamask account address
    const accounts = await web3.eth.getAccounts();
    const defaultAccount = accounts[0];

    if(defaultAccount && this.state.newTemp){
      console.log('Sending from Metamask account: ' + accounts[0]);
      await sampleContract.methods.updateTemperature(this.state.newTemp).send({
        from: accounts[0] 
      }, (error, transactionHash) => {
        //check errors from submitting transacrtions: rejection etc.
        if(error){
          console.log("Transaction was not sent");
          alert("Transaction was not sent!");
        }
        else{
        console.log(transactionHash);
        alert("Transaction was successful. TxHash : " + transactionHash);
        this.setState({transactionHash});
        }
      });
    }
    else{
      if(!this.state.newTemp){
        alert("Enter a value first!");
        return;
      }
      alert("You need to Unlcok an account first to send transactions!");
    } 

  }

  getCelsiusTemp = async(event) =>{
    event.preventDefault();
    this.setState({currCelsiusTemp: 'fetching from rinkeby...'});
    console.log("getting Celsius temperature");
    await sampleContract.methods.getCelciusTemperature().call((error, temp) => {
      if(error){
        console.log(error);
      }
      else{
        console.log("temp");
        console.log(temp);
        this.setState({currCelsiusTemp: temp});
      }
    });
  }

  getKelvinTemp = async(event) =>{
    event.preventDefault();
    this.setState({currKelvinTemp: 'fetching from rinkeby...'});
    console.log("getting Kelvin temperature");
    await sampleContract.methods.getKelvinTemperature().call((error, temp) => {
      if(error){
        console.log(error);
      }
      else{
        console.log("temp");
        console.log(temp);
        this.setState({currKelvinTemp: temp});
      }
    });
  }

  render() {
    const txViewURL = ethExplorerURL + "tx/" + this.state.transactionHash;

    return (
      <div className="App">
      <h1>Ethereum Demo App</h1>
      This Demo App Uses the SampleContract Deployed in Rinkeby Testnet at : <a href='https://rinkeby.etherscan.io/address/0xC0a310680B6717285C3644C3E552E361208df9E3#code' target="_blank">0xC0a310680B6717285C3644C3E552E361208df9E3</a>
      <hr/>
      <ul align='left'>
        <li>This is a basic example to get started with Ethereum DApp Development. </li>
        <li>This doesn't show an example use case of blockchain.</li>
        <li>Refresh Temperature buttons will just query the contract storage. No transacrtion will be initiated. </li>
        <li>Update Temperature will write to the contract storage. A Transaction will be intiated and it need to be mined to complete the updating process.</li>
      </ul>
      <hr/>
      <Grid>
          <br/>
          <Form onSubmit={this.getCelsiusTemp}>
            <input 
              type = "text"
              disabled
              value={this.state.currCelsiusTemp}
            />
             <Button 
             bsStyle="primary" 
             type="submit"> 
             Refresh Celsius Temperature
             </Button>
          </Form>
          {/* {this.state.currCelsiusTemp? <div> Celsius Temperature: {this.state.currCelsiusTemp}</div> : "" } */}
          <br/>
          <Form onSubmit={this.getKelvinTemp}>
            <input 
              type = "text"
              value={this.state.currKelvinTemp}
              disabled
            />
             <Button 
             bsStyle="primary" 
             type="submit"> 
             Refresh Kelvin&nbsp;&nbsp; Temperature
             </Button>
          </Form>
          {/* {this.state.currKelvinTemp? <div> Kelvin Temperature: {this.state.currKelvinTemp}</div> : "" } */}
          <br/>
          <Form onSubmit={this.setTemp}>
            <input
              type = "text"
              onChange = {this.setNewTempVal}
            />
             <Button 
             bsStyle="primary" 
             type="submit"> 
             Update Temperature(Celsius)
             </Button>
          </Form>
          {this.state.transactionHash?<div>Tx Hash : {this.state.transactionHash} <a href={txViewURL} target="_blank"> [View Transaction]</a></div>:""}
      </Grid>
      </div>
    );
  }
}

export default App;
