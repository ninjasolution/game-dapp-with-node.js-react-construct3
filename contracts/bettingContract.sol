// SPDX-License-Identifier: MIT
pragma solidity 0.8.0;


interface IERC20 {
    /**
     * @dev Returns the amount of tokens in existence.
     */
    function totalSupply() external view returns (uint256);

    /**
     * @dev Returns the amount of tokens owned by `account`.
     */
    function balanceOf(address account) external view returns (uint256);

    /**
     * @dev Moves `amount` tokens from the caller's account to `recipient`.
     *
     * Returns a boolean value indicating whether the operation succeeded.
     *
     * Emits a {Transfer} event.
     */
    function transfer(address recipient, uint256 amount) external returns (bool);

    /**
     * @dev Returns the remaining number of tokens that `spender` will be
     * allowed to spend on behalf of `owner` through {transferFrom}. This is
     * zero by default.
     *
     * This value changes when {approve} or {transferFrom} are called.
     */
    function allowance(address owner, address spender) external view returns (uint256);

    /**
     * @dev Sets `amount` as the allowance of `spender` over the caller's tokens.
     *
     * Returns a boolean value indicating whether the operation succeeded.
     *
     * IMPORTANT: Beware that changing an allowance with this method brings the risk
     * that someone may use both the old and the new allowance by unfortunate
     * transaction ordering. One possible solution to mitigate this race
     * condition is to first reduce the spender's allowance to 0 and set the
     * desired value afterwards:
     * https://github.com/ethereum/EIPs/issues/20#issuecomment-263524729
     *
     * Emits an {Approval} event.
     */
    function approve(address spender, uint256 amount) external returns (bool);

    /**
     * @dev Moves `amount` tokens from `sender` to `recipient` using the
     * allowance mechanism. `amount` is then deducted from the caller's
     * allowance.
     *
     * Returns a boolean value indicating whether the operation succeeded.
     *
     * Emits a {Transfer} event.
     */
    function transferFrom(
        address sender,
        address recipient,
        uint256 amount
    ) external returns (bool);

    /**
     * @dev Emitted when `value` tokens are moved from one account (`from`) to
     * another (`to`).
     *
     * Note that `value` may be zero.
     */
    event Transfer(address indexed from, address indexed to, uint256 value);

    /**
     * @dev Emitted when the allowance of a `spender` for an `owner` is set by
     * a call to {approve}. `value` is the new allowance.
     */
    event Approval(address indexed owner, address indexed spender, uint256 value);
}

interface ERC20 is IERC20 {
    /**
     * @dev Returns the name of the token.
     */
    function name() external view returns (string memory);

    /**
     * @dev Returns the symbol of the token.
     */
    function symbol() external view returns (string memory);

    /**
     * @dev Returns the decimals places of the token.
     */
    function decimals() external view returns (uint8);
}

contract Ownable {
    address _owner;

    constructor() {
        _owner = msg.sender;
    }

    function owner() public view returns(address) {
        return _owner;
    }

    modifier onlyOwner() {
        require(isOwner());
        _;
    }

    function isOwner() public view returns(bool) {
        return msg.sender == _owner;
    }
}

contract Betting is Ownable {

    address public token;

    struct Record {
        address player;
        uint score;
    }

    uint private bestScore;
    Record[] private winners;
    Record[] private records;
    mapping(address => uint) depositCount;
    mapping(address => uint) recordCount;

    constructor(address _token) payable {
        token = _token;
    }

    function changeToken(address newTokenAddress) public onlyOwner {
       token = newTokenAddress;
    }
    
    function deposit(uint256 amount) public {
        amount = amount*(10 ** ERC20(token).decimals());
        require(ERC20(token).balanceOf(msg.sender) >= amount, "your balance is no enough");
        ERC20(token).transferFrom(msg.sender, address(this), amount);
        depositCount[msg.sender] += 1;
    }

    function withdraw(address to, uint256 amount) public payable onlyOwner {
        amount = amount*(10** ERC20(token).decimals());
        ERC20(token).approve(address(this), amount);
        ERC20(token).transferFrom(address(this), to, amount);
    }

    function recordScore(address player, uint score) public returns(bool) {
        
        require(depositCount[player] > recordCount[player], "Please deposit first");

        if(bestScore < score) {
            bestScore = score;
        }
        if(winners.length < 6) {
            winners.push(Record(player, score));
        }else {

            for(uint i=0 ; i<5 ; i++) {
                if(winners[i].score < score){
                    
                    Record storage preTemp = winners[i];
                    winners[i] = Record(player, score);

                    for(uint j=i+1 ; j<5 ; j++){
                        Record storage nextTemp = winners[j];
                        winners[j] = preTemp;
                        preTemp = nextTemp;
                    }
                }
            }
        }

        records.push(Record(player, score));
        recordCount[player] += 1;
        return true;
    }

    function transferToWinners() public  onlyOwner returns (bool) {
        uint256 amount = 100*(10** ERC20(token).decimals());
        require(ERC20(token).balanceOf(address(this)) > amount*10, "Pool balance is no enough");

        for(uint i=0 ; i<winners.length; i++){
            ERC20(token).approve(address(this), amount);
            ERC20(token).transferFrom(address(this), winners[i].player, amount);
        }
        
        if(winners.length > 30) {
            for(uint i = 0; i < 5; i++) {
                uint256 selectedIndex = _randModulus(records.length-1, i+1);
                ERC20(token).approve(address(this), amount);
                ERC20(token).transferFrom(address(this), records[selectedIndex].player, 100000000);
                winners.push(records[selectedIndex]);
            }
        }

        delete winners;
        delete records;
        delete depositCount = new mapping(address => )
        delete recordCount;
        bestScore = 0;
        return true;
    }

    function balanceOf(address player) public view returns (uint256) {
        return ERC20(token).balanceOf(player);
    }

    function playerCount() public view returns (uint256) {
        return records.length;
    }
    
    function getBestScore() public view returns (uint) {
        return bestScore;
    }

    function getWinners() public view returns (Record[] memory) {
        return winners;
    }

    function _randModulus(uint256 mod, uint sender) public view returns (uint256) {

        return (uint256(keccak256(abi.encodePacked(
            block.timestamp, 
            block.difficulty, 
            msg.sender)
        ))+(2**sender)) % mod;

       
    }

}
