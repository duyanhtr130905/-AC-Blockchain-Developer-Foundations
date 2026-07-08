# 📝 Report – Bài 6.3: Mint NFT bằng Hardhat

## 🎯 Mục tiêu

Viết, deploy và mint NFT theo chuẩn ERC721 bằng Hardhat. Khác với ERC20 (fungible – có thể đổi lẫn nhau), ERC721 là **Non-Fungible Token** – mỗi token là duy nhất, có `tokenId` riêng.

---

## 📁 Cấu trúc thư mục

```
bai6_3/
├── hardhat-project/
│   ├── contracts/
│   │   └── MyNFT.sol          ← Smart contract ERC721
│   ├── deploy/
│   │   └── 1-deploy.ts        ← Script deploy + mint 1 NFT + in ownerOf(0)
│   ├── .env                   ← Private key (không commit lên Git)
│   ├── .env_example           ← Mẫu file .env
│   ├── .gitignore             ← Bỏ qua node_modules, .env, artifacts...
│   ├── hardhat.config.ts      ← Cấu hình Hardhat
│   ├── package.json           ← Danh sách dependencies
│   └── tsconfig.json          ← Cấu hình TypeScript
└── test.ts                    ← Script mint NFT + đọc ownerOf bằng ethers.js
```

---

## 🔍 Giải thích từng file

### 1. `contracts/MyNFT.sol`

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract MyNFT is ERC721, Ownable {
    uint256 public nextTokenId;

    constructor() ERC721("MyNFT", "MNFT") Ownable(msg.sender) {
        nextTokenId = 0;
    }

    function mint(address to) public onlyOwner {
        _safeMint(to, nextTokenId);
        nextTokenId++;
    }
}
```

**Giải thích từng phần:**

#### Import

| Import | Lý do |
|--------|-------|
| `ERC721.sol` | Cung cấp toàn bộ logic NFT chuẩn: `ownerOf`, `transferFrom`, `balanceOf`, `safeTransferFrom`... theo chuẩn EIP-721 |
| `Ownable.sol` | Cung cấp modifier `onlyOwner` và biến `owner()` – dùng để giới hạn quyền gọi hàm `mint`, chỉ deployer mới được mint |

#### Biến `nextTokenId`

```solidity
uint256 public nextTokenId;
```

- Lưu tokenId tiếp theo sẽ được mint. Bắt đầu từ `0`.
- Mỗi lần `mint()` được gọi, tokenId này tăng lên 1.
- `public` nghĩa là Solidity tự tạo getter function để bên ngoài đọc được giá trị.

> **Tại sao bắt đầu từ 0?**
> Theo convention phổ biến trong ERC721, tokenId bắt đầu từ 0. Hàm `ownerOf(0)` sẽ trả về owner của NFT đầu tiên.

#### Constructor

```solidity
constructor() ERC721("MyNFT", "MNFT") Ownable(msg.sender) {
    nextTokenId = 0;
}
```

- `ERC721("MyNFT", "MNFT")` – Gọi constructor cha, đặt tên collection (`MyNFT`) và symbol (`MNFT`)
- `Ownable(msg.sender)` – Trong OpenZeppelin v5, `Ownable` yêu cầu truyền địa chỉ owner vào constructor (khác v4 tự lấy `msg.sender`). Đây là **breaking change** của OZ v5.

> **Tại sao OZ v5 đổi cách khởi tạo Ownable?**
> Phiên bản cũ (`v4`) tự ngầm định `owner = msg.sender` trong constructor, đôi khi gây lỗi với các pattern proxy/upgradeable. Phiên bản v5 yêu cầu explicit rõ ràng hơn để tránh nhầm lẫn.

#### Hàm `mint`

```solidity
function mint(address to) public onlyOwner {
    _safeMint(to, nextTokenId);
    nextTokenId++;
}
```

| Phần | Ý nghĩa |
|------|---------|
| `public onlyOwner` | Hàm có thể gọi từ bên ngoài nhưng chỉ owner mới gọi được. Nếu non-owner gọi sẽ revert với lỗi `OwnableUnauthorizedAccount` |
| `_safeMint(to, nextTokenId)` | Mint NFT mới với tokenId hiện tại vào địa chỉ `to`. `_safeMint` an toàn hơn `_mint` vì kiểm tra xem `to` có phải contract không – nếu có, nó sẽ gọi `onERC721Received` để đảm bảo contract đó xử lý được NFT |
| `nextTokenId++` | Tăng counter sau mỗi lần mint để tokenId tiếp theo không bị trùng |

> **Tại sao dùng `_safeMint` thay vì `_mint`?**
> Nếu gửi NFT đến một contract không xử lý được ERC721 (không implement `IERC721Receiver`), NFT sẽ bị **mắc kẹt vĩnh viễn** trong contract đó và không thể lấy lại. `_safeMint` ngăn điều này bằng cách kiểm tra trước.

---

### 2. `deploy/1-deploy.ts`

```typescript
const result = await deploy("MyNFT", { ... });
console.log("MyNFT deployed at:", result.address);

// Mint 1 NFT cho deployer sau khi deploy
const myNFT = await ethers.getContractAt("MyNFT", result.address);
const tx = await myNFT.mint(deployer);
await tx.wait();

