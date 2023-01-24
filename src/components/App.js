import React, { Component } from 'react';
import DVideo from '../abis/DVideo.json'
import Identity from '../abis/Identity.json'
import Navbar from './Navbar'
import Main from './Main'
import Web3 from 'web3';
import './App.css';

//Declare IPFS
const ipfsClient = require('ipfs-http-client')
const ipfs = ipfsClient({ host: 'ipfs.infura.io', port: 5001, protocol: 'https' }) // leaving out the arguments will default to these values

class App extends Component {

  async componentWillMount() {
    await this.loadWeb3()
    await this.loadBlockchainData()
  }

  async loadWeb3() {
    if (window.ethereum) {
      window.web3 = new Web3(window.ethereum)
      await window.ethereum.enable()
    }
    else if (window.web3) {
      window.web3 = new Web3(window.web3.currentProvider)
    }
    else {
      window.alert('Non-Ethereum browser detected. You should consider trying MetaMask!')
    }
  }

  async loadBlockchainData() {
    const web3 = window.web3
    //Load accounts
    const accounts = await web3.eth.getAccounts();
    console.log(accounts);
    this.setState({account: accounts[0]})
    //Add first account the the state

    //Get network ID
    const networkId = await web3.eth.net.getId()
    console.log(networkId)
    //Get network data
    const networkData = Identity.networks[networkId]
    console.log('networkdata is '+ networkData)
    //Check if net data exists, then
    if(networkData){
      const identity = new web3.eth.Contract(Identity.abi,networkData.address)
      this.setState({identity})
      
      
      const idsCount = await identity.methods.idCount().call()
      this.setState({idsCount})
      
      for(var i =idsCount; i>=1;i--){
        const video = await identity.methods.blocks(i).call()
        this.setState({
          videos:[...this.state.blocks, video ]
        })
      }

      const latest = await identity.methods.blocks(idsCount).call()
      this.setState({
        currentHash: latest.Adhaar_Hash,
        currentTitle: latest.Adhaar_No
      })
      this.setState({loading:false})

    }else{
      window.alert('Identity contract not deployed to declared network.')
    }
      //Assign dvideo contract to a variable
      //Add dvideo to the state

      //Check videoAmounts
      //Add videAmounts to the state

      //Iterate throught videos and add them to the state (by newest)


      //Set latest video and it's title to view as default 
      //Set loading state to false

      //If network data doesn't exisits, log error
  }

  //Get video
  captureFile = event => {
    event.preventDefault()
    const file = event.target.files[0]
    const reader = new window.FileReader()
    reader.readAsArrayBuffer(file)

    reader.onloadend = () => {
      this.setState({ buffer: Buffer(reader.result) })
      console.log('buffer', this.state.buffer)
      
    }
  }
  //Upload video
  uploadVideo = title => {
    console.log("Submitting to ipfs")
    ipfs.add(this.state.buffer,(error,result)=>{
      if(error)
      {
        console.error(error)
        return
      }
    })
  }

  //Change Video
  changeVideo = (hash, title) => {

  }

  constructor(props) {
    super(props)
    this.state = {
      buffer:null,
      account:'',
      identity:null,
      videos:[],
      loading: false,
      currentHash:null,
      currentTitle:null
      //set states
    }

    //Bind functions
  }

  render() {
    return (
      <div>
        <Navbar 
          //Account
          account = {this.state.account}
        />
        { this.state.loading
          ? <div id="loader" className="text-center mt-5"><p>Loading...</p></div>
          : <Main
              uploadVideo={this.uploadVideo}
              captureFile={this.captureFile}
            />
        }
        
      </div>
    );
  }
}

export default App;