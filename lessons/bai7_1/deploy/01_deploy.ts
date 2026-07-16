import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";
import { ethers } from "hardhat";

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { deployments, getNamedAccounts } = hre;
  const { deploy } = deployments;
  const { deployer } = await getNamedAccounts();

  console.log("Deploying MyMintableToken from deployer:", deployer);

  const deployment = await deploy("MyMintableToken", {
    from: deployer,
    args: [],
    log: true,
  });

  console.log(`MyMintableToken deployed at: ${deployment.address}`);

  // Mint 1000 tokens to deployer
  const token = await ethers.getContractAt("MyMintableToken", deployment.address);
  const amountToMint = ethers.parseUnits("1000", 18);
  
  console.log(`Minting 1000 tokens to ${deployer}...`);
  const tx = await token.mint(deployer, amountToMint);
  await tx.wait();
  
  const balance = await token.balanceOf(deployer);
  console.log(`Balance of deployer: ${ethers.formatUnits(balance, 18)} MMT`);
};

export default func;
func.tags = ["deploy"];
