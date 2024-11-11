const { expect, use } = require("chai");
const { ethers, deployments} = require("hardhat");
const { time } = require("@nomicfoundation/hardhat-network-helpers");

describe("Staking", function () {
  let owner,user1,user2,user3,user4,user5,user6,user7,user8;
  let mmitToken ,mmitTokenFactory
  let staking, stakingFacory

    beforeEach(async function () {
      [owner,user1,user2,user3,user4,user5,user6,user7,user8] = await ethers.getSigners();

      const EndpointV2MockArtifact = await deployments.getArtifact('EndpointV2Mock');
        EndpointV2Mock = new ContractFactory(
            EndpointV2MockArtifact.abi,
            EndpointV2MockArtifact.bytecode,
            endpointOwner
        );
    });

     
    it("User Stakes without any Refferal ", async function () {


      

    });


  });