const {ethers, upgrades} = require('hardhat');

// const { time } = require("@nomicfoundation/hardhat-network-helpers");


async function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// sourceContract 0x72890bd345d854D124B7D4b7C23A1f9f87d74f5B
// DestinationContract 0xE7C24EF48Fa96F87C8b8cc94dec1ad29CcF0f889
async function main(){

         const DestinationFactory = await ethers.getContractFactory("MyOApp");
         const destination = DestinationFactory.attach("0xE7C24EF48Fa96F87C8b8cc94dec1ad29CcF0f889");

         const result = await destination.addressToBytes32("0x72890bd345d854D124B7D4b7C23A1f9f87d74f5B");
         console.log(result);
         
         // To connect your OApp deployments together, 
         // you will need to call setPeer 
         await destination.setPeer(40106,result); 
         
    
}

main()
.then(() => process.exit(0))
.catch((error) => {
  console.error(error);
  process.exit(1);
});