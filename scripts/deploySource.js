const {ethers, upgrades,hre} = require('hardhat');
// const { time } = require("@nomicfoundation/hardhat-network-helpers");


async function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function main(){

    const SourceFactory = await ethers.getContractFactory("MyOApp");
    const sourceContract = await SourceFactory.deploy("0x6EDCE65403992e310A62460808c4b910D972f10f","0x2ccbd69B77B4E8223582773f1487C26Ad72E9FcF")

         
         await sourceContract.deployed();
         console.log("sourceContract",sourceContract.address)

       
       console.log("Contracts Deployed SucessFully");


}

main()
.then(() => process.exit(0))
.catch((error) => {
  console.error(error);
  process.exit(1);
});

//sourceContract 0x72890bd345d854D124B7D4b7C23A1f9f87d74f5B

// npx hardhat verify --network snowtrace 0x72890bd345d854D124B7D4b7C23A1f9f87d74f5B 0x6EDCE65403992e310A62460808c4b910D972f10f 0x2ccbd69B77B4E8223582773f1487C26Ad72E9FcF