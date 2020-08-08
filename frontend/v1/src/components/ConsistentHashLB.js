import React, { Component } from 'react'
import axios from 'axios';
import './circuitBreaker.css';
import './ConsistentHashLB.css';
import MyButton from './mybutton';

class ConsistentHashLB extends Component {
    constructor(props) {
        super(props)
    
        this.state = {
             headerName: "x-user",
             headerValue: "john",
             info: "<ip> <version>",
             help: false
        }
    }
getInfo = () =>{
    let t = JSON.parse(localStorage.getItem('login'))
    var headername = this.state.headerName
    var headerval = this.state.headerValue
    console.log(headername + headerval)
	    axios.get('/info', {
		    headers: {
		      "x-user": "john",
		      Authorization: 'Bearer ' + t.token           
		    }
		   }).then((res)=>{
		this.setState({info: res.data})
		console.log("infoRES: "+ res.data)
	    }).catch((err)=>{
		console.log("infoERR: " + err)
		if(err.response){
		    this.setState({info: err.response.status})
		}
	    })
}
showHelp = () =>{
    this.setState({help: !this.state.help})
}
    render(){
        return(
            <div>
                <div style={{position: "absolute", right:"14%", top: "15%"}}>
                    <MyButton buttonStyle={{width: "150%", height: "45px", paddingLeft: "15px"}} label={this.state.help?"Test":"Help"} func={this.showHelp}/>
                </div>
                {
                this.state.help?
                <div id="help">
                    toDo
                </div>
                :
                <div>
                    <table id="panel">
                        <tbody>               
                            <tr>
                                <td>Header Name</td>
                                <td>Header Value</td>
                            </tr>                  
                            <tr>
                                <td><input value={this.state.headerName} className="in" type="text" onChange={(e)=>{this.setState({headerName: e.target.value})}}></input></td>
                                <td><input value={this.state.headerValue} className="in" type="text" onChange={(e)=>{this.setState({headerValue: e.target.value})}}></input></td>
                            </tr>
                            <tr>
                                <td><MyButton buttonStyle={{width: "50%", height: "45px"}} label="info" func={this.getInfo}/></td>
                            </tr>
                            <br/> 
                            <tr>
                                <td colSpan={2}>For ConsistentHash with canary deployments use
                                    <ul>
                                        <br/><li>Make sure line <b>"httpHeaderName: x-user"</b> is uncommented in backend-vs2.yaml</li>
                                             <li><b>kubectl create -f backend-vs2.yaml</b></li>
                                             
                                    </ul>
                                </td>
                            </tr>         
                        </tbody>      
                    </table>               
                    <div id="outputy">
                        <div id="stdouty">
                            {this.state.info}
                        </div>
                    </div>
                </div>
                }
            </div>
            )
        }
    }

export default ConsistentHashLB;
