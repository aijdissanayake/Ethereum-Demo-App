import React, { Component } from 'react';
import sampleContract from './sampleContract';
import web3 from './web3';
import './App.css';
const ethExplorerURL = "https://rinkeby.etherscan.io/";

class App extends Component {

  state = {
      currCelsiusTemp: '',
      currKelvinTemp : '',
      newTemp        : null,
      transactionHash: null ,
      transactionStatus : null,
      pending        :0
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
      await sampleContract.methods.updateTemperature(this.state.newTemp).send({from: accounts[0]}, 
      (error, transactionHash) => {
        //check errors from submitting transacrtions: rejection etc.
        if(error){
          console.log("Transaction was not sent");
          alert("Transaction was not sent!");
        }
        else{
          console.log(transactionHash);
          this.setState({transactionHash});
          this.setState({blockNumber:"Transaction is Pending"});
          this.setState({gasUsed:"Transcation is Pending"});
          this.setState({transactionStatus: "pending"})
        }        
      });
        // get Transaction Receipt
        web3.eth.getTransactionReceipt(this.state.transactionHash, (err, txReceipt)=>{
          console.log(err,txReceipt);
          this.setState({transactionStatus: "successful"});
          this.setState({txReceipt});
          this.setState({blockNumber: this.state.txReceipt.blockNumber});
          this.setState({gasUsed: this.state.txReceipt.gasUsed}); 
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

    if(!web3){
      alert("enable/inatsall metamask plugin and reload the page");
      return(
      <div style={{'paddingLeft' :'35%'}}> 
        <h3>No Web3 Provider Found!</h3>
        <h5>Web3 provider like <a href="https://metamask.io/">Metamask</a> is needed to use this app.</h5>
        <div>
          <li>Add the plugin/extension to your browser.</li>
          <li>Unlcok your ethereum Account Using the web3 provider.</li>
          <li>Reload the Page.</li>
        </div>
      </div>
      );
    }
    else{

      return (
        <div className="App container">
        <h1>Ethereum Demo App</h1>
        This Demo App Uses the SampleContract Deployed in Rinkeby Testnet at : <a href='https://rinkeby.etherscan.io/address/0xC0a310680B6717285C3644C3E552E361208df9E3#code' target="_blank">0xC0a310680B6717285C3644C3E552E361208df9E3</a>
        <hr/>
        <ul align='left'>
          <li>This is a basic example to get started with Ethereum DApp Development. </li>
          <li>This app doesn't really show an example use case of blockchain.</li>
          <li>Refresh Temperature buttons will just query the contract storage. No transacrtion will be initiated. </li>
          <li>Update Temperature will write to the contract storage. A Transaction will be intiated and it need to be mined to complete the updating process.</li>
        </ul>
        <hr/>
        <div className="row">
              <div className="col-sm-2 col-sm-offset-3"><input type="text" className="form-control" placeholder="Refresh to Fetch" value={this.state.currCelsiusTemp} disabled/></div>
              <div className="col-sm-3"><button type="submit" className="btn btn-primary" onClick={this.getCelsiusTemp}>Refresh Celsius Temperature</button></div>
        </div>
        <br/><br/>
        <div className="row">
              <div className="col-sm-2 col-sm-offset-3"><input type="text" className="form-control" placeholder="Refresh to Fetch" value={this.state.currKelvinTemp} disabled/></div>
              <div className="col-sm-3"><button type="submit" className="btn btn-primary" onClick={this.getKelvinTemp}>Refresh Kelvin&nbsp;&nbsp; Temperature</button></div>
        </div>
        <br/><br/>
        <div className="row">
              <div className="col-sm-2 col-sm-offset-3"><input type = "text" className="form-control" onChange = {this.setNewTempVal}/></div>
              <div className="col-sm-3"><button type="submit" className="btn btn-primary" onClick={this.setTemp}>Update Temperature(Celsius)</button></div>
        </div>
        <br/>
            {this.state.transactionHash?
            <div>
            <h4>Transaction is Initiated to set Temperature to {this.state.newTemp}. Transaction is {this.state.transactionStatus}!</h4>
            <table className="table table-bordered table-responsive">
                  <thead>
                    <tr>
                      <th>Transaction Detail</th>
                      <th>Value</th>
                    </tr>
                  </thead>
                
                  <tbody>
                    <tr>
                      <td>Transaction Hash </td>
                      <td>{this.state.transactionHash} {this.state.transactionHash?<a href={txViewURL} target="_blank">[View Transaction]</a>:""}</td>
                    </tr>

                    <tr>
                      <td>Block Number </td>
                      <td>{this.state.blockNumber}</td>
                    </tr>

                    <tr>
                      <td>Gas Used</td>
                      <td>{this.state.gasUsed}</td>
                    </tr>                
                  </tbody>
              </table>
            </div>
            : '' }
        </div>
      );
    }
  }
}

export default App;
