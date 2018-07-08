//deployed in Rinkeby TestNet at 0xC0a310680B6717285C3644C3E552E361208df9E3

pragma solidity ^0.4.24;


contract SampleContract{

    uint currentCelsiusTemperature;
    
    constructor(uint initialTemp) public{
        currentCelsiusTemperature = initialTemp;
    }

    function convertToKelvin(uint a) public pure returns(uint){
        return a + 273 ;
    }

    function updateTemperature(uint celTemp) public{
        currentCelsiusTemperature = celTemp;
     
    }
    
    function getCelciusTemperature() public view returns(uint){
        return currentCelsiusTemperature;
    }
    
    function getKelvinTemperature() public view returns(uint){
        uint kelvinTemp = convertToKelvin(currentCelsiusTemperature);
        return kelvinTemp;
    }
    
}
