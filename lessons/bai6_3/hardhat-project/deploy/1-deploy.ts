import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";
import { ethers } from "hardhat";

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { deployments, getNamedAccounts } = hre;
  const { deploy } = deployments;
  const { deployer } = await getNamedAccounts();

  console.log("====================");
  console.log("Network:", hre.network.name);
  console.log("====================");

  console.log("====================");
  console.log("Deploy MyNFT Contract");
  console.log("====================");

  const result = await deploy("MyNFT", {
    contract: "MyNFT",
    args: [],
    from: deployer,
    log: true,
    autoMine: true,
    skipIfAlreadyDeployed: false,
  });

  console.log("====================");
  console.log("MyNFT deployed at:", result.address);
  console.log("====================");

  // Mint 1 NFT cho deployer sau khi deploy
  const myNFT = await ethers.getContractAt("MyNFT", result.address);
  console.log("Minting 1 NFT to deployer:", deployer);
  const tx = await myNFT.mint(deployer);
  await tx.wait();

  const owner = await myNFT.ownerOf(0);
  console.log("ownerOf(0):", owner);
};

func.tags = ["deploy"];
export default func;
