# Auth-O-Dox

Auth-O-Dox is a certificate authentication platform. The backend extracts certificate text with OCR, records a SHA-256 hash on an Ethereum-compatible blockchain, and stores certificate metadata in MongoDB.

## Project structure

- `frontend/` - application user interface.
- `backend/` - Express API, OCR, MongoDB integration, and blockchain client.
- `blockchain/` - Hardhat project containing the `CertificateRegistry` smart contract and deployment script.

## Prerequisites

- Node.js and npm
- MongoDB

Install dependencies in each project that you plan to run:

```bash
npm install
cd backend && npm install
cd ../blockchain && npm install
```

## Run the blockchain locally

Open a terminal in the `blockchain` directory and start the local Hardhat node. Keep this terminal running while using the application.

```bash
npx hardhat node
```

Deploy the certificate contract from a second terminal, also in `blockchain`:

```bash
npx hardhat run scripts/deploy.js --network localhost
```

The deployment command prints output like:

```text
Contract: 0x...
Issuer: 0x...
```

Copy the value after `Contract:` into `CONTRACT_ADDRESS` in `backend/.env`. The local node also prints funded test accounts and private keys; use the private key for the account printed as `Issuer:` as `ISSUER_PRIVATE_KEY`.

> Restarting `npx hardhat node` resets the local blockchain. Deploy the contract again and update `CONTRACT_ADDRESS` and `ISSUER_PRIVATE_KEY` if necessary.

## Backend configuration

Create `backend/.env` with your local values:

```env
MONGODB_URI=mongodb://127.0.0.1:27017/auth-o-dox
BLOCKCHAIN_RPC_URL=http://127.0.0.1:8545
CONTRACT_ADDRESS=0xYOUR_DEPLOYED_CONTRACT_ADDRESS
ISSUER_PRIVATE_KEY=YOUR_LOCAL_HARDHAT_ACCOUNT_PRIVATE_KEY
OCR_CONFIDENCE_THRESHOLD=70
```

`OCR_CONFIDENCE_THRESHOLD` defaults to `70` when omitted. A certificate must have OCR confidence greater than this value before it is registered on-chain or saved in MongoDB. Set it to `80` to require more than 80% confidence.

## Start the backend

```bash
cd backend
npm run dev
```

## Issue a certificate

Send a `multipart/form-data` request to `POST /certificate/issue` with:

- `certificate` - certificate image or PDF file
- `certificateId` - certificate identifier
- `studentName` - student name printed on the certificate
- `imageUrl` - optional hosted URL for the certificate image

When the OCR confidence and document text checks pass, the API registers the file hash on the local contract and stores the transaction, contract address, OCR data, and optional `imageUrl` in MongoDB.
