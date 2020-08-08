import { GoogleLogin, GoogleLogout } from 'react-google-login';
import React, { Component } from 'react'
import './glogin.css';
var i=0;
class Glogin extends Component {
    constructor(props) {
        super(props)
    
        this.state = {
            login: false,
            pd:' ',
            myname: ''
        }
    }
    
responseSGoogle = (response)=>{
    console.log(response);
    console.log("Token: "+ response.tokenId);
    console.log(response.profileObj.name);
    this.setState({myname: response.profileObj.name})

    localStorage.setItem('login', JSON.stringify({
        login: true,
        token: response.tokenId,
        myname: response.profileObj.name
    }))
    this.setState({login: true})
    this.props.setLock(true)
    this.typeName(this.state.myname)
}
responseFGoogle = (response)=>{
    console.log("[F] response"+ JSON.stringify(response));
}

componentDidMount = ()=>{
    this.storeCollector()
}

storeCollector = ()=>{
    let store = JSON.parse(localStorage.getItem('login'))
    if(store && store.login){
        this.setState({login: true})
        this.setState({myname: store.myname})
    }
    else{
	    localStorage.setItem('login', JSON.stringify({
		login: false,
		token: "token",
		myname: ""
	    }))
      
}
    if(store && store.login){
        i=0;
        this.props.setLock(store.login)
        this.typeName(store.myname);
    }
}

logout = ()=>{
    //localStorage.removeItem('login')
    localStorage.setItem('login', JSON.stringify({
        login: false,
        token: "token",
        myname: ""
    }))
    this.setState({login: false})
    this.setState({myname: ""})
    this.props.setLock(false)
}

typeName = (v)=>{
    var txt = v
    if (i < txt.length) {
        document.getElementById("myname").innerHTML += txt.charAt(i);
        i++;
        setTimeout(() => {
            this.typeName(v)
          }, 50);
    }
} 
// trip = async ()=>{
//     await this.setState({login: !this.state.login})
//     this.props.setLock(this.state.login)
//     await this.state.login?this.typeName("Allandhir Megharaj"):this.typeName(" ");
// }
    render(){
        return(
            <div id="glogin">
                <div id="gmail">
                { this.state.login ?
                    <GoogleLogout
                    clientId="173603032325-8git4vv6b5h4lfhnqmiussdll3vue0c4.apps.googleusercontent.com"
                    //clientId="173603032325-ujvfa9gh83ibc36lr56hrqi442si4bf4.apps.googleusercontent.com"
                    buttonText='Logout'
                    onLogoutSuccess={ this.logout }
                    onFailure={ this.responseFGoogle }
                    className="gbutt"
                    >
                    </GoogleLogout>
                    :
                    <GoogleLogin
                    clientId="173603032325-8git4vv6b5h4lfhnqmiussdll3vue0c4.apps.googleusercontent.com"
                    //clientId="173603032325-ujvfa9gh83ibc36lr56hrqi442si4bf4.apps.googleusercontent.com"
                    buttonText="Login"
                    onSuccess={this.responseSGoogle}
                    onFailure={this.responseFGoogle}
                    cookiePolicy={'single_host_origin'}
                    className="gbutt"
                    />
                }
                
                </div>
                {/* <button onClick={this.trip}>trip</button> */}
                {this.state.login?
                    <svg className="checkmark" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 52 52"><circle className="checkmark__circle" cx="26" cy="26" r="25" fill="none"/><path className="checkmark__check" fill="none" d="M14.1 27.2l7.1 7.2 16.7-16.8"/></svg>
                    :
                    null
                }
                <br/><br/>
                <div id="myname"></div>
            </div>

        )
    }
}

export default Glogin;
