$(document).ready(function(){
    // Options list
    $('.how-to-prev').click(function(evt){
        evt.preventDefault();
        var parent = $(this).parent().next();
        var index = parent.find('.active').index();
        parent.children().removeClass('active');
        var current_index = ((index-1) < 0 ? (parent.children().length -1) : index - 1 );
        parent.children().eq(current_index).addClass('active');
    });
    $('.how-to-next').click(function(evt){
        evt.preventDefault();
        var parent = $(this).parent().next();
        var index = parent.find('.active').index();
        parent.children().removeClass('active');
        var current_index = ((index+1) > (parent.children().length - 1) ? 0 : index + 1 );
        parent.children().eq(current_index).addClass('active');
    });
});