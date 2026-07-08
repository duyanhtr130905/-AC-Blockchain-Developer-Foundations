import { ethers } from "ethers";

async function main() {
  const provider = new ethers.JsonRpcProvider("https://eth-sepolia.public.blastapi.io");

  // ERC20 ABI – chỉ cần các hàm cần dùng
  const abi = [
    "function name() public view returns (string)",
    "function symbol() public view returns (string)",
    "function decimals() public view returns (uint8)",
    "function totalSupply() public view returns (uint256)",
    "function balanceOf(address account) public view returns (uint256)",
  ];

  // Thay bằng địa chỉ contract sau khi deploy
  const contractAddress = "0x41d0Ad4E6227062B59CA673B418Fc00E3A2d10Cf"; // Replace with your contract address
  const contract = new ethers.Contract(contractAddress, abi, provider);

  /**
   * Get the current balance of deployer
   */
  // Địa chỉ deployer (tài khoản đã deploy contract)
  const deployerAddress = "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266"; // Replace with your deployer address

  const name = await contract.name();
  const symbol = await contract.symbol();
  const decimals = await contract.decimals();
  const totalSupply = await contract.totalSupply();
  const balance = await contract.balanceOf(deployerAddress);

  console.log("====================");
  console.log("Token Name:", name);
  console.log("Token Symbol:", symbol);
  console.log("Decimals:", decimals);
  console.log("Total Supply:", ethers.formatUnits(totalSupply, decimals), symbol);
  console.log("Deployer Balance:", ethers.formatUnits(balance, decimals), symbol);
  console.log("====================");
}

main().catch(console.error);
