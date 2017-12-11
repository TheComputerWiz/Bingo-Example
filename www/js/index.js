window.onload = initAll;
var usedNums = new Array(76);

var config={};
config.url="http://www.a7labs.us/bingo/api.php";


Pusher.logToConsole = true;

var pusher = new Pusher('f3d39d29be1568bb8a86', {
	encrypted: true
});

var channel = pusher.subscribe('my-channel');
channel.bind('my-event', function(data) {
	console.log(localStorage.game)
	if(data.game==localStorage.game)
	{

		$val=data.message;
		$("#bingo_flashboardPlayers td").filter(function() {
			return $(this).text() == $val;
		}).css({background:"red",color:"white"});

		$("#current_game_number").html(data.game);

		$("#current_number").html(data.message);

	}
});

var winningOption = 0;
var winningCard = ['bingo_card', 'bingo_card1', 'bingo_card2', 'bingo_card3'];

var winnersArray = [
  new Array(31, 99, 792, 924, 992, 15360, 507904, 541729, 557328, 1083458, 2162820, 4329736),
  new Array(8912913, 12976128, 3784704, 231, 15138816),
  new Array(8519745, 8659472, 16252928, 1622016, )
];
var currentWinnerIndex = 0;
var isDoubleBingoCard = false;
var $bingoPanel = 'bingo_div';
var $bingoCard = 'bingo_card';


config.checkState= function()
{
	if(localStorage.isloggedin==1)
	{
		$("#login").hide();
		//$("#game").show();
		if(localStorage.type==1)
		{
			$("#admin").show();

			$.post(config.url,{action:'listGames',user:localStorage.userID},function(e)
			{

				$("#listGames").html(e)

			});
		}


		if(localStorage.type==2)
		{
			$("#flash").show().load("flashboard.html");


		}



		if(localStorage.type=='player')
		{
			$("#game").show();


		}
	}
	else
	{
		$("#login").show();
		$("#admin,#game,#flash").hide();

	}
}
config.checkState();

function initAll() {
	if (document.getElementById) {
		document.getElementById("reload").onclick = anotherCard;
		newCard('');
	}
	else {
		alert("Sorry, your browser doesn't support this script");
	}
}


function newCard(parent) {
	console.log(parent)
	usedNums = new Array(76);

	for (var i=0; i<24; i++) {
		setSquare(i,parent);
	}
}


$(document).on("click",".reload",function()
{


	$id=$(this).closest("table").attr("id");
	newCard($id);


})


$(document).on("click",".playCard",function()
{

	$(this).hide();
	$(this).prev().hide();

	var nums={};

	$p= $(this).closest("table");

	nums["num"+$p.data("serial")]=[];

	$p.find("td").each(function()
	{
		n=$(this).text();
		nums["num"+$p.data("serial")].push(n);
	})

	setTimeout(function()
	{
		$.post(config.url,{action:'saveCards',gameId:localStorage.game,playerId:localStorage.playerID,numbers:nums},function(e)
		{

		});
	},500)



	//$(".reload").remove();

})


function setNumbers(card,nums,played)
{

	var $c=0;



	$("#enter,.reload").hide();
	$(card).find(".playCard").hide();

	$(card).find("td").each(function()
	{
		$(this).text(nums[$c]);

		if(jQuery.inArray(nums[$c], played) !== -1)
		{
			$(this).addClass("pickedBG");

		}

			$c++;
	})

}

function loadCards()
{

	$c=0;
	$.post(config.url,{action:'loadCards',gameId:localStorage.game,playerId:localStorage.playerID},function(e) {
	$(e).each(function(a,b)
	{
		if($c<4)
		{

			if($c==0)
			{
				newCard('');
				$("#bingo_card .cardSerial").text(b.serial);

			}
			else
			{
				$("#bingo_div").append($("<table id='bingo_card"+($c)+"'>").append($("#bingo_card").clone().html())).ready(function () {

					newCard('bingo_card'+$c);
					$("#bingo_card"+$c+" .cardSerial").text(b.serial);

				});

			}

			if($c>2)
			{
				$("#add_more").hide()

			}
			else
			{
				$("#add_more").show()
			}


		}
		$c++
	})

	},"json")


	winningOption = 0;
	winningCard['bingo_card'] = 0;
	winningCard['bingo_card1'] = 0;
	winningCard['bingo_card2'] = 0;
	winningCard['bingo_card3'] = 0;
	$(".alert").hide();
	$("#lineModalLabel").text('Receipt Number : ' + localStorage.serialNumber);
	resetClass();

}

