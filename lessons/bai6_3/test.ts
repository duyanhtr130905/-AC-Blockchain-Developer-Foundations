import { ethers } from "ethers";

async function main() {
  const provider = new ethers.JsonRpcProvider("https://eth-sepolia.public.blastapi.io");

  // ERC721 ABI – các hàm cần dùng
  const abi = [
    "function name() public view returns (string)",
    "function symbol() public view returns (string)",
    "function nextTokenId() public view returns (uint256)",
    "function mint(address to) public",
    "function ownerOf(uint256 tokenId) public view returns (address)",
    "function balanceOf(address owner) public view returns (uint256)",
  ];

  // Thay bằng địa chỉ contract sau khi deploy
  const contractAddress = "0x41d0Ad4E6227062B59CA673B418Fc00E3A2d10Cf"; // Replace with your contract address

  /**
   * Mint a NFT to deployer
   * Lưu ý: để mint cần signer có private key (giao dịch write)
   * Đoạn dưới đây dùng signer từ private key để mint
   */

  // Thay bằng private key của deployer (chỉ dùng cho testnet/local)
  const DEPLOYER_PRIVATE_KEY = "0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80";
  const signer = new ethers.Wallet(DEPLOYER_PRIVATE_KEY, provider);

  const contract = new ethers.Contract(contractAddress, abi, signer);

  const deployerAddress = await signer.getAddress();
  console.log("Deployer address:", deployerAddress);

  // Lấy nextTokenId trước khi mint
  const tokenIdBefore = await contract.nextTokenId();
  console.log("nextTokenId before mint:", tokenIdBefore.toString());

  // Mint 1 NFT cho deployer
  console.log("Minting NFT to deployer...");
  const tx = await contract.mint(deployerAddress);
  console.log("Transaction hash:", tx.hash);
  await tx.wait();
  console.log("NFT minted successfully!");

  // ownerOf tokenId vừa mint (tokenId = tokenIdBefore)
  const owner = await contract.ownerOf(tokenIdBefore);
  console.log(`ownerOf(${tokenIdBefore.toString()}):`, owner);

  // Kiểm tra balance của deployer
  const balance = await contract.balanceOf(deployerAddress);
  console.log("Deployer NFT balance:", balance.toString());
}

main().catch(console.error);
