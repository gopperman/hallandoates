// M-E-T-H-O-D O-F controlling the website
function HallandOates() {
	this.baseURI = document.URL;
	this.pos = 0;
	this.body = $('body');
	this.vidContainer = $('#video__container');
	this.navContainer = $('#songs');
	this.nav = $('.nav');
	this.statusBar = $('#status');
	this.playPause = $('.video__play .fa');
	this.player = [];

	this.findSong = function ( slug ) {
		var i = songs.length;
		while ( i-- ) {
			if ( songs[i].slug === slug ) {
				this.pos = i;
				return;
			}
		}
	};

	this.randomizeQueue = function( slug ) {
		songs = this.shuffle( songs );

		if (typeof slug !== 'undefined') {
			this.findSong( slug );
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

	this.play = function( slug ) {
		if ( 'undefined' !== typeof slug ) {
			this.findSong ( slug );
		} else if (this.pos === songs.length ) {
			this.pos = 0;
		}
		this.vidContainer.empty().append('<div id="video"></div>');

		this.player = new YT.Player('video', {
			width: '100%',
			videoId: songs[this.pos].id,
			playerVars: { 
				'autoplay': 1, 
				'controls': 0,
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
		this.updateStatus( songs[this.pos] );
		this.pos++;
		ga('send', 'songplay');
	};

	this.updateNav = function() {
		var markup;

		this.nav.empty();
		for ( var i = 0; i < songs.length; i ++ ) {
			markup = '<li><a href="#' + songs[i].slug + '" class="nav__item nav__' + songs[i].slug + '">' + songs[i].title + '</a>';
			this.nav.append( markup );
		}

		$( '.nav__item' ).click( function( event ) {
			event.stopPropagation();
			var slug = $( this ).attr('href');
			hao.play ( slug.replace('#','') );
		});
	};

	this.updateStatus = function( song ) {
		$('.active').removeClass( 'active' );
		$('.nav__' + song.slug ).addClass( 'active' );

		$( hao.playPause ).removeClass( 'fa-play' ).addClass( 'fa-pause' );

		$.when(
			$( '.song__info, .song__thumbnail-container' ).remove()
		).then( function() {
			var statusBar = $( '#status' );
			var album = song.album + ', ' + song.year;
			var thumbnail = '<div class="song__thumbnail-container">
				<a href="' + song.link + '" target="_blank"><img src="img/' + song.thumbnail + '" /></a>
			</div>'

			var info = '<div class="song__info';
			if (album.length > 20 || song.title.length > 20 ) {
				info += ' smaller';
			}
			info += '">
				<a href="' + song.link + '" target="_blank">
					<h2>' + song.title + '</h2>
					<h3>' +  album + '</h3>
				</a>
			</div>';

			$( statusBar ).prepend( info );
			$( statusBar ).prepend( thumbnail );
		});
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

function onPlayerStateChange( newState ) {
	if ( newState['data'] == 0 ) {
		hao.play();
	}
}

$(document).ready( function() {
	//Loads youtube API asynchronously
	var tag = document.createElement( 'script' );

	tag.src = "//www.youtube.com/iframe_api";
	var firstScriptTag = document.getElementsByTagName('script')[0];
	firstScriptTag.parentNode.insertBefore( tag, firstScriptTag );	

	$( '.cta' ).click( function( event ){
		hao.hideIntro();
		var first = $( this ).hasClass( 'nocando' ) ? 'i-cant-go-for-that' : '';
		hao.randomizeQueue( first );
		hao.play();
	});

	$( '.nav__open, #songs' ).click ( function() {
		hao.navContainer.toggleClass( 'open closed' );
	});

	$( '#video__skip').click ( function() {
		hao.play();
	});
});
