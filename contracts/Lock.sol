// SPDX-License-Identifier: MIT

pragma solidity ^0.8.22;

import { Ownable } from "@openzeppelin/contracts/access/Ownable.sol";
import { OptionsBuilder } from "@layerzerolabs/oapp-evm/contracts/oapp/libs/OptionsBuilder.sol";
import { OApp, MessagingFee, Origin } from "@layerzerolabs/oapp-evm/contracts/oapp/OApp.sol";
import { MessagingReceipt } from "@layerzerolabs/oapp-evm/contracts/oapp/OAppSender.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract MyOApp is OApp {
    constructor(address _endpoint, address _delegate) OApp(_endpoint, _delegate) Ownable(_delegate) {}
    address public router = 0x21e35AA2d636792881e6dbB3E2741656fC904A2E;
    string public data = "Nothing received yet.";
    uint256 number;
    using OptionsBuilder for bytes;
    bytes _options = OptionsBuilder.newOptions().addExecutorLzReceiveOption(50000, 0);
    event incommingData(string data);
 /**
     * @dev Converts an address to bytes32.
     * @param _addr The address to convert.
     * @return The bytes32 representation of the address.
     */
    function addressToBytes32(address _addr) public pure returns (bytes32) {
        return bytes32(uint256(uint160(_addr)));
    }

    /**
     * @dev Converts bytes32 to an address.
     * @param _b The bytes32 value to convert.
     * @return The address representation of bytes32.
     */
    function bytes32ToAddress(bytes32 _b) public pure returns (address) {
        return address(uint160(uint256(_b)));
    }


    function send(
        uint32 _dstEid,
        string memory _message
        // bytes calldata _options
    ) external payable returns (MessagingReceipt memory receipt) {
        bytes memory _payload = abi.encode(_message);
        receipt = _lzSend(_dstEid, _payload, _options, MessagingFee(msg.value, 0), payable(msg.sender));
    }

    function sendSwap(
    uint32 _dstEid,
    uint256 amountIn,
    uint256 amountOutMin,
    address[] calldata path,
    address to,
    uint256 deadline
) external payable returns (MessagingReceipt memory receipt) {
    // Encode the parameters for swapExactTokensForTokens into payload
    bytes memory _payload = abi.encodeWithSignature(
        "swapExactTokensForTokens(uint256,uint256,address[],address,uint256)",
        amountIn,
        amountOutMin,
        path,
        to,
        deadline
    );

    // Send the payload to the destination chain using LayerZero
    receipt = _lzSend(_dstEid, _payload, _options, MessagingFee(msg.value, 0), payable(msg.sender));
}


  
    function quote(
        uint32 _dstEid,
        // string memory _message,
        // bytes memory _options,
        uint256 amountIn,
    uint256 amountOutMin,
    address[] calldata path,
    address to,
    uint256 deadline,
        bool _payInLzToken
    ) public view returns (MessagingFee memory fee) {
        // bytes memory payload = abi.encode(_message);
           bytes memory _payload = abi.encodeWithSignature(
        "swapExactTokensForTokens(uint256,uint256,address[],address,uint256)",
        amountIn,
        amountOutMin,
        path,
        to,
        deadline
    );
        fee = _quote(_dstEid, _payload, _options, _payInLzToken);
    }

    /**
     * @dev Internal function override to handle incoming messages from another chain.
     * @dev _origin A struct containing information about the message sender.
     * @dev _guid A unique global packet identifier for the message.
     * @param payload The encoded message payload being received.
     *
     * @dev The following params are unused in the current implementation of the OApp.
     * @dev _executor The address of the Executor responsible for processing the message.
     * @dev _extraData Arbitrary data appended by the Executor to the message.
     *
     * Decodes the received payload and processes it as per the business logic defined in the function.
     */
    // function _lzReceive(
    //     Origin calldata /*_origin*/,
    //     bytes32 /*_guid*/,
    //     bytes calldata payload,
    //     address /*_executor*/,
    //     bytes calldata /*_extraData*/
    // ) internal override {
    //     data = abi.decode(payload, (string));
    //     emit incommingData(data);
    // }

     function _lzReceive(
        Origin calldata /*_origin*/,
        bytes32 /*_guid*/,
        bytes calldata payload,
        address /*_executor*/,
        bytes calldata /*_extraData*/
    ) internal override {
        // Decode the swap parameters from the payload
        (
            uint256 amountIn,
            uint256 amountOutMin,
            address[] memory path,
            address to,
            uint256 deadline
        ) = abi.decode(payload, (uint256, uint256, address[], address, uint256));

        // Approve the router to spend tokens on behalf of this contract
        IERC20(path[0]).approve(router, amountIn);

        // Execute the swap using .call method on the router
        (bool success, ) = router.call(
            abi.encodeWithSignature(
                "swapExactTokensForTokens(uint256,uint256,address[],address,uint256)",
                amountIn,
                amountOutMin,
                path,
                to,
                deadline
            )
        );
        require(success, "Swap failed on destination chain");
        emit incommingData("Swap executed on destination chain.");
    }
}
