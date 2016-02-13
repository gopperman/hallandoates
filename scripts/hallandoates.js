// M-E-T-H-O-Ds O-F controlling the website
function HallandOates() {
	this.baseURI = document.URL;
	this.queue = 0;
	this.initialized = false;
	this.navContainer = $('#songs');
	this.nav = $('.nav');

	//See if a specific song was requested
	//Randomize queue
	//Load first video

	this.initialized = true;

	this.randomizeQueue = function( slug ) {
		if ( '' === slug ) {
			songs = this.shuffle( songs );
		} else {
			var i = songs.length;
			while ( i-- ) {
				if ( songs[i].slug === slug ) {
					var first = songs.splice(i, 1);
					break;
				}
			}
			songs = this.shuffle( songs );
			songs.unshift( first[0] );
		}
		this.updateNav();
	};

	this.shuffle = function ( array ) {
		var i = array.length;
		while( i-- ) {
        	var j = Math.floor(Math.random() * (i + 1));
        	var temp = array[i];
        	array[i] = array[j];
        	array[j] = temp;
    	}
		return array;
	};

	this.next = function() {
		return;
	};

	this.hideIntro = function() {
		return;
	};

	this.updateNav = function() {
		var markup;

		this.nav.empty();
		for ( var i = 0; i < songs.length; i ++ ) {
			markup = '<li><a href="#' + songs[i].slug + '" class="nav__item">' + songs[i].title + '</a>';
			this.nav.append( markup );
		}
	};

	this.updateHistory = function() {
		//Update the nav
		//Update the browser bar
		return;
	};

	this.hideIntro = function() {
		$('#intro').fadeOut(500);
	};

}

var hao = hao || new HallandOates();

$(document).ready( function() {
	$('.cta').click( function( event ){
		hao.hideIntro();
		var first = $(this).hasClass('nocando') ? 'i-cant-go-for-that' : '';
		console.log(first);
		hao.randomizeQueue( first );
		hao.next();
	});
	$('.nav__close').click (function() {
		hao.navContainer.toggleClass('open', 'closed');
	});
});
