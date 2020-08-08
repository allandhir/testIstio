import React, { Component } from 'react'
import axios from 'axios';
import './circuitBreaker.css';
import MyButton from './mybutton';

var myd={};
class CircuitBreaker extends Component {
    constructor(props) {
        super(props)
    
        this.state = {
             p: 0,
             r: 0,
             u: "",
             pd: "Output",
             show: false,
             help: false
        }
    }
    stress = () =>{
        let t = JSON.parse(localStorage.getItem('login'))

            axios.post('/stress', this.state, {
                headers: {
                Authorization: 'Bearer ' + t.token
                }
            }).then((res)=>{
                myd = res;
                this.setState({show: true})
                console.log("myd: "+ myd.data)
            }).catch((err)=>{
                this.setState({show: false})
                console.log("STRESSERR: " + err)
                if(err.response){
                    this.setState({show: false})                    
                    this.setState({pd: err.response.status})
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
                    
                    {/* <MyButton buttonStyle={{width: "50%", height: "45px"}} label="Help" func={this.showHelp}/> */}
                        <ul>
                            <li>Open ./backend-vs1.yaml</li>
                            <li>Change weigth for subset v1 to 100 and v2 to 0</li>
                        </ul>
                            <br/><b>kubectl create -f backend-dr.yaml</b><br/><br/>
                            <p>
                            <b>Trigger the Circuit Breaker</b><br/>
                            Input Parallel Connections=3<br/>
                            Input No. of Requests any Number (ex: 20)<br/>
                            Target url as <i>http://authnz-backend.bar.svc.cluster.local/info</i><br/>
                            </p>
                            <br/>
                            <ul>
                                <li><b>Some Requests fail with 503 code</b><br/>
                                In the DestinationRule settings, under subset v1, we specified maxConnections: 1 and http1MaxPendingRequests: 1. These rules indicate that if we exceed more than one connection and request concurrently, you should see some failures
                                </li>
                                <br/>
                                <b>Change the weigth of subset v2 to 100 and v1 to 0 and trigger the circuitBreaker</b>
                                <li><b>All requests succeed</b><br/>
                                In the DestinationRule settings, under subset v2, we specified maxConnections: 3 and http1MaxPendingRequests: 3. These rules indicate that it can handle 3 connections and requests concurrently.
                                </li>
                                Requests fail if you exceed more than 3
                            </ul>
                </div>
                :
                <div>
                    <table id="panel">
                        <tbody>               
                            <tr>
                                <td>Parallel Connections</td>
                                <td><input className="in" type="text" onChange={(e)=>{this.setState({p: e.target.value})}}></input></td>
                            </tr>                  
                            <tr>
                                <td>Total Requests</td>
                                <td><input className="in" type="text" onChange={(e)=>{this.setState({r: e.target.value})}}></input></td>
                            </tr>
                            <tr>
                                <td>Target URL</td>
                                <td><input className="in" type="text" onChange={(e)=>{this.setState({u: e.target.value})}}></input></td>
                            </tr>

                            <tr>
                                <td><MyButton buttonStyle={{width: "50%", height: "45px"}} label="Stress" func={this.stress}/></td>
                            </tr>             
                        </tbody>      
                    </table>               
                    <div id="outputx">
                        <div id="stdoutx">
                            <table style={{color: "rgb(46, 108, 230)"}}>
                                <tbody>
                                    {
                                    this.state.show?
                                        Object.keys(myd.data).map((key, i) => (
                                            <tr key={i}>
                                                <td style={{fontWeight: "bold"}}>{key}</td>
                                                <td>{myd.data[key]}</td>
                                            </tr>
                                        ))
                                        :
                                        <tr>
                                            <td>{this.state.pd}</td>
                                        </tr>
                                    }
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
                }
            </div>
            )
        }
    }

export default CircuitBreaker;
