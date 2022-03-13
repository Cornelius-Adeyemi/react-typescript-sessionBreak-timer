import logo from './logo.svg';
import './App.css';
import { useState,useEffect, useRef } from 'react';
import { Component } from 'react';
// import {Howl, Howler} from 'howler';
// import beep from './shared/beep.mp3';



const accurateInterval = function (fn:()=>void, time:number) {
  var cancel, nextAt:number, timeout:NodeJS.Timeout|null, wrapper:()=>void;
  nextAt = new Date().getTime() + time;
  timeout = null;
  wrapper = function () {
    nextAt += time;
    timeout = setTimeout(wrapper, nextAt - new Date().getTime());
    return fn();
  };
  cancel = function () {
    return clearTimeout(timeout!);
  };
  timeout = setTimeout(wrapper, nextAt - new Date().getTime());
  return {
    cancel: cancel
  };
};


interface sessionFlexProps {
  break:number,
  handleBreak:(e: React.MouseEvent<HTMLDivElement, MouseEvent>)=>void,
  session:number,
  handleSession:(e: React.MouseEvent<HTMLDivElement, MouseEvent>)=>void
};





function SessionFlex(props:sessionFlexProps){



  return (<div className='flex-container'>
    <div className='flex-container-item'>
      <div id="break-label" className='h3' >{"Break length"}</div>
      <div className='display-flex'><div id='break-decrement' onClick={props.handleBreak}  data-name="decrease" className='i-container'><i className="fa fa-arrow-down"   aria-hidden="true"style={{fontSize:"30px",display:"flex",width:"35px"}}></i></div>
      <div id="break-length" className='text-display'>{props.break}</div ><div id="break-increment" onClick={props.handleBreak} data-name="increase"  className='i-container'><i   className="fa fa-arrow-up" aria-hidden="true" style={{fontSize:"30px",display:"flex",width:"35px"}} ></i></div></div>
    </div>
    <div className='flex-container-item'>
    <div id='session-label' className='h3'>{"Session length"}</div>
    <div className='display-flex'><div className='i-container' id="session-decrement" onClick={props.handleSession} data-name="decrease"><i className="fa fa-arrow-down"  style={{fontSize:"30px",display:"flex",width:"35px"}}></i></div>
    <div id="session-length" className='text-display'>{props.session}</div><div id="session-increment" className='i-container' onClick={props.handleSession}  data-name="increase"><i className="fa fa-arrow-up" aria-hidden="true" style={{fontSize:"30px",display:"flex",width:"35px"}}></i></div></div>
    </div>
  </div>)
}

interface timeDisplayProps{
  time:number,
  display:()=>string,
  sessesionType:string
}

function TimeDisplay(props:timeDisplayProps){


 const color=(props.time>60)?{color:"black"}:{color:"red"};
  return(<div className='session-display' style={color}>

    <div id="timer-label" className='display-title'>{props.sessesionType}</div>
    <div id="time-left" className='display-time'>{props.display()}</div>
    
  </div>

  )
}


interface buttonsType{
 playAndPause:()=>void,
 reset:()=>void
}

function Buttons(props:buttonsType){





  return(<div className='button-component'>
    <div onClick={props.playAndPause}><i id="start_stop"   data-type="play" className="fa fa-play" aria-hidden="true" style={{fontSize:"25px"}}></i><i className="fa fa-pause"data-type="pause" aria-hidden="true"style={{fontSize:"25px"}}></i></div>
    
    <div><i id="reset" onClick={props.reset}  className="fa fa-refresh" aria-hidden="true" style={{fontSize:"25px"}}></i></div>
  </div>) 
}




interface propsType {}
interface stateType{
  break:number,
  session:number,
  time:number,
  sessesionType:string,
  stateInterval:{
    cancel:()=>void
  }|null,
  sessionControl:boolean,
  playPause:boolean
}

class App extends Component<propsType, stateType> {
  audio: any;

  constructor(props: propsType | Readonly<propsType>){
    super(props)
    this.state = {break:5,session:25,time:1500,sessesionType: "Session" ,stateInterval:null,sessionControl:false,playPause:true}
    this.displayfunction = this.displayfunction.bind(this);
    this.countDown = this.countDown.bind(this);
    this.phaseChange = this.phaseChange.bind(this);
    this.playPause = this.playPause.bind(this);
    this.handleBreak = this.handleBreak.bind(this);
    this.handleSession= this.handleSession.bind(this);
    this.reset = this.reset.bind(this);
    this.playSound = this.playSound.bind(this);
  }

 
 
 
 


