import './register.css';
import { useState } from 'react';
import Spinner from 'react-spinkit'
import { useHistory } from 'react-router-dom';
import axios from 'axios';
import { useAlert } from "react-alert";


function App() {
    const [expand, setExpanded] = useState("");
    const [hidden, setHidden] = useState("");
    const [background, setBackground] = useState("");
    const [button, setButton] = useState("hidden");
    const [formHidden, setFormHidden] = useState("hidden");
    const [full, setFull] = useState("");
    const [fab, setFab] = useState("");
    const [text, setText] = useState("text");
    const [headerHidden, setHeaderHidden] = useState("hidden");
    const [registration, setRegistration] = useState(false);
    const [hideSecondBtn, setBtn] = useState("")
    const alert = useAlert();
    let history = useHistory();

    const [dob, setDob] = useState(new Date())
    const [name, setName] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")
    const [description, setDescription] = useState("")
    const [city, setCity] = useState("")
    const [street, setStreet] = useState("")
    const [zip, setZip] = useState("")


    const signUp = () => {
        setExpanded("expanded");
        setHidden("hidden");
        setBackground("background");
        setButton("");
        setFormHidden("");
    }

    const ButtonClicked = async () => {

        if (confirmPassword !== password) {
            alert.error("Passwords do not match");
        } else if (name.length < 3 || name.length > 20) {
            alert.error("Something went wrong");
        } else if (email === "" || email.indexOf("@") === -1 || email.indexOf(".") === -1 || dob === "") {
            alert.error("Something went wrong, check your email and correct date or birth");
        } else {
            axios({
                method: "post",
                url: "http://localhost:3001/api/user",
                data: {
                    email: email,
                    password: password,
                    name: name,
                    dob: dob,
                    description: description,
                    address: {
                        street: street,
                        city: city,
                        zip: zip
                    }
                },
                headers: {
                    'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE,PATCH,OPTIONS',
                    "Content-Type": "application/json",
                }

            })
                .then(function (response) {
                    //handle success
                    console.log("response", response);
                    if (response.status === 200) {
                        setFull("full");
                        setFab("fab");
                        setText("");
                        setHidden("hidden");
                        setFormHidden("hidden");
                        setHeaderHidden("");

                        history.push("/");
                        setRegistration(true);
                        alert.show("Registration successful, you can login");
                    } else if (response.status === 409) {
                        console.log(response);
                        alert.error("Email already exists");
                    } else {
                        alert.error("Something went wrong");
                    }
                })
                .catch(function (response) {
                    //handle error
                    if (response.status === 409) {
                        alert.error("Email already exists");
                    }
                    alert.error("User already exist");
                    console.log(response.status);
                });
        }
    }






    return (
        <body>
            < div className={"app"} >
                <div className={"content " + background}>
                    <div className={"header " + headerHidden}></div>
                    <div className={"button " + expand + " " + full}>
                        <div className={"sign-up " + hidden} onClick={() => [setBtn("hidden"), signUp()]}>SIGN UP</div>
                        <form className={formHidden} style={{ display: "block" }}>
                            <input type="text" onChange={val => setName(val.target.value)} required="true" placeholder="Username" />
                            <input type="email" onChange={val => setEmail(val.target.value)} placeholder="Email Id" />
                            <input type="password" onChange={val => setPassword(val.target.value)} placeholder="Password" />
                            <input type="password" onChange={val => setConfirmPassword(val.target.value)} placeholder="Confirm Password" />
                            <input type="text" onChange={val => setDescription(val.target.value)} placeholder="Description" />
                            <input type="date" onChange={val => setDob(val.target.value)} placeholder="DOB" />
                            <input type="address" onChange={val => setCity(val.target.value)} placeholder="City" />
                            <input type="address" onChange={val => setStreet(val.target.value)} placeholder="Street" />
                            <input type="address" onChange={val => setZip(val.target.value)} placeholder="zip" />
                        </form>
                        <button className={button + " " + fab} onClick={() => registration ? history.push('/') : ButtonClicked()}
                        >{registration ? "LOGIN" : "DONE"}<span className={text}></span></button>
                        <Spinner name="ball-scale-ripple-multiple" className={"spinner"} color="aqua" />

                    </div>
                    <button className={"btn " + hideSecondBtn} onClick={() => history.push('/')}>LOGIN</button>

                </div>
            </div >
        </body >
    );
}

export default App;
