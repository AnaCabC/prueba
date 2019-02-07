// See https://github.com/dialogflow/dialogflow-fulfillment-nodejs
// for Dialogflow fulfillment library docs, samples, and to report issues
'use strict';
 
const functions = require('firebase-functions');
const {WebhookClient} = require('dialogflow-fulfillment');
const {Card, Suggestion} = require('dialogflow-fulfillment');
 
process.env.DEBUG = 'dialogflow:debug'; // enables lib debugging statements

exports.dialogflowFirebaseFulfillment = functions.https.onRequest((request, response) => {
  const agent = new WebhookClient({ request, response });
  
  console.log('Dialogflow Request headers: ' + JSON.stringify(request.headers));
  console.log('Dialogflow Request body: ' + JSON.stringify(request.body));
 
  function welcome(agent) {
    agent.add(`Welcome to my agent!`);
  }
 
  function fallback(agent) {
    agent.add(`I didn't understand`);
    agent.add(`I'm sorry, can you try again?`);
 }

  function getdate(agent) {
    var dia_semana = agent.parameters.dias_semana;
    var date = new Date();
    var day = date.getDate();
  	var monthIndex = date.getMonth();
  	var year = date.getFullYear();
    var days = ["Domingo","Lunes", "Martes", "Miércoles", "Jueves", "Viérnes", "Sábado"];
    
    var monthNames = [
    "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio",
    "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];
    
    if (agent.parameters.dias_semana!=='')
    	{if (dia_semana=='Mañana'){
            day+=1;
            dia_semana=days[date.getDay()+1];}
          else{
              var dia_semana_actual=days[date.getDay()];
  			  var dia_semana_actual_index=days.indexOf(dia_semana_actual);
  			  var indexdia=days.indexOf(dia_semana);
              day+=indexdia-dia_semana_actual_index;
          }}
    else {
      dia_semana=days[date.getDay()];}
   	
	agent.add(`${dia_semana}`+` `+`${day}`+` `+`${monthNames[monthIndex]}`+` `+`${year}`);
  }
  
  function gettime(agent) {
    var date = new Date();
    agent.add(`Son las `+`${date.getHours()}`+` horas y `+`${date.getMinutes()}`+` minutos`);
  }
 
  function restaurante(agent) {
    var link='https://www.google.com/maps/search/';
    var type_restaurant=agent.parameters.rest;
    agent.add(`${link}`+`${type_restaurant}`);
  }
  
  function jidoka(agent) {
	var jidoka_options = agent.parameters.Jidoka;    
	if (jidoka_options===`Estado de las ejecuciones`){
    	agent.add(`Ok Google, dime el estado de las ejecuciones`);
        }
	else if (jidoka_options=== `botón del pánico`){
    	agent.add(`Ok Google, activa el modo pánico`);
    	}
    else if (jidoka_options=== `ejecutar el robot`){
    	agent.add(`Estupendo, introduce tu cuenta de email, pulsa enviar y di Enviado`);
  	}
  }
  
  // Run the proper function handler based on the matched Dialogflow intent name
  let intentMap = new Map();
  intentMap.set('Default Welcome Intent', welcome);
  intentMap.set('Default Fallback Intent', fallback);
  intentMap.set('Get Date', getdate);
  intentMap.set('Get Time', gettime);
  intentMap.set('Invocar robot Jidoka', jidoka); 
  intentMap.set('restaurante', restaurante); 
  agent.handleRequest(intentMap);
});
