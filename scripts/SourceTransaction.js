const {ethers, upgrades} = require('hardhat');

// const { time } = require("@nomicfoundation/hardhat-network-helpers");


async function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// sourceContract 0x72890bd345d854D124B7D4b7C23A1f9f87d74f5B
// DestinationContract 0xE7C24EF48Fa96F87C8b8cc94dec1ad29CcF0f889
async function main(){

         const SourceFactory = await ethers.getContractFactory("MyOApp");
         const source = SourceFactory.attach("0x72890bd345d854D124B7D4b7C23A1f9f87d74f5B");

         const result = await source.addressToBytes32("0xE7C24EF48Fa96F87C8b8cc94dec1ad29CcF0f889");
         console.log(result);

         // // To connect your OApp deployments together, 
         // you will need to call setPeer 
         // await source.setPeer(40102,result); 
         const currentTimestamp = Math.floor(Date.now() / 1000);
         const UpdatedTimeStamp = currentTimestamp+70; 
         const quote = await source.quote(
         40102, 
         ethers.utils.parseEther("1"),
         0,
         ["0xf1d928aADd0D23872A0BB4568C696267083e9136","0x988c1fcbc8a3222541692D32A0b8a8C9b61D6c6C"],
         "0x2ccbd69B77B4E8223582773f1487C26Ad72E9FcF",
         UpdatedTimeStamp,
         false
         );
         console.log(quote);




         await source.sendSwap(
                  40102,
                  ethers.utils.parseEther("1"),
                  0,
                  ["0xf1d928aADd0D23872A0BB4568C696267083e9136","0x988c1fcbc8a3222541692D32A0b8a8C9b61D6c6C"],
                  "0x2ccbd69B77B4E8223582773f1487C26Ad72E9FcF",
                  UpdatedTimeStamp,
                  {
                           value: quote.nativeFee,
                           gasPrice: ethers.utils.parseUnits('25', 'gwei'), // Optional: Adjust gas price if needed
                           gasLimit: 5000000 // Optional: Adjust gas limit if needed
                  }
         )

         // await source.send(40102,"This is the Second Message From Destination Chain",{
         //          value: ethers.utils.parseUnits("47578009314843523", "wei"),
         //          gasPrice: ethers.utils.parseUnits('25', 'gwei'), // Optional: Adjust gas price if needed
         //          gasLimit: 5000000 // Optional: Adjust gas limit if needed
         // })
}

main()
.then(() => process.exit(0))
.catch((error) => {
  console.error(error);
  process.exit(1);
});