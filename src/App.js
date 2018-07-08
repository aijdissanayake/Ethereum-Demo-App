import React, { Component } from 'react';
import {Grid, Button, Form } from 'react-bootstrap';
import sampleContract from './sampleContract';
import web3 from './web3';
import './App.css';
const ethExplorerURL = "https://rinkeby.etherscan.io/";

class App extends Component {

  state = {
      currCelsiusTemp: null,
      currKelvinTemp : null,
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
      <hr/>
      <Grid>
          <Form onSubmit={this.setTemp}>
            <input 
              type = "text"
              onChange = {this.setNewTempVal}
            />
             <Button 
             bsStyle="primary" 
             type="submit"> 
             Submit
             </Button>
          </Form>
          {this.state.transactionHash?<div>Tx Hash : {this.state.transactionHash} <a href={txViewURL} target="_blank"> [View Transaction]</a></div>:""}
          <Form onSubmit={this.getCelsiusTemp}>
             <Button 
             bsStyle="primary" 
             type="submit"> 
             Get Celsius Temperature
             </Button>
          </Form>
          {this.state.currCelsiusTemp? <div> Celsius Temperature: {this.state.currCelsiusTemp}</div> : "" }
          <Form onSubmit={this.getKelvinTemp}>
             <Button 
             bsStyle="primary" 
             type="submit"> 
             Get Kelvin Temperature
             </Button>
          </Form>
          {this.state.currKelvinTemp? <div> Celsius Temperature: {this.state.currKelvinTemp}</div> : "" }

      </Grid>
      </div>
    );
  }
}

export default App;
