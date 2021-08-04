import './login.css';
import { useState } from 'react';
import Spinner from 'react-spinkit'
import axios from 'axios';
import { useAlert } from "react-alert";
import { useHistory } from 'react-router-dom';




function Login() {
    const [expand, setExpanded] = useState("");
    const [hidden, setHidden] = useState("");
    const [background, setBackground] = useState("");
    const [button, setButton] = useState("login_hidden");
    const [formHidden, setFormHidden] = useState("login_hidden");
    const [full, setFull] = useState("");
    const [fab, setFab] = useState("");
    const [text, setText] = useState("text");
    const [headerHidden, setHeaderHidden] = useState("login_hidden");
    const alert = useAlert();
    let history = useHistory();
    const [name, setName] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [hideSecondBtn, setBtn] = useState("")


    const logIn = () => {
        setExpanded("login_expanded");
        setHidden("login_hidden");
        setBackground("login_background");
        setButton("");
        setFormHidden("");
    }

    const ButtonClicked = async () => {

        if (name.length < 3 || name.length > 20) {
            alert.error("name should be between 3 and 20 characters");
        } else if (email === "" || email.indexOf("@") === -1 || email.indexOf(".") === -1) {
            alert.error("Something went wrong, check your email ");
        } else {

            try {
                await axios({
                    method: "post",
                    url: "http://localhost:3001/api/sessions",
                    data: {
                        email: email,
                        password: password,
                    },
                    headers: {
                        'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE,PATCH,OPTIONS',
                        "Content-Type": "application/json",
                    }
                })
                    .then(function (response) {
                        //handle success
                        if (response.status === 200) {
                            setFull("login_full");
                            setFab("login_fab");
                            setText("");
                            setHidden("login_hidden");
                            setFormHidden("login_hidden");
                            setHeaderHidden("")
                            console.log(response);
                            let tokens = {
                                accessToken: response.data.accessToken,
                                refreshToken: response.data.accessToken
                            };
                            localStorage.setItem('tokens', JSON.stringify(tokens));
                            history.push("/home");
                        } else if (response.status === 400 || response.status === 401) {
                            alert.error("Invalid username or password");
                        } else {
                            alert.error("Something went wrong, check your details and try again ");
                        }
                    })
                    .catch(function (response) {
                        //handle error
                        console.log(response);
                    });

            } catch (error) {
                console.log(error);
            }
        }
    }


    return (
        <>
            <div className={"login_app"} >
                <div className={"login_content " + background}>
                    <div className={"login_header " + headerHidden}></div>
                    <div className={"login_button " + expand + " " + full}>
                        <div className={"login_sign-up " + hidden} onClick={() => [setBtn("hidden"), logIn()]}>SIGN IN</div>
                        <form className={formHidden} style={{ display: "block" }}>
                            <input type="name" onChange={val => setName(val.target.value)} placeholder="Name" />
                            <input type="email" onChange={val => setEmail(val.target.value)} placeholder="Email" />
                            <input type="password" onChange={val => setPassword(val.target.value)} placeholder="Password" />
                        </form>
                        <button className={button + " " + fab} onClick={() => ButtonClicked()}
                        >DONE<span className={text}></span></button>
                        <Spinner name="ball-scale-ripple-multiple" className={"spinner"} color="aqua" />

                    </div>
                    <button className={"btn " + hideSecondBtn} onClick={() => history.push('/register')}>REGISTER</button>

                </div>
            </div>
        </>
    );
}

export default Login;