 displayfunction = ()=>{

  const staticSession = this.state.time; 
 
  const sessionMinutes = Math.floor(staticSession/60);
  const newSessionMinutes = (sessionMinutes<10)? "0" + sessionMinutes:sessionMinutes; 
  const sessionSecond = staticSession%60
  const newSeconds = (sessionSecond<10)? "0" + sessionSecond:sessionSecond;
  const timeStructure =  newSessionMinutes + ":" + newSeconds

  return timeStructure;

}


 countDown = ()=>{
  console.log("Inside CountDown")
  const interval = accurateInterval(()=>{
    this.setState((prev)=>{return{...prev,time:prev.time-1}});
     this.phaseChange();
 },1000)

   this.setState((prev)=>{return{...prev,stateInterval: interval }})
}


 phaseChange = ()=>{
   this.playSound()
   if(this.state.sessesionType==="Session"){
    
     if(this.state.time<0){

      
       this.state.stateInterval!.cancel();
       this.countDown();
       this.setState((prev)=>{return{time:prev.break*60,sessesionType:"Break"}});
     }
   }else{
     if(this.state.time<0){
      
      this.state.stateInterval!.cancel();
      this.countDown();
      this.setState((prev)=>{return{time:prev.session*60,sessesionType:"Session"}});

     }
   }
}


playSound(){
if(this.state.time===0){
  this.audio.play();
}

}

 playPause = ()=>{


  if(this.state.playPause===false){
    this.state.stateInterval!.cancel();
    this.setState((prev)=>{return{sessionControl:false,playPause:true}})

  }else{
   
    this.countDown();
    this.setState((prev)=>{return{sessionControl:true,playPause:false}})
  }
   
}





 handleBreak = (e:React.MouseEvent<HTMLDivElement, MouseEvent>)=>{

       

  if(this.state.sessionControl===false){
   
   if(e.currentTarget.dataset.name === "decrease"){
     if(this.state.break ===1){

     }else if(this.state.break >1){
     this.setState((prev)=>{return{break:prev.break-1 }})}
     
   }else if(e.currentTarget.dataset.name === "increase"){
     if(this.state.break ===60){

     }else if(this.state.break<60){
     
     this.setState((prev)=>{return{break:prev.break+1}})}
   }


 }else{} 
}


 handleSession = (e:React.MouseEvent<HTMLDivElement, MouseEvent>)=>{
if(this.state.sessionControl===false){
if(e.currentTarget.dataset.name === "decrease"){
 if(this.state.session ===1){

 }else if(this.state.session >1){
 this.setState((prev)=>{return{...prev,session:prev.session-1,time:prev.session *60 - 60}})}
}else if(e.currentTarget.dataset.name === "increase"){
 if(this.state.session ===60){

 }else if(this.state.session<60){
 
 this.setState((prev)=>{return{...prev,session:prev.session+1,time:prev.session *60 + 60}})}
}

}else{}
}


 reset = ()=>{
  if(this.state.stateInterval){
  this.state.stateInterval.cancel();}
  
  if(this.audio){
    this.audio.pause();
    this.audio.currentTime =0;
  }
 this.setState({break:5,session:25,time:1500,sessesionType: "Session" ,stateInterval:null,sessionControl:false,playPause:true})
}
 

// const theSound = ()=>{
//   const sound = new Howl({
//     src: beep
//   });

//   sound.play();
// }

// Howler.volume(1.0);
//console.log("the new ", state.session);


 render(){
  return (
    <div className="App">
      <h1> 25 + 5 Clock</h1>
      <SessionFlex  handleBreak={this.handleBreak} session={this.state.session} break={this.state.break} handleSession={this.handleSession} />
      <TimeDisplay  display={this.displayfunction} time={this.state.time} sessesionType={this.state.sessesionType}/>
      <Buttons reset={this.reset}  playAndPause={this.playPause}/>

      <audio id="beep" ref={(element)=> this.audio=element}  src="https://raw.githubusercontent.com/freeCodeCamp/cdn/master/build/testable-projects-fcc/audio/BeepSound.wav">

      </audio>
       
       <p className='my-tag'> Coded by : Adebisi Adeyemi  </p>
      
    </div>
  );
 }
}

export default App;
