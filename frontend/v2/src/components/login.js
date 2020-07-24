import React, { Component } from 'react'
import axios from 'axios';
class service1 extends Component {
    constructor(props) {
        super(props)
    
        this.state = {
             name: '',
             password: '',
             login: false,
             store: null,
             pd:' '
        }
    }
   
login = (e)=>{
    // console.log(this.state)
    axios.post('/login', this.state).then((res)=>{
        localStorage.setItem('login', JSON.stringify({
            login: true,
            token: res.data.token
        }))
        // console.log(res.data.token);
        this.setState({login: true})
    }).catch((err)=>{console.log("L.ERROR: " + err)})
}
register = (e)=>{
    // console.log(this.state)
    axios.post('/register', this.state).then((res)=>{
        console.log(res);
    }).catch((err)=>{console.log("R.ERROR: " + err)})
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
private = ()=>{
    if(this.state.login===true){

        let t = JSON.parse(localStorage.getItem('login'))
        
        axios.get('/private', {
            headers: {
              Authorization: 'Bearer ' + t.token
            }
           }).then((res)=>{
                this.setState({pd: res.data})
                console.log(res.data)
        })
    } 
    else{
        this.setState({pd: "please Login"})
    } 

}
logout = ()=>{
    this.setState({login: false})
    localStorage.removeItem('login')
    this.setState({pd: "please Login"})
}
    render() {
        const { pd, login } = this.state;

        return (

            <div id="register">
                <input type="text" onChange={(e)=>{this.setState({name: e.target.value})}}></input><br/><br/>
                <input type="password" onChange={(e)=>{this.setState({password: e.target.value})}}></input><br/><br/>
                
                {pd}<br/><br/>
                <button onClick={this.private}>Show</button><br/><br/>
                {login?<button onClick={this.logout}>LogOut</button>:<button onClick={this.login}>Login</button>}
                <button onClick={this.register}>Register</button><br/><br/>                
            </div>

        )
    }
}

export default service1









