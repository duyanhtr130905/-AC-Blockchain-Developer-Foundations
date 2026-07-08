# 📝 Report – Bài 6.1: Viết ERC20 Token cơ bản

## 🎯 Mục tiêu

Viết và deploy một ERC20 Token đơn giản sử dụng thư viện OpenZeppelin trên mạng Sepolia Testnet.

---

## 📁 Cấu trúc thư mục

```
bai6_1/
├── hardhat-project/
│   ├── contracts/
│   │   └── MyToken.sol        ← Smart contract ERC20
│   ├── deploy/
│   │   └── 1-deploy.ts        ← Script deploy contract
│   ├── .env                   ← Private key (không commit lên Git)
│   ├── .env_example           ← Mẫu file .env
│   ├── .gitignore             ← Bỏ qua node_modules, .env, artifacts...
│   ├── hardhat.config.ts      ← Cấu hình Hardhat
│   ├── package.json           ← Danh sách dependencies
│   └── tsconfig.json          ← Cấu hình TypeScript
└── test.ts                    ← Script đọc balance bằng ethers.js
```

---

## 🔍 Giải thích từng file

### 1. `contracts/MyToken.sol`

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract MyToken is ERC20 {
    constructor() ERC20("MyToken", "MTK") {
        _mint(msg.sender, 1_000_000 * 10 ** decimals());
    }
}
```

**Giải thích từng dòng:**

| Dòng | Ý nghĩa |
|------|---------|
| `import "@openzeppelin/contracts/token/ERC20/ERC20.sol"` | Import contract ERC20 chuẩn từ OpenZeppelin – đã implement sẵn toàn bộ logic `transfer`, `approve`, `balanceOf`... theo chuẩn EIP-20 |
| `contract MyToken is ERC20` | Kế thừa toàn bộ logic ERC20 từ OpenZeppelin, không cần viết lại |
| `constructor() ERC20("MyToken", "MTK")` | Gọi constructor của ERC20 cha, truyền vào tên token (`MyToken`) và symbol (`MTK`) |
| `_mint(msg.sender, 1_000_000 * 10 ** decimals())` | Tạo ra 1,000,000 token và chuyển toàn bộ vào ví của người deploy. Nhân `10 ** decimals()` (mặc định là 18) vì ERC20 dùng đơn vị nhỏ nhất (wei-like) – tương tự ETH có 18 chữ số thập phân |

> **Tại sao dùng OpenZeppelin?**
> Viết ERC20 từ đầu rất dễ mắc lỗi bảo mật. OpenZeppelin đã được kiểm toán (audited) và tin cậy trong cộng đồng Ethereum. Chỉ cần kế thừa và gọi `_mint` là có token chuẩn ERC20.

---

### 2. `deploy/1-deploy.ts`

```typescript
import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { deployments, getNamedAccounts } = hre;
  const { deploy } = deployments;
  const { deployer } = await getNamedAccounts();

  const result = await deploy("MyToken", {
    contract: "MyToken",
    args: [],
    from: deployer,
    log: true,
    autoMine: true,
    skipIfAlreadyDeployed: false,
  });

  console.log("MyToken deployed at:", result.address);
};

func.tags = ["deploy"];
export default func;
```

**Giải thích:**

| Thuộc tính | Ý nghĩa |
|-----------|---------|
| `getNamedAccounts()` | Lấy tài khoản `deployer` được định nghĩa trong `hardhat.config.ts` (`namedAccounts: { deployer: 0 }`) – tức là account đầu tiên từ private key trong `.env` |
| `deploy("MyToken", { ... })` | Gọi plugin `hardhat-deploy` để deploy contract. Plugin này tự động lưu kết quả vào thư mục `deployments/` để tái sử dụng |
| `args: []` | Constructor của `MyToken` không nhận tham số nào |
| `autoMine: true` | Tự động mine block sau khi gửi transaction (hữu ích khi test local) |
| `skipIfAlreadyDeployed: false` | Luôn deploy lại dù contract đã tồn tại (dùng `true` nếu muốn tiết kiệm gas) |
| `func.tags = ["deploy"]` | Gán tag để chạy bằng `--tags deploy`, tránh chạy nhầm script khác |

---

### 3. `test.ts`

```typescript
const abi = [
  "function name() public view returns (string)",
  "function symbol() public view returns (string)",
  "function decimals() public view returns (uint8)",
  "function totalSupply() public view returns (uint256)",
  "function balanceOf(address account) public view returns (uint256)",
];

