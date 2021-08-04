import './home.css';
import { useState, useEffect } from 'react';
import Spinner from 'react-spinkit'
import axios from 'axios';
import { useAlert } from "react-alert";
import { useHistory } from 'react-router-dom';




function Home() {
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
    let tokens = localStorage.getItem('tokens');

    useEffect(() => {
        if (tokens[0] === "") {
            history.push('/');
        }
        getUserInfo()
        console.log(tokens);
    }, [])



    const getUserInfo = async () => {
        try {
            await axios({
                method: "get",
                url: "http://localhost:3001/api/sessions",
                data: {
                    accessToken: tokens.accessToken,
                    refreshToken: tokens.refreshToken,
                },
                headers: {
                    'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE,PATCH,OPTIONS',
                    "Content-Type": "application/json", accessToken: tokens.accessToken, refreshToken: tokens.refreshToken
                }
            })
                .then(function (response) {
                    //handle success
                    if (response.status === 200) {

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

    const Delete = async () => {
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



    return (
        <>
            <div className={"login_app"} >
                <div className={"login_content "}>
                    <div className={"login_header"}>
                        <p>name: </p>
                        <p>email: </p>
                        <p>desc:</p>
                        <p>dob:</p>
                        <p>address:</p>

                    </div>
                    <button className={"btn " + hideSecondBtn} onClick={() => Delete()}>Delete user</button>

                    <button className={"btn " + hideSecondBtn} onClick={() => Delete()}>Delete user</button>

                </div>
            </div>
        </>
    );
}

export default Home;
