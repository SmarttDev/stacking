const { expectRevert, expectEvent } = require("@openzeppelin/test-helpers");
const { web3 } = require("@openzeppelin/test-helpers/src/setup");
const { expect } = require("chai");
const toBN = web3.utils.toBN;
const Dai = artifacts.require("Dai");
const Stacking = artifacts.require("Stacking");

//Contract Marketplace
contract("Stacking", function (accounts) {
    const owner = accounts[0];
    const address1 = accounts[1];
    const address2 = accounts[2];


  before(async function () {
    DaiInstance = await Dai.new();
    const address = DaiInstance.address;
    StackingInstance = await Stacking.new( address);
    let accounts = await web3.eth.getAccounts();
  });
// We test the  getter functions

    it('createStake creates a stake.', async () => {
        await DaiInstance.faucet(owner, 1000, { from: owner });
        const addressStacking = StackingInstance.address;
        const stake = 400;
        await DaiInstance.approve(addressStacking, stake, { from: owner });
        await StackingInstance.createStake(stake, { from: owner });
        assert.equal(await DaiInstance.balanceOf(owner), 600);
        assert.equal(await DaiInstance.balanceOf(addressStacking), 400);
        // await staking.transfer(user, 3, { from: owner });
        // await staking.createStake(1, { from: user });

        // assert.equal(await staking.balanceOf(user), 2);
        // assert.equal(await staking.stakeOf(user), 1);
        // assert.equal(
        //     await staking.totalSupply(),
        //     manyTokens.minus(1).toString(10),
        // );
        // assert.equal(await staking.totalStakes(), 1);
    });

    // it("removeStake remove a stake.", async () => {
    // //   await DaiInstance.faucet(owner, 1000, { from: owner });
    // //   const addressStacking = StackingInstance.address;
    // //   const stake = 400;
    // //   await DaiInstance.approve(addressStacking, stake, { from: owner });
    // //   await StackingInstance.createStake(stake, { from: owner });
    // const addressStacking = StackingInstance.address;
    // const stake = 400;
    //   await StackingInstance.removeStake(stake, { from: owner });
    //   assert.equal(await DaiInstance.balanceOf(owner), 1000);
    //   assert.equal(await DaiInstance.balanceOf(addressStacking), 0);
    //   // await staking.transfer(user, 3, { from: owner });
    //   // await staking.createStake(1, { from: user });

    //   // assert.equal(await staking.balanceOf(user), 2);
    //   // assert.equal(await staking.stakeOf(user), 1);
    //   // assert.equal(
    //   //     await staking.totalSupply(),
    //   //     manyTokens.minus(1).toString(10),
    //   // );
    //   // assert.equal(await staking.totalStakes(), 1);
    // });


    it("withdrawReward by Mohamed.", async () => {
      //   await DaiInstance.faucet(owner, 1000, { from: owner });
      //   const addressStacking = StackingInstance.address;
      //   const stake = 400;
      //   await DaiInstance.approve(addressStacking, stake, { from: owner });
      //   await StackingInstance.createStake(stake, { from: owner });
      // await StackingInstance.distributeRewards(owner, { from: owner });
      const addressStacking = StackingInstance.address;
      const stake = 400;
      await StackingInstance.removeStake(stake, { from: owner });

      const rewardBefore = await StackingInstance.rewardOf(owner);
      assert.equal(rewardBefore.toNumber(), 0);

      assert.equal(await DaiInstance.balanceOf(owner), 1000);
      assert.equal(await DaiInstance.balanceOf(addressStacking), 0);

      let r = await StackingInstance.getThePrice();
      console.log(r);

      const reward2 = 1;
      const balanceBefore = owner.balance;
      await StackingInstance.withdrawReward(reward2, { from: owner });
      const balanceAfter = owner.balance;

      const rewardAfter = await StackingInstance.rewardOf(owner);
      assert.equal(rewardAfter.toNumber(), 3);
    //   assert.equal((balanceAfter - balanceBefore), r * reward2);

       // await staking.transfer(user, 3, { from: owner });
      // await staking.createStake(1, { from: user });

      // assert.equal(await staking.balanceOf(user), 2);
      // assert.equal(await staking.stakeOf(user), 1);
      // assert.equal(
      //     await staking.totalSupply(),
      //     manyTokens.minus(1).toString(10),
      // );
      // assert.equal(await staking.totalStakes(), 1);
    });

    // it('rewards are distributed.', async () => {
    //     await staking.transfer(user, 100, { from: owner });
    //     await staking.createStake(100, { from: user });
    //     await staking.distributeRewards({ from: owner });

    //     assert.equal(await staking.rewardOf(user), 1);
    //     assert.equal(await staking.totalRewards(), 1);
    // });


    // it('rewards can be withdrawn.', async () => {
    //     await staking.transfer(user, 100, { from: owner });
    //     await staking.createStake(100, { from: user });
    //     await staking.distributeRewards({ from: owner });
    //     await stakingT.withdrawReward({ from: user });

    //     const initialSupply = manyTokens;
    //     const existingStakes = 100;
    //     const mintedAndWithdrawn = 1;

    //     assert.equal(await staking.balanceOf(user), 1);
    //     assert.equal(await staking.stakeOf(user), 100);
    //     assert.equal(await stakingn.rewardOf(user), 0);
    //     assert.equal(
    //         await staking.totalSupply(),
    //         initialSupply
    //             .minus(existingStakes)
    //             .plus(mintedAndWithdrawn)
    //             .toString(10)
    //         );
    //     assert.equal(await staking.totalStakes(), 100);
    //     assert.equal(await staking.totalRewards(), 0);
    // });
});