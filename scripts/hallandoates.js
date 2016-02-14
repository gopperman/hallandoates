// M-E-T-H-O-D O-F controlling the website
function HallandOates() {
	this.baseURI = document.URL;
	this.queue = 0;
	this.body = $('body');
	this.vidContainer = $('video__container');
	this.navContainer = $('#songs');
	this.nav = $('.nav');
	this.statusBar = $('#status');

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

	this.play = function() {
		if (this.queue === songs.length ) {
			this.queue = 0;
		}
		this.vidContainer.empty().append('<div id="video"></div>');
		
		player = new YT.Player('video', {
			width: '100%',
			videoId: songs[this.queue].id,
			playerVars: { 
				'autoplay': 1, 
				'controls': 1,
				'showinfo': 0,
				'enablejsapi': 1,
				'rel': 0,
				'iv_load_policy': 3,
				'wmode': 'opaque',
				'origin': 'http://hallandoat.es'
			},
			events: {
        		'onStateChange': onPlayerStateChange
			},
		});
		this.updateStatus( songs[this.queue] );
		this.queue++;
	};

	this.updateNav = function() {
		var markup;

		this.nav.empty();
		for ( var i = 0; i < songs.length; i ++ ) {
			markup = '<li><a href="#' + songs[i].slug + '" class="nav__item nav__' + songs[i].slug + '">' + songs[i].title + '</a>';
			this.nav.append( markup );
		}
	};

	this.updateStatus = function( song ) {
		$( this.statusBar ).empty();

		$('.active').removeClass( 'active' );
		$('.nav__' + song.slug ).addClass( 'active' );

		var thumbnail = '<div class="song__thumbnail-container"><img src="img/' + song.thumbnail + '" /></div>'
		$( this.statusBar ).append( thumbnail );

		var info = '<div class="song__info">
			<h2>' + song.title + '</h2>
			<h3>' + song.album + ', ' + song.year + '</h3>
		</div>';
		$( this.statusBar ).append( info );
	};

	this.updateHistory = function() {
		//Update the nav
		//Update the browser bar
		return;
	};

	this.hideIntro = function() {
		$('#intro').fadeOut( 500 );
	};

}

var hao = hao || new HallandOates();

function onPlayerStateChange(newState) {
	if ( newState['data'] == 0 ) {
		hao.play();
	}
}

$(document).ready( function() {
	//Loads youtube API asynchronously
	var tag = document.createElement( 'script' );

	tag.src = "http://www.youtube.com/iframe_api";
	var firstScriptTag = document.getElementsByTagName('script')[0];
	firstScriptTag.parentNode.insertBefore( tag, firstScriptTag );	

	$( '.cta' ).click( function( event ){
		hao.hideIntro();
		var first = $( this ).hasClass( 'nocando' ) ? 'i-cant-go-for-that' : '';
		hao.randomizeQueue( first );
		hao.play();
	});
	$( '.nav__close' ).click ( function() {
		hao.navContainer.toggleClass( 'open', 'closed' );
	});
});
