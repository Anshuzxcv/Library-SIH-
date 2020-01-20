$(document).ready(function(){
  $("#search-form").submit(function(){
    var search = $("#books").val();

    if(search === "")
    {
      return false;
    }else{
      var url = "";
      var img = "";
      var title = "";
      varauthor = "";

      $.get("https://www.googleapis.com/books/v1/volumes?q=" + search, function(response){
        for(i=0;i<response.items.length;i++){
          title=$('<h5 class="center-align white-text">' + response.items[i].volumeInfo.title + '</h5>');
          author=$('<h5 class="center-align white-text">' + response.items[i].volumeInfo.authors + '</h5>');
          publisher=$('<h5 class="center-align white-text">' + response.items[i].volumeInfo.publisher + '</h5>');
          publishedDate=$('<h5 class="center-align white-text">' + response.items[i].volumeInfo.publishedDate + '</h5>');
          pageCount=$('<h5 class="center-align white-text">' + response.items[i].volumeInfo.pageCount + '</h5>');
          categories=$('<h5 class="center-align white-text">' + response.items[i].volumeInfo.categories + '</h5>');
          language=$('<h5 class="center-align white-text">' + response.items[i].volumeInfo.language + '</h5>');

          img=$('<img class="aligning card z-depth-5"id="dynamic"><br><a href=' + response.items[i].volumeInfo.infoLink + '><button id="imagebutton" class="btn btn-warning red sligning">Read More</button></a>');
          url = response.items[i].volumeInfo.imageLinks.thumbnail;
          img.attr('src',url);

          title.appendTo("#result");
          author.appendTo("#result");
          publisher.appendTo("#result");
          pageCount.appendTo("#result");
          publishedDate.appendTo("#result");
          categories.appendTo("#result");
          language.appendTo("#result");
          img.appendTo("#result");
        }
    });
  };
  return false;
});
});
