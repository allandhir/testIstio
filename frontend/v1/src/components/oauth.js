import React, { Component } from 'react'
import axios from 'axios';
import './oauth.css';
import MyButton from './mybutton';

class OAuth extends Component {
    constructor(props) {
        super(props)
    
        this.state = {
            login: false,
            pd: "Output",
            buttonStyle: {
            width: "50%",
            height: "50px"
            },
            help: false
        
        }
    }

withToken =  ()=>{

    let t = JSON.parse(localStorage.getItem('login'))
    if(t && t.login===true){   
        axios.get('/info', {
            headers: {
              Authorization: 'Bearer ' + t.token
            }
           }).then((res)=>{
                this.setState({pd: res.data})
                console.log("withTokenRes: "+ JSON.stringify(res))
        }).catch((err)=>{
            console.log("withTokenErr: " + err)
            if(err.response){
                this.setState({pd: err.response.status})
            }
		})
    }
    else{
        this.setState({pd: "Please Login"})
	}
}
noToken = ()=>{  
    axios.get('/info').then((res)=>{
        this.setState({pd: res.data})
        console.log("noTokenRes: "+ res.data)
    }).catch((err)=>{
        console.log("noTokenErr: " + err)
        if(err.response){
            this.setState({pd: err.response.status})
        }
    })
}
componentDidMount = ()=>{
    this.storeCollector()

}
storeCollector = ()=>{
    let store = JSON.parse(localStorage.getItem('login'))
    if(store && store.login){
        this.setState({login: true})
    }
}

getHeaders = ()=>{
    axios.get('/headers').then((res)=>{
        console.log("headers" + JSON.stringify(res.data))
        this.setState({pd: "Free Access"})
    }).catch((err)=>{
        console.log("headersERR: " + err)
        if(err.response){
            this.setState({pd: err.response.status})
        }
    })
}

showHelp = () =>{
    this.setState({help: !this.state.help})
}

    render() {
        return (

            <div>
                <div style={{position: "absolute", right:"14%", top: "15%"}}>
                    <MyButton buttonStyle={{width: "150%", height: "45px", paddingLeft: "15px"}} label={this.state.help?"Test":"Help"} func={this.showHelp}/>
                </div>
                {
                this.state.help?
                <div>
                    <p>Help</p>
                </div>
                :
                <div>
                    <div id="butts">
                        <MyButton label="withToken" buttonStyle={this.state.buttonStyle} func={this.withToken}/>
                        <MyButton label="noToken" buttonStyle={this.state.buttonStyle} func={this.noToken}/>
                        <MyButton label="headers" buttonStyle={this.state.buttonStyle} func={this.getHeaders}/>
                    </div>
                    <div id="output">
                        <div id="stdout">
                            {this.state.pd}
                        </div>
                    </div>
            </div>
            }
            </div>


        )
    }
}

export default OAuth









