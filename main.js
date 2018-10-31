const SHA356 = require('crypto-js/sha256');

class Block {
  constructor(index, timestamp, data, previousHash) {
    this.index = index;
    this.timestamp = timestamp;
    this.data = data;
    this.previousHash = previousHash;
    this.hash = this.caculateHash();
    this.nonce = 0;
  }

  caculateHash() {
    return SHA356(this.index + this.previousHash + this.timestamp + JSON.stringify(this.data) + this.nonce).toString();
  }

  mineBlock(difficulty) {
    while (this.hash.substring(0, difficulty) !== Array(difficulty + 1).join('0')) {
      // console.log(`Mining Hash Block ${this.index} (nonce: ${this.nonce})`, this.hash);
      this.nonce++;
      this.hash = this.caculateHash();
    }
    console.log('Mined Successfuly', this.hash);
    return this.hash;
  }

}

class BlockChain {
  constructor() {
    this.chain =[this.createGenesisBlock()];
    this.difficulty = 4;
  }

  createGenesisBlock() {
    return new Block(0, '10/10/2018', 'genesisBlock', "0");
  }
  getLatestBlock() {
    return this.chain[this.chain.length-1];
  }

  addBlock(newBlock) {
    newBlock.previousHash = this.getLatestBlock().hash;
    // newBlock.hash = newBlock.caculateHash();
    newBlock.mineBlock(this.difficulty);
    this.chain.push(newBlock);
  }

  isValidChain() {
    for (let i=1; i< this.chain.length; i++) {
      const currentBlock = this.chain[i];
      const previousBlock = this.chain[i-1];
      if (currentBlock.hash !== currentBlock.caculateHash()) {
        console.log('Invalid Type 1: try to modify value of block', currentBlock.hash, currentBlock.caculateHash);
        return false;
      }
      if (previousBlock.hash !== currentBlock.previousHash) {
        console.log('Invalid Type 2: try to modify a hash value of block', previousBlock.hash, currentBlock.hash);
        return false;
      }
    }
    return true;
  }

}

const ktvCoin = new BlockChain();
console.log('Mining Block 1......');
ktvCoin.addBlock(new Block(1, '11/11/2018', { amount: 10 }));
console.log('Mining Block 2......');
ktvCoin.addBlock(new Block(2, '11/12/2018', { amount: 20 }));
// console.log('Is Valid Chain', ktvCoin.isValidChain());
// ktvCoin.chain[1].data = { amount: 100 }
// console.log('Is Valid Chain', ktvCoin.isValidChain());
// ktvCoin.chain[1].hash = ktvCoin.chain[1].caculateHash();
// console.log('Is Valid Chain', ktvCoin.isValidChain());

console.log(JSON.stringify(ktvCoin, null, 4));