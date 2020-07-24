import React, { Component } from 'react'
import axios from 'axios';
import { GoogleLogin, GoogleLogout } from 'react-google-login';
// import Axios from 'axios';
class OAuth extends Component {
    constructor(props) {
        super(props)
    
        this.state = {
            //  name: '',
            //  password: '',
             login: false,
            //  store: null,
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
        token: response.tokenId
    }))
    this.setState({login: true})
}
responseFGoogle = (response)=>{
    console.log("[F] response"+ JSON.stringify(response));
}
authAccess = ()=>{
    if(this.state.login===true){

        let t = JSON.parse(localStorage.getItem('login'))
        
        axios.get('/info', {
            headers: {
              Authorization: 'Bearer ' + t.token
            }
           }).then((res)=>{
                //this.setState({pd: res.data})
                this.setState({pd: res.data})
                console.log("AUTHRES: "+ JSON.stringify(res))
        }).catch((err)=>{
		console.log("AUTHERROR: " + err)
		if(err.response){
			this.setState({pd: err.response.status})
		}
		})
    }
    else{
	console.log("Login First")
	this.setState({pd: "Please Login"})
	}
}
noauthAccess = ()=>{  
        axios.get('/info').then((res)=>{
                this.setState({pd: res.data})
                console.log("NOAUTHRES: "+ res.data)
        }).catch((err)=>{
		console.log("NOAUTHERROR: " + err)
		if(err.response){
			this.setState({pd: err.response.status})
		}
	})
}
// clearLS =()=>{
//     localStorage.removeItem('login')
// }

logout = ()=>{
    localStorage.removeItem('login')
    this.setState({login: false})
    this.setState({myname: ""})
}
getHeaders = ()=>{
        axios.get('/headers').then((res)=>{
                //console.log("headers: "+ res)
		console.log("headers" + JSON.stringify(res.data))
                this.setState({pd: "Free Access"})
        }).catch((err)=>{
		console.log("headersERR: " + err)
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
    render() {
        // const { name, password, pd, login } = this.state;

        return (

            <div id="register">
            <h1>v2</h1>
            { this.state.login ?
                <GoogleLogout
                clientId="173603032325-ujvfa9gh83ibc36lr56hrqi442si4bf4.apps.googleusercontent.com"
                buttonText='Logout'
                onLogoutSuccess={ this.logout }
                onFailure={ this.responseFGoogle }
                >
                </GoogleLogout>:
                <GoogleLogin
                    clientId="173603032325-ujvfa9gh83ibc36lr56hrqi442si4bf4.apps.googleusercontent.com"
                    buttonText="Login"
                    onSuccess={this.responseSGoogle}
                    onFailure={this.responseFGoogle}
                    cookiePolicy={'single_host_origin'}
                />
                }
                <br/><br/>
                <h3>{this.state.myname}</h3>
                <br/><br/>
                <button onClick={this.authAccess}>info(yesToken)</button>
                {/* <button onClick={this.clearLS}>clear localStorage</button> */}
                <button onClick={this.noauthAccess}>info(noToken)</button>
                <button onClick={this.getHeaders}>headers</button>

                <br/><br/>
            <span>{this.state.pd}</span>

            </div>

        )
    }
}

export default OAuth









