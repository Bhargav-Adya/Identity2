pragma solidity ^0.5.0;


// contract DVideo {
   contract Identity {
  uint public idCount = 0;
  //  uint public videoCount = 0;
  //  string public name = "DVideo";
  //Create id=>struct mapping
 
  mapping(uint=>Block) public blocks;
  //Create Struct
  // struct Video {
  struct Block {
   uint id;
   string name;
    string Adhaar_No;
    string AdhaarHash;
    string PANHash;
    string PAN_No;
    string Home_Address;
     address author;

    // uint fcount =0; //number of fieds
   
    // uint id;
    // string hash;
    // string title;
    // address author;
  }

  //Create Event
  event BlockUploaded(
    uint id,
    string name,
    string Adhaar_No,
    string AdhaarHash,
    string PAN_No,
    string PANHash,
    string Home_Address,
    address author
  );

  constructor() public {
  }

  function uploadVideo(string memory name,string memory  Adhaar_No,string memory _AdhaarHash,string memory PAN_NO, string memory _PANHash,string memory Home_Address) public {
    // Make sure the aadhar hash exists
    require(bytes( _AdhaarHash).length>0||bytes(_PANHash).length>0);
    // Make sure  name exists
    require(bytes(_PANHash).length>0);
    // Make sure uploader address exists
    require(msg.sender!= address(0));

    // Increment  id
     idCount ++;
    // Add block to the contract
        blocks[idCount] = Block(idCount,name,Adhaar_No,_AdhaarHash,PAN_NO,_PANHash,Home_Address,msg.sender);
    // Trigger an event
       emit BlockUploaded(idCount, name,Adhaar_No,_AdhaarHash,PAN_NO,_PANHash,Home_Address, msg.sender);
  }
}
