// Initialize Firebase
  var config = {
    apiKey: "AIzaSyAOX3xwTBqaHEMvKT2pcHoC6v8v-ZjRPVI",
    authDomain: "train-scheduler-42a00.firebaseapp.com",
    databaseURL: "https://train-scheduler-42a00.firebaseio.com",
    projectId: "train-scheduler-42a00",
    storageBucket: "train-scheduler-42a00.appspot.com",
    messagingSenderId: "880121390700"
  };

  firebase.initializeApp(config);

  const trainData = firebase.database();

// Adds to Train Schedule
  $('#addTrain-btn').on('click', function(event) {
  	event.preventDefault();

 // Defining input information
  	let trainName = $('#trainName-input').val().trim();
  	let destination = $('#destination-input').val().trim();
  	let startTime = moment($('#startTime-input').val().trim(), "HH:mm").format();
	let frequency = $('#frequency-input').val();

// Creates local temp object for holding train data
	let newTrain = {
		name: trainName,
		destination: destination,
		startTime: startTime,
		frequency: frequency
	};

// Upload train data to the database
	trainData.ref().push(newTrain);

	alert('New Train Added!');

//Clears text boxes
	$('#trainName-input').val("");
	$('#destination-input').val("");
	$('#startTime-input').val("");
	$('#frequency-input').val("");

});

  trainData.ref().on("child_added", function(childSnapshot, prevChildKey) {
  			console.log(childSnapshot.val());

  			// Stores everything into variables
			let trainName = childSnapshot.val().name; 
			let destination = childSnapshot.val().destination; 
			let frequency = childSnapshot.val().frequency; 
			let startTime = childSnapshot.val().startTime; 
			console.log(startTime);
		
			// First Train Start time (pushed back 1 year to make sure it comes before current time)
			let startTimeConverted = moment(startTime, "HH:mm").subtract(1, "years");
			
			// Difference between the times
			let diffTime = moment().diff(moment(startTimeConverted), "minutes");

			// Time apart (remainder)
			let tRemainder = diffTime % frequency;

			// Minuetes untill next train arrive
			let minAway = frequency - tRemainder;

			// Next Train arrival
        	let nextArrival = moment().add(minAway, "minutes").format('hh:mm A');

			$('#schedule').append(`<tr><td>${trainName}</td><td>${destination}</td><td>${frequency}</td><td>${nextArrival}</td><td>${minAway}</td>`)
		});
