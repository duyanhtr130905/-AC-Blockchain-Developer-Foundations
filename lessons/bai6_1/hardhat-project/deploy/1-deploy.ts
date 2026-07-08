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
  console.log("Deploy MyToken Contract");
  console.log("====================");

  const result = await deploy("MyToken", {
    contract: "MyToken",
    args: [],
    from: deployer,
    log: true,
    autoMine: true,
    skipIfAlreadyDeployed: false,
  });

  console.log("====================");
  console.log("MyToken deployed at:", result.address);
  console.log("====================");
};

func.tags = ["deploy"];
export default func;
