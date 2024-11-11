const {ethers,upgrades} = require('hardhat');
// const { time } = require("@nomicfoundation/hardhat-network-helpers");


async function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function main(){


const DestinationFactory = await ethers.getContractFactory("MyOApp");

const destinationContract = await DestinationFactory.deploy("0x6EDCE65403992e310A62460808c4b910D972f10f","0x2ccbd69B77B4E8223582773f1487C26Ad72E9FcF")
  

  await destinationContract.deployed();
  console.log("DestinationContract",destinationContract.address);

console.log("Contracts Deployed SucessFully");


await hre.run("verify:verify", {
  address: destinationContract.address,
  constructorArguments: ["0x6EDCE65403992e310A62460808c4b910D972f10f","0x2ccbd69B77B4E8223582773f1487C26Ad72E9FcF"],
});

console.log("Contracts Verified Successfully");


}

main()
.then(() => process.exit(0))
.catch((error) => {
  console.error(error);
  process.exit(1);
});

// DestinationContract 0xE7C24EF48Fa96F87C8b8cc94dec1ad29CcF0f889