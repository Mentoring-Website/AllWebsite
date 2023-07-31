import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom/dist";
import "./Profile.css";
import { mentor4 } from "../../assets";
import { useParams } from "react-router-dom/dist";
import CalendarDays from "./calender-days";
import { useSelector } from "react-redux";
import { Localhost } from "../../config/api";
import { Error, Success } from '../../components/Toast';
import axios from "axios";

function Profile() {
  axios.defaults.withCredentials = true;
  const user = useSelector(state => state.currentUser);
  const isMentee = user?.role === 'mentee';
  const { id } = useParams();
  const [guestProfile, setGuestProfile] = useState('');
  const [profile, setProfile] = useState({
    user: {name: '', email: ''},
    designation: '',
    avatar:  '', 
    role: 'mentee', 
    currentCompany: '', 
    university: '',
    yearsOfExperence: 0, 
    phone: '000',
    availableForHiring: true, 
    about: 'sixteen free code camp', 
    expertise: [{name: '', from: '', to: ''}], 
    skills: [] });
  const [messages, setMessages] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [msgBtnClicked, setMsgBtnClicked] = useState(false);
  const [msgContent, setMsgContent] = useState("");
  const [oppOrReq, setOppOrReq] = useState([]);
  const [dealtWith, setDealtWith] = useState([]);
  const [calendardate, setCalendarDate] = useState();
  const [date, setDate] = useState({currentDay: new Date()});
  const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const months = ['January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'];

  useEffect(() => {
    const getProfile = async() => {
        document.cookie = 'accessToken=' + user?.tokens[0]?.slice(1, -1)
        // get guest and user
        await axios.get(`${Localhost}/api/v1/mentorProfile/user/${id}`)
        .then(res=>{
          setProfile(res?.data)
          // get dealtWith
          if(res?.data?.dealtWith){
            let dealers = [];
            res?.data?.dealtWith?.forEach(async dealer =>{
              await axios.get(`${Localhost}/api/v1/mentorProfile/user/${dealer?._id}`)
              .then(deal=>{
              dealers.push({
                avatar: deal?.avatar,
                name: dealer?.name
              })
              }).catch(e=> Error(e.message))
            })
            setDealtWith(dealers)
          }
        }).catch(e=> Error(e.message))
        await axios.get(`${Localhost}/api/v1/mentorProfile/user/${(user._id)}`)
        .then(guestRes=>setGuestProfile(guestRes?.data)).catch(e=> Error(e.message))

        // get user messages
        await axios.get(`${Localhost}/api/v1/message/receiver/${id}`)
        .then(getMessages=>{
        const fullMsg = getMessages?.data?.map((msg)=>{
           return({
              id: messages.length, 
              name: msg?.sender?.name || 'Unknown', 
              avatar: msg?.sender?.avatar || "https://images.unsplash.com/photo-1489753735160-2cbf3d9006d4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=870&q=80",
              messageContent: msg?.messageContent || 'none'
            })
          })
          setMessages([...fullMsg]);
        }).catch(e=>Error(e.message))
        // get user opportunities
        if(profile?.user?.role === "mentor"){
          await axios.get(`${Localhost}/api/opp/opp/owner/${id}`)
          .then(getOpenOppOrReq=>setOppOrReq(getOpenOppOrReq?.data))
        }else{
          await axios.get(`${Localhost}/api/req/request/owner/${id}`)
          .then(getOpenOppOrReq=>setOppOrReq(getOpenOppOrReq?.data))
        }
      }

    const calendarbusy = async () => {
      try {
        const res = await axios.get(`${Localhost}/calendar`);
        setCalendarDate(res.data);
      } catch (e) {
        Error(e.message);
      }
    };
    getProfile()
    calendarbusy();
  }, []);
  
 const changeCurrentDay = (day = date.currentDay) => {
    setDate({ currentDay: new Date(day.year, day.month, day.number) });
  };
  
  const handleSend = () => {
    // Create a new message object with the desired values
    const newMessage = {
      id: messages.length,
      name: guestProfile?.user?.name || "Unknown",
      avatar: guestProfile?.avatar || "https://images.unsplash.com/photo-1489753735160-2cbf3d9006d4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=870&q=80",
      messageContent: msgContent || "...",
    };
    setMessages(prev=>[...prev, newMessage]);
  };
  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  // Filter the messages based on the search term
  const filteredMessages = messages.filter((message) =>
    message?.messageContent?.toLowerCase()?.includes(searchTerm.toLowerCase())
  );
  // connect message to back
  const handleMessage = async (e)=>{
    e.preventDefault();
    await axios.post(`${Localhost}/api/v1/message/${id}` ,{
      messageContent: msgContent,
    })
    .then(() =>{
      Success('Message sended')
      handleSend();
      setMsgBtnClicked(!msgBtnClicked);
    })
    .catch((error)=>{Error(error.message);})
  }

  const applyForOpp = async (id) => {
    await axios.patch(`${Localhost}/api/auth/applicant/opp/${id}`)
    .then(() =>{
      Success('Applied Successfully')
    })
    .catch((e)=>{Error(e.message);})
  }
  
  const applyForReq = async (id) => {
    await axios.patch(`${Localhost}/api/auth/applicant/request/${id}`)
    .then(() =>{
      Success('Applied Successfully')
    })
    .catch((e)=>{Error(e.message);})
  }

  return (
    <div className="container-xl">
      <div className="row" style={{ marginTop: "8%" }}>
        <div className="col-lg-3 col-md-2">
          <div className="d-lg-block d-sm-none" style={{ lineHeight: "35px" }}>
            <ul className="list-group list-unstyled">
              <li className="list-item">
                <Link to = {'/edituser/'+user?._id} >Edit Profile</Link>
              </li>
              <li className="list-item">
                <Link to= {'/edituser/'+user?._id} >Settings</Link>
              </li>
              <li className="list-item">
                <Link to="">Terms and Privacys</Link>
              </li>
            </ul>
            <p className="">
              {isMentee ? (
                <Link to= "/mentorreqapp" >My Requests</Link>
              ) : (
                <Link to= "/mentoroppapp" >My Oppourtunities</Link>
              )}
            </p>
            <Link to = {isMentee ? "/PostRequest" : "/PostOpp"} >
              <button className="bg-none">
                {isMentee ? "Post a new Requests" : "Post a new Oppourtunity"}
                <i className="fa fa-plus"
                style={{ color: "white", backgroundColor: "#007580", fontSize: "10px", padding: "5px", marginLeft: "5px", }}
                ></i>
              </button>
            </Link>
          </div>
        </div>
        <div className="col-lg-6 col-md-12">
          <div className="--profile-head rounded">
            <div className="d-flex flex-column flex-wrap justify-content-center align-items-end p-2">
              <button className="btn btn-warning rounded-pill">Message</button>
            </div>
            <div className="--profile-body d-flex flex-column flex-wrap justify-content-center align-items-center">
              <img src={profile?.avatar} alt="userImage" className="w-25 h-25 rounded-circle" />
              <h4 className="fs-5 pt-4">{ profile?.user?.name }</h4>
              <h5 className="fs-6 p-1">{ profile?.designation }</h5>
              <span className="text-white text-uppercase">{ profile?.user?.role }</span>
            </div>
            <div className="--inner-icons d-lg-none d-sm-flex justify-content-end align-items-end gap-2">
              <span>
                <i className="fa-solid fa-envelope fs-3"></i>
              </span>
              <span>
                <i className="fa-solid fa-calendar-days fs-3 pe-2"></i>
              </span>
            </div>
          </div>
          <div className="--personal-info mt-4">
            <div className="d-flex flex-row gap-4">
              <h3 className="border-bottom border-warning fs-6">Personal Information</h3>
              <h3 className="fs-6">Addiontional Information</h3>
            </div>
            <div className="p-3 rounded" style={{ backgroundColor: "#f7f7f7" }}>
              <div className="d-flex">
                <div className="col">
                  <div>
                    <label htmlFor="name" style={{ color: "#007580" }}>Name</label>
                    <br />
                    <span>{ profile?.user?.name }</span>
                  </div>
                    <div>
                      <label htmlFor="name" style={{ color: "#007580" }}> JobTitle </label>
                      <br />
                      <span>{ profile?.designation }</span>
                    </div>
                  {profile?.user?.role === "mentor" ? (
                    <div>
                      <div>
                      <label htmlFor="company" style={{ color: "#007580" }}>Company</label>
                      <br />
                      <span>{ profile?.currentCompany }</span>
                    </div>
                    
                    <div>
                      <label htmlFor="yearsOfExperence" style={{ color: "#007580" }}>Years Of Experence:</label>
                      <br />
                      <span>{ profile?.yearsOfExperence }</span>
                    </div>
                    </div>
                  ) : (
                    <div>
                      <label htmlFor="unviersity" style={{ color: "#007580" }}>
                        Unviersity
                      </label>
                      <br />
                      <span>{ profile?.university }</span>
                    </div>
                  )
                  }
                </div>
                <div className="col">
                  <div>
                    <label htmlFor="phone" style={{ color: "#007580" }}>Phone Number:</label>
                    <br />
                    <span>{ profile?.phone }</span>
                  </div>
                  <div>
                    <label htmlFor="email" style={{ color: "#007580" }}>Email</label>
                    <br />
                    <span>{profile?.user?.email || "Balquees@gmail.com"}</span>
                  </div>
                  {profile?.user?.role === "mentor" ? ("") : (
                    <div className="mt-3">
                      <span className="bg-warning text-white p-2 rounded-pill">
                        JOB SEEKER{" "}
                        { profile?.availableForHiring 
                        ?<i className="fa-solid fa-exclamation --icon-not"></i>
                        :("") }
                      </span>
                    </div>
                  )}
                </div>
              </div>
              <p className="" style={{ fontSize: "15px", marginTop: "5%" }}>
                { profile?.about || "Lorem Ipsum has been the industry's standard dummy text ever"}
              </p>
              <div className="--user-exp">
                <h5 style={{ color: "#007580", fontSize: "15px" }}>
                  Experience
                </h5>
                {
                  profile?.expertise?.map((exp, i)=>{
                    return (
                      <div key={i} className="d-flex justify-content-between">
                        <span>{ exp?.name }</span>
                        <span style={{ color: "#007580" }}>{ exp?.from }-{ exp?.to }</span>
                      </div>
                    )
                  })
                }
              </div>
              <div className="--user-skills mt-3">
                <h5 style={{ color: "#007580", fontSize: "15px" }}>Skills</h5>
                <div className="col-3 mt-4">
                 {profile?.skills && profile?.skills?.map((skill, i)=>{ 
                    return (<span key={i}>{skill}</span>)
                  })}
                </div>
              </div>
              {profile?.user?.role === "mentor" ? (
                <div>
                  <h5 style={{ color: "#007580", fontSize: "15px", marginTop: "8%", }}>
                    Open Mentoring Oppourtunity
                  </h5>
                  {
                    oppOrReq?.map((opp, i)=>{
                      if(opp?.progress === 'open')
                      return (
                        <div className="d-flex justify-content-around align-items-center mt-3 rounded p-3 gap-1" style={{ backgroundColor: "azure" }} key={i}>
                          <h6 style={{ fontSize: "14px" }}> {opp?.title} </h6>
                            <Link className="btn bg-warning rounded-pill text-white" style={{ padding: "2px 30px" }} 
                            to={"/ShowOpp/"+opp._id}> View 
                            </Link>
                          <button className="btn bg-warning rounded-pill text-white" style={{ padding: "2px 30px" }} onClick={()=>applyForOpp(opp._id)}> Apply </button>
                        </div>)
                      else return(<></>)
                    })
                  }
                  
                  <h5 style={{ color: "#007580", fontSize: "15px", marginTop: "8%", }}>
                    Past mentees
                  </h5>
                  <div className="d-flex">
                  {dealtWith?.map((mentee, i)=>{
                    return(
                    <div key={i}>
                      <img src={mentee?.avatar || mentor4} alt="menteeimage" className="w-75 h-75 img-thumbnail" />
                      <h5 style={{ fontSize: "14px", paddingTop: "5px" }}> {mentee?.name} </h5>
                      <h6 style={{ color: "#007589", fontSize: "12px" }}> Student </h6>
                    </div>)}
                  )}
                  </div>
                  <button className="btn rounded-pill text-white mt-5" style={{ backgroundColor: "#007580", padding: "10px 42px" }} >
                    Download Cv
                  </button>
                </div>
              ) : (
                <>
                  <h5 style={{ color: "#007580", fontSize: "15px", marginTop: "8%", }} >
                    Open Mentoring Requets
                  </h5>
                  <div className="rounded" style={{ backgroundColor: "rgba(0, 117, 137, 0.33)", marginTop: "4%", padding: "18px", }} >
                    {oppOrReq?.map((req, i)=>{
                      if(req?.progress === 'open')
                      return (
                      <div key={i}>
                        <div className="d-flex flex-row justify-content-between align-items-center">
                          <h4 className="fs-4" style={{ color: "#007580" }}>
                            {req?.title}
                          </h4>
                          <div className="d-flex align-items-end gap-2">
                            <Link  className="btn rounded-pill bg-warning" style={{ padding: "4px 21px" }} to={"/ShowReq/"+req?._id}>View
                            </Link>
                            {user?.role === "mentor"
                            ? ( req?.applicants?.indexOf(user?._id) === -1
                            ?<button className="btn rounded-pill bg-warning" style={{ padding: "4px 21px" }} onClick={()=>applyForReq(req._id)}>
                              Apply
                            </button>
                            :<button className="btn rounded-pill bg-warning" style={{ padding: "4px 21px" }}>
                            Applied
                          </button>
                            ) : ""}
                          </div>
                        </div>
                        <h3 className="fs-6">{profile?.user?.name}{" "}
                          <span style={{ color: "#007580", fontSize: "12px" }}>
                            is looking for a mentor{" "}
                          </span>
                        </h3>
                        <p className="text-dark" style={{ fontSize: "12px", marginTop: "5%" }} >
                          {req?.description}
                        </p>
                        <summary className="list-unstyled">...read more</summary>
                        <div style={{ marginLeft: "-6%", marginTop: "3%" }}>
                          <ul style={{ display: "grid", gridTemplateColumns: "repeat(2,auto)", listStyle: "none", }} >
                            <li style={{ color: "#007580", fontSize: "14px" }}>
                              Duration : 
                              <span className="text-dark">{req?.duration / 30 || "Open"}</span>
                            </li>
                            <li style={{ color: "#007580", fontSize: "14px" }}>
                              Paid : 
                              <span className="text-dark">{
                                req?.paid?.isPaid? "Yes": "No"
                              }</span>
                            </li>
                            <li style={{ color: "#007580", fontSize: "14px" }}>
                              Looking for a Job :
                              {" "}
                              <span className="text-dark">Yes</span>
                            </li>
                            <li style={{ color: "#007580", fontSize: "14px" }}>
                              Experience : 
                              <span className="text-dark">{req?.experience || "None"}</span>
                            </li>
                          </ul>
                        </div>
                      </div>
                      )
                      else return(<></>)
                      })}
                  </div>

                  <h5 style={{ color: "#007580", fontSize: "15px", marginTop: "8%", }} >
                    Perviously Mentored By
                  </h5>
                  {dealtWith.map((mentor, i)=>{
                    return(
                    <div className="d-flex justify-content-between" key={i}>
                      <div className="d-block mt-2">
                        <h5 className="fs-5">{mentor?.designation}</h5>
                        <h6 className="fs-6 ps-2"> Mentored By: <span>{mentor?.name}</span></h6>
                      </div>
                      <Link to={"/external/"+mentor?.user?._id || mentor?.user} className="btn bg-warning rounded-pill" style={{ height: "36px", padding: "0px 27px" }} >
                        View
                      </Link>
                    </div>)
                  })}
                  <button
                    className="btn rounded-pill text-white mt-5"
                    style={{ backgroundColor: "#007580", padding: "10px 42px" }}
                  >
                    Download Cv
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
        <div className="col-lg-3 col-md-2 sm-d-none">
          <div
            className="wrappz"
            style={{ backgroundColor: "#d2d2d24f", padding: "13px", width: "fit-content", }}>
            <div className="d-flex align-items-center text-center">
              <input className="rounded mt-2 text-white text-center" style={{ backgroundColor: "#007580", padding: "9px 40px" }}
              type="text" value={searchTerm} placeholder="Search" onChange={handleSearch} />
              <i className="fa-solid fa-magnifying-glass" style={{ marginLeft: "-20%", color: "white", fontsize: "17px", marginTop: "2%", }} > </i>
            </div>
            {/* get messages */}
            <div className="msgs" style={{ marginTop: "4%", padding: "12px" }}>
              {filteredMessages?.map((msgs, i) => {
                return (
                  <div className="d-flex gap-5 align-items-center" key={i} >
                    <img src={msgs.avatar} alt="userImages" className="w-25 h-25 rounded-circle" />
                    <div className="d-block">
                      <h4 style={{ fontSize: "14px" }}> {msgs.name} </h4>
                      <p style={{ fontSize: "12px", color: "gray" }}> {msgs.messageContent} </p>
                    </div>
                  </div>
                );
              })}
              {/* post messages */}
              <div className="d-flex flex-column gap-2">
                <div className="d-flex flex-column gap-2" >
                  <div className='d-flex flex-column gap-2'>
                    <button className={`${msgBtnClicked ? 'd-none' : 'd-flex justify-content-center'} btn btn-warning`} 
                    onClick={() => { setMsgBtnClicked(!msgBtnClicked); }}>
                      New Message
                    </button>
                    <div className={ msgBtnClicked ?  'd-flex flex-column gap-2' : 'd-none' }>
                      <textarea className='mt-2 w-100 p-1 rounded border-bottom border-warning' placeholder='enter your message'
                      id='inputMsgContent' name='textarea' value={msgContent}   
                      onChange={(e)=>{setMsgContent(e.target.value)}} />
                      <button className='btn btn-warning'
                      type="submit" onClick={(e)=> handleMessage(e)} >
                        Send
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div style={{ position: "relative", top: "12%", left: "2%" }}>
            {
              <div className="calendar">
                <div className="calendar-header">
                  <h2>{months[date.currentDay.getMonth()]} </h2>
                </div>
                <div className="posdate">
                  <div className="day">{date.currentDay.getDate()}</div>
                  <div className="year">{date.currentDay.getFullYear()}</div>
                </div>
                <div className="calendar-body">
                  <div className="table-header">
                    {weekdays.map((weekday, i) => {
                      return (
                        <div className="weekday" key={i}>
                          <p>{weekday}</p>
                        </div>
                      );
                    })}
                  </div>
                  <CalendarDays
                    day={date.currentDay}
                    changeCurrentDay={changeCurrentDay}
                    unavilable={calendardate?.busyDays}
                  />
                </div>
              </div>
            }
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;