const balance = await contract.balanceOf(deployerAddress);
console.log("Deployer Balance:", ethers.formatUnits(balance, decimals), symbol);
```

**Giải thích:**

- **ABI (Application Binary Interface):** Mô tả các hàm của contract. Ethers.js cần ABI để biết cách encode/decode dữ liệu khi gọi hàm contract.
- **`ethers.formatUnits(balance, decimals)`:** Chuyển giá trị từ đơn vị nhỏ nhất (ví dụ `1000000000000000000000000`) sang đơn vị người đọc hiểu được (`1000000.0 MTK`).
- Tất cả hàm trên là **view function** – đọc dữ liệu on-chain, không tốn gas.

---

### 4. `hardhat.config.ts` – Các cấu hình quan trọng

```typescript
evmVersion: "cancun",
```

> **Tại sao phải thêm `evmVersion: "cancun"`?**
>
> OpenZeppelin v5.x sử dụng opcode `mcopy` (memory copy) trong file `Bytes.sol`. Opcode này chỉ có sẵn từ EVM phiên bản **Cancun** (EIP-5656) trở lên. Nếu để mặc định (`paris`), Solidity compiler sẽ báo lỗi:
> ```
> TypeError: The "mcopy" instruction is only available for Cancun-compatible VMs
> ```
> Thêm `evmVersion: "cancun"` để compiler biết target đúng EVM version.

```typescript
namedAccounts: {
  deployer: 0,
},
```

> **Tại sao cần `namedAccounts`?**
>
> Plugin `hardhat-deploy` yêu cầu khai báo `namedAccounts` để map tên tài khoản với index. `deployer: 0` nghĩa là tài khoản deployer là account đầu tiên (index 0) từ danh sách `accounts` trong network config.

```typescript
networks: {
  "sepolia": {
    url: "https://eth-sepolia.public.blastapi.io",
    accounts: [testnetPrivateKey],
  }
}
```

> **Tại sao dùng BlastAPI?**
>
> Đây là public RPC endpoint miễn phí cho Sepolia testnet. Thay vì phải tự chạy node Ethereum hoặc trả tiền dịch vụ như Alchemy/Infura, BlastAPI cung cấp endpoint miễn phí có rate limit phù hợp cho học tập.

---

### 5. `package.json` – Dependencies quan trọng

| Package | Lý do cài |
|---------|-----------|
| `hardhat` | Framework chính để compile, test, deploy contract Solidity |
| `hardhat-deploy` | Plugin giúp quản lý deploy script theo tag, lưu deployment history |
| `hardhat-deploy-ethers` | Bridge giữa `hardhat-deploy` và `ethers.js` |
| `@openzeppelin/contracts` | Thư viện contract chuẩn, đã được audit – cung cấp ERC20, ERC721... |
| `@typechain/hardhat` | Tự động sinh TypeScript typings từ ABI contract, giúp code an toàn kiểu dữ liệu |
| `@nomicfoundation/hardhat-ethers` | Tích hợp ethers.js v6 vào môi trường Hardhat |
| `dotenv` | Đọc biến môi trường từ file `.env` (private key, RPC URL...) |
| `ts-node` + `typescript` | Chạy TypeScript trực tiếp không cần build trước |

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

# 4. Deploy lên Sepolia
npx hardhat deploy --network sepolia --tags deploy

# 5. Sau khi deploy, cập nhật contractAddress trong test.ts
# rồi chạy script đọc balance
npx ts-node ../test.ts
```

---

## 📌 Kết quả mong đợi

Sau khi deploy thành công, chạy `test.ts` sẽ in ra:

```
====================
Token Name: MyToken
Token Symbol: MTK
Decimals: 18
Total Supply: 1000000.0 MTK
Deployer Balance: 1000000.0 MTK
====================
```

Toàn bộ 1,000,000 MTK nằm trong ví deployer vì đã được `_mint` trong constructor.