const owner = await myNFT.ownerOf(0);
console.log("ownerOf(0):", owner);
```

**Giải thích flow:**

1. **Deploy contract** – Plugin `hardhat-deploy` gửi transaction tạo contract lên blockchain
2. **`ethers.getContractAt("MyNFT", result.address)`** – Sau khi deploy, lấy instance contract để tương tác. Vì đã có TypeChain generate typings, IDE sẽ auto-complete các hàm của contract
3. **`myNFT.mint(deployer)`** – Gọi hàm mint, deployer là cả người gọi lẫn người nhận NFT
4. **`await tx.wait()`** – Chờ transaction được confirm trên blockchain. Quan trọng! Nếu không `await`, câu lệnh `ownerOf` tiếp theo có thể chạy trước khi mint xong
5. **`myNFT.ownerOf(0)`** – Kiểm tra chủ sở hữu của tokenId = 0 (NFT vừa mint)

---

### 3. `test.ts`

```typescript
// Cần signer để gọi hàm write (mint tốn gas)
const signer = new ethers.Wallet(DEPLOYER_PRIVATE_KEY, provider);
const contract = new ethers.Contract(contractAddress, abi, signer);

// Mint NFT
const tx = await contract.mint(deployerAddress);
await tx.wait();

// Đọc ownerOf
const owner = await contract.ownerOf(tokenIdBefore);
console.log(`ownerOf(${tokenIdBefore}):`, owner);
```

**Sự khác biệt quan trọng giữa read và write:**

| | Read function (`view`/`pure`) | Write function (state-changing) |
|-|------------------------------|--------------------------------|
| Ví dụ | `ownerOf`, `balanceOf`, `nextTokenId` | `mint`, `transfer`, `approve` |
| Cần signer? | ❌ Không (chỉ cần `provider`) | ✅ Bắt buộc (cần private key để ký transaction) |
| Tốn gas? | ❌ Không | ✅ Có |
| Cần `await tx.wait()`? | ❌ Không | ✅ Cần để chờ confirm |

> **Tại sao script `test.ts` cần private key nhưng `test.ts` bài 6.1 thì không?**
>
> Bài 6.1 chỉ **đọc** data (`balanceOf`, `totalSupply`) – đây là view functions, chỉ cần `provider` (không cần ký). Bài 6.3 cần **ghi** (`mint`) – đây là transaction thay đổi state blockchain, bắt buộc phải có `signer` (ví + private key) để ký và trả gas.

---

### 4. `hardhat.config.ts` – Điểm khác biệt với bài 6.1

Cấu hình giống bài 6.1, nhưng **bắt buộc** phải có `evmVersion: "cancun"`:

```typescript
evmVersion: "cancun",
```

> **Tại sao bài 6.3 bị lỗi compile mà bài 6.1 không?**
>
> `MyToken` (ERC20) chỉ dùng những file đơn giản của OpenZeppelin. `MyNFT` (ERC721) phụ thuộc vào nhiều file hơn, trong đó có `Bytes.sol` – file này dùng opcode `mcopy` của EVM Cancun. Khi compiler target là `paris` (mặc định), nó không biết opcode `mcopy` và báo lỗi.
>
> **Lỗi cụ thể gặp phải:**
> ```
> TypeError: The "mcopy" instruction is only available for Cancun-compatible VMs
>   --> @openzeppelin/contracts/utils/Bytes.sol:94:13
> ```
> **Fix:** Thêm `evmVersion: "cancun"` vào settings của Solidity compiler.

---

### 5. `package.json` – Dependencies

Giống với bài 6.1. Xem thêm tại report bài 6.1.

Điểm cần lưu ý thêm: `@openzeppelin/contracts ^5.1.0` bao gồm cả ERC721 và Ownable v5 với constructor signature mới (`Ownable(msg.sender)`).

---

## 🆚 So sánh ERC20 vs ERC721

| | ERC20 (Bài 6.1) | ERC721 (Bài 6.3) |
|-|-----------------|-----------------|
| Loại token | Fungible (đổi được) | Non-Fungible (duy nhất) |
| Đơn vị | Số lượng (có decimals) | TokenId (số nguyên) |
| Kiểm tra sở hữu | `balanceOf(address)` | `ownerOf(tokenId)` |
| Tạo token | `_mint(to, amount)` | `_safeMint(to, tokenId)` |
| Ứng dụng | Stablecoin, governance token... | NFT art, game item, certificate... |

---

## 🚀 Hướng dẫn chạy

```bash
# 1. Cài dependencies
cd hardhat-project
yarn install

# 2. Điền private key vào .env
cp .env_example .env
# Sửa TESTNET_PRIVATE_KEY=0x<your_private_key>

# 3. Compile contract
npx hardhat compile

# 4. Deploy lên Sepolia (tự động mint 1 NFT và in ownerOf)
npx hardhat deploy --network sepolia --tags deploy

# 5. Sau khi deploy, cập nhật contractAddress trong test.ts
# rồi chạy script mint thêm NFT
npx ts-node ../test.ts
```

---

## 📌 Kết quả mong đợi

Sau khi deploy, console sẽ in:

```
====================
MyNFT deployed at: 0xAbCd...1234
====================
Minting 1 NFT to deployer: 0xf39F...2266
ownerOf(0): 0xf39F...2266
```

Chạy `test.ts` sẽ in:

```
Deployer address: 0xf39F...2266
nextTokenId before mint: 1
Minting NFT to deployer...
Transaction hash: 0xabc...
NFT minted successfully!
ownerOf(1): 0xf39F...2266
Deployer NFT balance: 2
```

Số NFT tăng dần theo mỗi lần gọi `mint()`, mỗi NFT có `tokenId` riêng biệt và duy nhất.