function resetClass(){
	$('#bingo_card').removeClass('borderWinningCard');	
	$('#bingo_card1').removeClass('borderWinningCard');	
	$('#bingo_card2').removeClass('borderWinningCard');	
	$('#bingo_card3').removeClass('borderWinningCard');	
	$('.alert').hide();
}

function setSquare(thisSquare, parent) {
  var currSquare = "square" + thisSquare;
  var colPlace = (!isDoubleBingoCard)
      ? new Array(0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 2, 2, 2, 2, 3, 3, 3, 3, 3, 4, 4, 4, 4, 4)
      : new Array(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 2, 2, 2, 2, 2, 2, 2, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4);
  var colBasis = colPlace[thisSquare] * 15;
  var newNum;

  do {
    newNum = colBasis + getNewNum() + 1;
  }
  while (usedNums[newNum]);
  usedNums[newNum] = true;

  if (parent.length > 0) {
    //console.log("me");
    $("#" + parent + " #" + currSquare).html(newNum);
    $("#" + parent + " #" + currSquare).attr("class", "");

		/*
		$(document).on("click","#"+parent+ " #"+currSquare,function()
		{
			$(this).toggleClass("pickedBG");
		});
		*/
    //$("#"+parent+ "#currSquare").onmousedown = toggleColor;
  }
  else {
    document.getElementById(currSquare).innerHTML = newNum;
		document.getElementById(currSquare).className = "";
		document.getElementById(currSquare).onmousedown = toggleColor;
	}

	$("#free").addClass(localStorage.dabber);	
	$("#free").html("FREE");

}	


function getNewNum() {
	return Math.floor(Math.random() * 15);
}


function anotherCard() {
	for (var i=1; i<usedNums.length; i++) {
		usedNums[i] = false;
	}
	newCard('');
	return false;
}


function toggleColor(evt) {
	/*
	if (evt) {
		var thisSquare = evt.target;
	}	else {
		var thisSquare = window.event.srcElement;
	}
	if (thisSquare.className == "") {
		
		thisSquare.className = localStorage.dabber;

	}	else {
		thisSquare.className = "";
	}
	*/
	//checkWin();
}




