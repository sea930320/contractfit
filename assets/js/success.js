$(document).ready(function(){
    var title = 'Bespaar op uw factuur';

    // Facebook
    $('a.ion-social-facebook.success').click(function(event){
        event.preventDefault();
        FB.ui({
            method: 'feed',
            name: title,
            link: $(this).data('link'),
            picture: $(this).data('link') + 'assets/images/' + $(this).data('image'),
            description: $(this).data('text')
        }, 
        function(response){});
    });

    // Twitter
    $('a.ion-social-twitter.success').click(function(event){
        event.preventDefault();
        window.open('http://twitter.com/share?url=' + $(this).data('link') + '&text=' + $(this).data('text') + '&', 'twitterwindow', 'height=450, width=550, top='+($(window).height()/2 - 225) +', left='+$(window).width()/2 +', toolbar=0, location=0, menubar=0, directories=0, scrollbars=0');
    });

});

