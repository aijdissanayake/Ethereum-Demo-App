import web3 from './web3';

const address = '0xC0a310680B6717285C3644C3E552E361208df9E3';
const abi = [
	{
		"constant": true,
		"inputs": [
			{
				"name": "a",
				"type": "uint256"
			}
		],
		"name": "convertToKelvin",
		"outputs": [
			{
				"name": "",
				"type": "uint256"
			}
		],
		"payable": false,
		"stateMutability": "pure",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [],
		"name": "getCelciusTemperature",
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
		"constant": false,
		"inputs": [
			{
				"name": "celTemp",
				"type": "uint256"
			}
		],
		"name": "updateTemperature",
		"outputs": [],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [],
		"name": "getKelvinTemperature",
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
		"inputs": [
			{
				"name": "initialTemp",
				"type": "uint256"
			}
		],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "constructor"
	}
];

export default web3? new web3.eth.Contract(abi, address): null;