$(function() {

    var bingo = {
        selectedNumbers: [],
        generateRandom: function() {
            var min = 1;
            var max = 89;
            var random = Math.floor(Math.random() * (max - min + 1)) + min;
            return random;
        },
        generateNextRandom: function() {
            if (bingo.selectedNumbers.length > 88) {
                alert("All numbers Exhausted");
                return 0;
            }
            var random = bingo.generateRandom();
            while ($.inArray(random, bingo.selectedNumbers) > -1) {
                random = bingo.generateRandom();
            }
            bingo.selectedNumbers.push(random);
            return random;
        }
    };
    $('td').not("#bingo_flashboardPlayers td").each(function() {
        var concatClass = this.cellIndex + "" + this.parentNode.rowIndex;
        var numberString = parseInt(concatClass, 10).toString();
        $(this).addClass("cell" + numberString).text(numberString);
    });
    $('#btnGenerate').click(function() {
        var random = bingo.generateNextRandom().toString();
        $('.bigNumberDisplay span').text(random);
        $('td.cell' + random).addClass('selected');
    });


	/*
    window.onbeforeunload = function(e) {
        e = e || window.event;
        var returnString = 'Are you sure?';
        if (e) {
            e.returnValue = returnString;
        }
        return returnString;
    };

*/


    $("#formLogin").submit(function()
	{
$data=$( this ).serialize();
		$.post(config.url,$data,function(e)
		{

			if(e.success==1)
			{				
				localStorage.isloggedin=1;
				localStorage.user=e.name;
				localStorage.userID=e.id;
				localStorage.game=e.assigned_game;
				localStorage.type=e.type;				
				config.checkState();



			}
			else
			{
				alert("User not found")
			}


		},"JSON");
		resetClass();
		return false;
	})



	$("#formSerial").submit(function()
	{
		$data=$( this ).serialize();

		$.post(config.url,$data,function(e)
		{

			if(e.success==1)
			{
				console.log(e);
				localStorage.isloggedin=1;
				//localStorage.user=e.name;
				//localStorage.userID=e.id;
				localStorage.serialNumber = e.serial;
				localStorage.playerID=e.id;
				localStorage.game=e.game;
				localStorage.dabber="colorBlue";
				localStorage.type='player';
				localStorage.sound='off';
		
				
				config.checkState();
				$(e.cards).each(function(a,b)
				{
					//$(".cardSerial").text(b.serial);
				})


				$("#bingo_div table").not("#bingo_card").remove();
				loadCards();

			}
			else
			{
				alert("Invalid serial");
			}


		},"JSON");
		return false;
	});




	$("#addGame").click(function()
	{
		$.post(config.url,{action:'newGame',user:localStorage.userID},function(e)
		{

$("#listGames").html(e)

		});
	});


	$(document).on("click",".btnDeleteGame",function()
	{
		$id=$(this).data("id");
		$.post(config.url,{action:'deleteGame',id:$id,user:localStorage.userID},function(e)
		{


			$("#listGames").html(e)

		});
	});

	$(document).on("click",".btnAddPlayer",function()
	{
		$id=$(this).data("id");
		$.post(config.url,{action:'addPlayer',id:$id,user:localStorage.userID},function(e)
		{


			$("#listGames").html(e)

		});
	});

	$(document).on("click",".btnDeletePlayer",function()
	{
		$id=$(this).data("id");
		$.post(config.url,{action:'deletePlayer',id:$id,user:localStorage.userID},function(e)
		{


			$("#listGames").html(e)

		});
	});


	$(document).on("click",".logout",function()
	{
		localStorage.clear();
		config.checkState();
	});

	/********flashboard****/

	$(document).on("click","#bingo_flashboard td",function()
	{
		$num=($(this).text());
$(this).css({background:"red",color:"white"})
		$.post(config.url,{action:'setCurrentNumber',num:$num,game:localStorage.game},function(e)
		{



			//$("#listGames").html(e)

		});
	})




	$(document).on("click","#add_more",function()
	{


		$c=parseInt($("#bingo_div table").length);
		if($c==2)
		{
			$.post(config.url,{action:'addCard',gameId:localStorage.game,playerId:localStorage.playerID},function(e) {

				$("#bingo_div").append($("<table id='bingo_card2'>").append($("#bingo_card").clone().html())).ready(function () {
					$("#add_more").hide();
					newCard("bingo_card2");
					$("#bingo_card"+$c+" .cardSerial").text(e);


					setTimeout(function () {

						$.post(config.url,{action:'addCard',gameId:localStorage.game,playerId:localStorage.playerID},function(e) {

							$("#bingo_div").append($("<table id='bingo_card3'>").append($("#bingo_card").clone().html())).ready(function () {
							newCard("bingo_card3");

						});
						});

					}, 500)


				})
			});

			//$c=parseInt($("#bingo_div table").length);


		}
		else
{

	$.post(config.url,{action:'addCard',gameId:localStorage.game,playerId:localStorage.playerID},function(e)
	{

		$("#bingo_div").append($("<table id='bingo_card"+($c)+"'>").append($("#bingo_card").clone().html())).ready(function () {

			newCard("bingo_card"+$c);
			$("#bingo_card"+$c+" .cardSerial").text(e);

		});

	});

}




	})


	function checkWin(id, card) {
		console.log('check win');
		
		var setSquares = 0;
		var winners = new Array('square0', 'square1', 'square2', 'square3', 'square4');
		/* these are the other game win options that need to be added.
		var winners = new Array('square5', 'square6', 'square7', 'square8', 'square9');
		var winners = new Array('square10', 'square11', 'square12', 'square13');
		var winners = new Array('square14', 'square15', 'square16', 'square17', 'square18');
		var winners = new Array('square19', 'square20', 'square21', 'square22', 'square23');
		var winners = new Array('square0', 'square6', 'square17', 'square23');
		*/

		console.log('Square ID : ' + id + ' ---- Card : ' + card);

		for (var i=0; i<winners.length; i++) {
			if (id == winners[i]) {
				//alert('matched number');
				winningCard[card]++;
			}		
		}

		winningCard.forEach(function(item, index, array) {
		  	console.log('Card : ' + index + ' = ' + winningCard[item]);
		  	console.log('Winners Lenght : ' + winners.length);
		  	if(winningCard[item] == winners.length){				
				$('#' + winningCard[index]).toggleClass("borderWinningCard");
				$(".alert").show();
				

				if(localStorage.sound == 'on'){
					$('#bingo').get(0).play();

					var audioPromise = document.querySelector('audio').play();
				
					if (audioPromise !== undefined) {
					  audioPromise.then(function() {
					   
					  }).catch(function(error) {
					    
					  });
					}	
				}
				
			}
		});

		
		/*
		for (var i=0; i<24; i++) {
			var currSquare = "square" + i;

			if (document.getElementById(currSquare).className != "") {
				console.log('Current Square : ' + currSquare);
				//document.getElementById(currSquare).className = "pickedBG";
				setSquares = setSquares | Math.pow(2,i);
				console.log('Set Square : ' + setSquares);
			}
		}

		for (var i=0; i<winners.length; i++) {
			if ((winners[i] & setSquares) == winners[i]) {

				winningOption = i;
			}
		}
		
		if (winningOption > -1) {
			for (var i=0; i<24; i++) {
				if (winners[winningOption] & Math.pow(2,i)) {			
					currSquare = "square" + i;
					alert('winner');
					document.getElementById(currSquare).className = "winningBG";
				}
			}
		}
		*/
	};

	//$(document).on("click","#bingo_card td, #bingo_card1 td,#bingo_card2 td, #bingo_card3 td",function()
	$(document).on("click","#bingo_card td",function()
	{	
		//console.log(this)	
		$(this.id).removeClass(localStorage.dabber);			
		$(this).toggleClass("pickedBG");		
		$(this).toggleClass(localStorage.dabber);	
		checkWin(this.id, 'bingo_card');		
	});

	$(document).on("click","#bingo_card1 td",function()
	{	
		//console.log(this)	
		$(this.id).removeClass(localStorage.dabber);			
		$(this).toggleClass("pickedBG");		
		$(this).toggleClass(localStorage.dabber);	
		checkWin(this.id, 'bingo_card1');		
	});

	$(document).on("click","#bingo_card2 td",function()
	{	
		//console.log(this)	
		$(this.id).removeClass(localStorage.dabber);			
		$(this).toggleClass("pickedBG");		
		$(this).toggleClass(localStorage.dabber);	
		checkWin(this.id, 'bingo_card2');		
	});

	$(document).on("click","#bingo_card3 td",function()
	{	
		//console.log(this)	
		$(this.id).removeClass(localStorage.dabber);			
		$(this).toggleClass("pickedBG");		
		$(this).toggleClass(localStorage.dabber);	
		checkWin(this.id, 'bingo_card3');		
	});

	
	$(document).on("click","#dabber li",function()
	{			
		localStorage.dabber = this.id;
		$(".borderDabber").removeClass("borderDabber");
		$(this).toggleClass("borderDabber");				
	});
 
	// Check if sound is enabled
	if ($('#enableSound').is(":checked"))
	{
	  alert('is check');
	}

	$('#enableSound').click(function() {
		if (localStorage.sound == 'on' || localStorage.sound == 'null')
			localStorage.sound = 'off';
		else
			localStorage.sound = 'on';

	});

	if(localStorage.playerID)
	{
		setTimeout(function()
		{
			loadCards();
		},500)


	}

	$(document).on("click", "#previous_game", function () {
    if (currentWinnerIndex !== 0) {
      currentWinnerIndex--;
    } else {
      alert('No more previous games!');
    }
    checkCardType();
  });

  $(document).on("click", "#next_game", function () {
    if (currentWinnerIndex < winnersArray.length) {
      currentWinnerIndex++;
    } else {
      alert('No more next games!');
    }
    checkCardType();
  });

  function checkCardType() {
    isDoubleBingoCard = (currentWinnerIndex >= 1);
    if (isDoubleBingoCard) {
      $bingoPanel = 'doubles_bingo_card';
      $bingoCard = 'the_doubles_bingo_card';
      $('#bingo_div').hide();
      $('#doubles_bingo_card').show();
    } else {
      $bingoPanel = 'bingo_div';
      $bingoCard = 'bingo_card';
      $('#bingo_div').show();
      $('#doubles_bingo_card').hide();
    }

    var cardId = $bingoCard;
    var cardId1 = $bingoCard+'1';
    var cardId2 = $bingoCard+'2';
    var cardId3 = $bingoCard+'3';
    if ($("#"+cardId).length && !$("#"+cardId1).length && !$("#"+cardId2).length && !$("#"+cardId3).length) {
      loadCards();
    } else {
      newCard(cardId);
      newCard(cardId1);
      newCard(cardId2);
      newCard(cardId3);
    }
  }


});