$('#careers button').click(function(){
	$(this).parent().parent().children('.collapse').collapse('hide');
	$($(this).attr('data-target')).collapse('show');
})