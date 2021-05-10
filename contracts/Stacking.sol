// SPDX-License-Identifier: MIT
pragma solidity 0.8.0;

import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
//import "@chainlink/contracts/src/v0.6/interfaces/AggregatorV3Interface.sol";
import "@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol";
import "./Dai.sol";

/**
 * @title Staking Contract "Défi : Staking"
 */

contract Stacking is Ownable {
    using SafeMath for uint256;
    AggregatorV3Interface internal priceFeed;
    address[] internal stakeholders;
    mapping(address => uint256) internal stakes;
    mapping(address => uint256) internal rewards;
    Dai token;

    //address blabla;

    constructor(address _tokenAddress) {
        priceFeed = AggregatorV3Interface(
            0x22B58f1EbEDfCA50feF632bD73368b2FdA96D541
        ); // address dai/eth  sur kovan
        token = Dai(_tokenAddress); // token que le client dépose
    }

    //function setblabla(){
    //}

    /**
    * @dev receive
    * receive ethers and store value to deposits
    */
    receive() external payable {}

    // il a stake ou non?
    function isStakeholder(address _address)
        public
        view
        returns (bool, uint256)
    {
        // il a stake ou non?
        for (uint256 s = 0; s < stakeholders.length; s = s + 1) {
            if (_address == stakeholders[s]) return (true, s);
        }
        return (false, 0);
    }

    // ajoute un holder à la liste de stacke
    function addStakeholder(address _stakeholder) public {
        (bool _isStakeholder, ) = isStakeholder(_stakeholder);
        if (!_isStakeholder) stakeholders.push(_stakeholder);
    }

    // supprime un holder à la liste de stacker
    function removeStakeholder(address _stakeholder) public {
        (bool _isStakeholder, uint256 s) = isStakeholder(_stakeholder);
        if (_isStakeholder) {
            stakeholders[s] = stakeholders[stakeholders.length - 1];
            stakeholders.pop();
        }
    }

    function stakeOf(address _stakeholder) public view returns (uint256) {
        return stakes[_stakeholder];
    }

    function totalStakes() public view returns (uint256) {
        uint256 _totalStakes = 0;
        for (uint256 s = 0; s < stakeholders.length; s = s + 1) {
            _totalStakes = _totalStakes.add(stakes[stakeholders[s]]);
        }
        return _totalStakes;
    }

    function createStake(uint256 _stake) public {
        address _caller = msg.sender;
        require(
            token.allowance(_caller, address(this)) >= _stake,
            "need allowance"
        );
        token.transferFrom(_caller, address(this), _stake);
        if (stakes[msg.sender] == 0) {
            addStakeholder(msg.sender);
        }
        stakes[msg.sender] = stakes[msg.sender].add(_stake);
    }

    function removeStake(uint256 _stake) public {
        token.transfer(msg.sender, _stake);
        stakes[msg.sender] = stakes[msg.sender].sub(_stake);
        if (stakes[msg.sender] == 0) removeStakeholder(msg.sender);
        rewards[msg.sender] = distributeRewards(msg.sender);
        // _mint(msg.sender, _stake);
    }

    function getThePrice() public view returns (int256) {
        (
            uint80 roundID,
            int256 price,
            uint256 startedAt,
            uint256 timeStamp,
            uint80 answeredInRound
        ) = priceFeed.latestRoundData();
        return price;
    }

    function rewardOf(address _stakeholder) public view returns (uint256) {
        return rewards[_stakeholder];
    }

    function totalRewards() public view returns (uint256) {
        uint256 _totalRewards = 0;
        for (uint256 s = 0; s < stakeholders.length; s = s + 1) {
            _totalRewards = _totalRewards.add(rewards[stakeholders[s]]);
        }
        return _totalRewards;
    }

    function calculateReward(address _stakeholder)
        public
        view
        returns (uint256)
    {
        return stakes[_stakeholder].div(100);
    }

    function distributeRewards(address _holder) public onlyOwner {
        //for (uint256 s = 0; s < stakeholders.length; s = s + 1) {
        //    address stakeholder = stakeholders[s];
            uint256 reward = calculateReward(_holder);
            rewards[_holder] = rewards[_holder].add(reward);
            //isDistribute = true;
        //}
    }

    function withdrawReward(uint256 _reward) public payable {
        uint256 reward = rewards[msg.sender];
        require(reward > _reward, "tricheur");
        // require (isDistribute == true, "yoyo");
        _reward = _reward.mul(uint256(getThePrice()));
        rewards[msg.sender] = rewards[msg.sender].sub(_reward);
        //_mint(msg.sender, reward);
        address payable _caller = payable(msg.sender);
        // token.transferFrom(msg.sender, _caller, stakes[_caller]);
        _caller.transfer(_reward);
    }
}
