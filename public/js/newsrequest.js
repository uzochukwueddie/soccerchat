$(document).ready(function(){
    LoadData(".paginate");
    
    return GetRequest(); 
});

function GetRequest(){
    
    $.ajax({
        url: 'http://content.guardianapis.com/football?page-size=300&order-by=newest&show-fields=all&api-key=8b435306-1b3a-480d-b96d-32b7d969507a',
        type: "GET",
        dataType: "json",
        success: function(data) {
            
            var res = "";
            
            $.each(data.response.results, function(i){
                res += "<form class='paginate'>";
                res += "<div class='col-sm-12 col-md-12 news-posts news-30 '>";
                res += "<div class='row'>";
                
                res += "<a href='"+data.response.results[i].webUrl+"' target='_blank'>";
                res += "<div class='col-md-2 col-sm-3'>";
                res += "<img src='"+data.response.results[i].fields.thumbnail+"' class='img-responsive news-mob-center' />"
                res += "</div>";
                res += "</a>";

                res += "<div class='col-md-10 col-sm-9'>";
                res += "<h4 class='news-0'>"+new Date(Date.parse(data.response.results[i].webPublicationDate)).toDateString()+"</h4>";
                res += "<a href='"+data.response.results[i].webUrl+"' target='_blank' class='headerLink' style=''>";
                res += "<h3 class='news-01'>"+data.response.results[i].fields.headline+"</h3>";
                res += "</a>";
                res += "<p class='news-text'>"+data.response.results[i].fields.standfirst+"</p>";
                res += "</div>";

                res += "</div>";
                res += "</div>";
                res += "</form>";
            });
            
            $("#newsResult").html(res);  
            
            $(".paginate").slice(0, 4).show();


            
            
            var res1 = "";
            
            for(var i = 0; i < data.response.results.length; i++){
                res += "<form>";
                res1 += "<a href='"+data.response.results[i].webUrl+"' target='_blank'>";
                res1 += "<div class='col-xs-12 news-posts-mob paginate1'>";
                res1 += "<div class='row'>";

                res1 += "<div class='col-xs-12'>";
                res1 += "<h3 class='mob-news-01 headerLink' style='color:#4aa1f3; text-decoration:none'>"+data.response.results[i].fields.headline+"</h3>";
                res1 += "</div>";
                res1 += "<div class='col-xs-12'><div class='news-border'></div></div>";
                res1 += "<div class='col-xs-12'>";
                res1 += "<div class='row'>";
                res1 += "<div class='col-xs-6'>";
                res1 += "<p>"+new Date(Date.parse(data.response.results[i].webPublicationDate)).toDateString()+"</p>";
                res1 += "</div>";
                
                res1 += "</div>";
                res1 += "</div>";
                res1 += "</a>";
                res += "</form>";
            }
            
            $("#mobileViewResult").html(res1);
            
            $(".paginate1").slice(0, 4).show();
            LoadData(".paginate1");


        }
    });  
}

function LoadData(divClass){
    $("#loadMore").on('click', function (e) {
        e.preventDefault();

        $(divClass+":hidden").slice(0, 4).slideDown();

        if ($(divClass+":hidden").length == 0) {
            $("#load").fadeOut('slow');
        }

        $('html,body').animate({
            scrollTop: $(this).offset().top
        }, 1500);
    });

    $('a[href=#top]').click(function () {
        $('body,html').animate({
            scrollTop: 0
        }, 600);

        return false;
    });
}





























