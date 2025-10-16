// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract MiniToken {
  string public name = "Mini";
  string public symbol = "MIN";
  uint8 public decimals = 18;
  mapping(address=>uint256) public balanceOf;
  mapping(address=>mapping(address=>uint256)) public allowance;
  event Transfer(address indexed from,address indexed to,uint256 value);
  event Approval(address indexed owner,address indexed spender,uint256 value);
  constructor(){balanceOf[msg.sender]=1e24;}
  function transfer(address to,uint256 amount) external returns(bool){require(balanceOf[msg.sender]>=amount,"bal");unchecked{balanceOf[msg.sender]-=amount;balanceOf[to]+=amount;}emit Transfer(msg.sender,to,amount);return true;}
  function approve(address sp,uint256 amount) external returns(bool){allowance[msg.sender][sp]=amount;emit Approval(msg.sender,sp,amount);return true;}
  function transferFrom(address from,address to,uint256 amount) external returns(bool){require(balanceOf[from]>=amount,"bal");require(allowance[from][msg.sender]>=amount,"allow");unchecked{allowance[from][msg.sender]-=amount;balanceOf[from]-=amount;balanceOf[to]+=amount;}emit Transfer(from,to,amount);return true;}
}
