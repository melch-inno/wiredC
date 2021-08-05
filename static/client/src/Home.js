import './home.css';
import { useState, useEffect } from 'react';
import Spinner from 'react-spinkit'
import axios from 'axios';
import { useAlert } from "react-alert";
import { useHistory } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCoffee, faTrashAlt } from '@fortawesome/free-solid-svg-icons'




function Home() {

    const alert = useAlert();
    let history = useHistory();
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [hideSecondBtn, setBtn] = useState("")
    const [hideInfo, setInfo] = useState("hidden")
    let tokens = JSON.parse(localStorage.getItem('tokens'));
    const [userId, setUserId] = useState("");
    const [userInfo, setUserInfo] = useState({});
    const [address, setAddress] = useState([]);

    useEffect(() => {
        if (tokens === "" || tokens === null || tokens === undefined) {
            history.push('/');
        } else {
            console.log(tokens.accessToken, tokens.refreshToken);
            getUserSession()
        }
        // console.log(tokens);
    }, [])



    const getUserSession = async () => {
        try {
            await axios({
                method: "get",
                url: 'http://localhost:3001/api/sessions',
                headers: {
                    "Authorization": `Bearer ${tokens.accessToken}`,
                    'x-refresh': tokens.refreshToken,
                    'Accept': '*/*',
                    'Access-Control-Allow-Methods': 'GET',
                    'Content-Type': 'application/json',
                }
            })
                .then(function (response) {
                    //handle success
                    if (response.status === 200) {
                        console.log(response.data[0].user);
                        setUserId(response.data[0].user);
                    } else if (response.status === 400 || response.status === 401) {
                        alert.error("Invalid username or password");
                    } else if (response.status === 403 || response.status === 404) {
                        console.log(response);
                        alert.error("Something went wrong, login again ");
                        history.push('/');
                    }

                })
                .catch(function (response) {
                    //handle error
                    console.log(response);
                    history.push('/');
                });

        } catch (error) {
            console.log(error);
        }

    }

    const getUserInfo = async () => {
        try {
            await axios({
                method: "get",
                url: `http://localhost:3001/api/user/${userId}`,
                headers: {
                    "Authorization": `Bearer ${tokens.accessToken}`,
                    'x-refresh': tokens.refreshToken,
                    'Accept': '*/*',
                    'Access-Control-Allow-Methods': 'GET',
                    'Content-Type': 'application/json',
                }
            })
                .then(function (response) {
                    //handle success
                    if (response.status === 200) {
                        setUserInfo(response.data);
                        setAddress(response.data.address);
                        setInfo("show");
                        console.log(response.data);
                    } else if (response.status === 400 || response.status === 401) {
                        alert.error("Invalid username or password");
                    } else if (response.status === 403 || response.status === 404) {
                        alert.error("Something went wrong, user is not found ");
                        history.push("/");
                    } else {
                        console.log(response);
                        alert.error("Something went wrong, check your details and try again ");
                    }
                })
                .catch(function (response) {
                    //handle error
                    console.log(response);
                    history.push("/");
                    alert.error("User not found");
                });

        } catch (error) {
            console.log(error);
        }
    }




    const Delete = async () => {
        try {
            await axios({
                method: "put",
                url: `http://localhost:3001/api/delete/user/${userId}`,
                data: {
                    "isDeleted": true,
                    "userId": userId,
                },
                headers: {
                    "Authorization": `Bearer ${tokens.accessToken}`,
                    'x-refresh': tokens.refreshToken,
                    'Accept': '*/*',
                    'Access-Control-Allow-Methods': 'PUT',
                    'Content-Type': 'application/json',
                }
            })
                .then(function (response) {
                    //handle success
                    if (response.status === 200) {
                        history.push("/");
                    } else if (response.status === 400 || response.status === 401) {
                        alert.error("Invalid username or password");
                    } else if (response.status === 403 || response.status === 404) {
                        alert.error("Something went wrong, user is not found ");
                        history.push("/");
                    } else {
                        alert.error("Something went wrong");
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

    function formatDate(date) {
        var d = new Date(date),
            month = '' + (d.getMonth() + 1),
            day = '' + d.getDate(),
            year = d.getFullYear();

        if (month.length < 2)
            month = '0' + month;
        if (day.length < 2)
            day = '0' + day;

        return [year, month, day].join('-');
    }


    return (
        <>
            <div className={"login_app"} >
                <div className={"login_content "}>
                    <div className={"user_detail " + hideInfo}>
                        <p>name: {userInfo.name}</p>
                        <p>email: {userInfo.email}</p>
                        <p>desc: {userInfo.description}</p>
                        <p>dob: {formatDate(userInfo.dob)}</p>
                        <p>address: <span>City: {address.city}</span> <span>Street: {address.street}</span> <span>Zip: {address.zip}</span></p>

                        <div className={"deleteUser"}><FontAwesomeIcon className={"icon"} icon={faTrashAlt} onClick={() => Delete()} /></div>

                    </div>
                    <button className={"btn " + hideSecondBtn} onClick={() => getUserInfo()}>Get user</button>

                </div>
            </div>
        </>
    );
}

export default Home;
