const searchForm = document.querySelector("#search-form");
const searchFormInput = searchForm.querySelector("input");

const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

if(SpeechRecognition) {

  const recognition = new SpeechRecognition();
  recognition.continuous = true;
  recognition.lang = "en-US";

  const micBtn = searchForm.querySelector("button");
  const micIcon = micBtn.firstElementChild;

  micBtn.addEventListener("click", micBtnClick);
  function micBtnClick() {
    if(micIcon.classList.contains("fa-microphone")) {
      recognition.start();
    }
    else {
      recognition.stop();
    }
  }

  recognition.addEventListener("start", startSpeechRecognition);
  function startSpeechRecognition() {
    micIcon.classList.remove("fa-microphone");
    micIcon.classList.add("fa-microphone-slash");
    searchFormInput.focus();
  }

  recognition.addEventListener("end", endSpeechRecognition);
  function endSpeechRecognition() {
    micIcon.classList.remove("fa-microphone-slash");
    micIcon.classList.add("fa-microphone");
    searchFormInput.focus();
  }

  recognition.addEventListener("result", resultOfSpeechRecognition);
  function resultOfSpeechRecognition(event) {
    const current = event.resultIndex;
    const transcript = event.results[current][0].transcript;

    if(transcript.toLowerCase().trim()==="stop recording") {
      recognition.stop();
    }
    else if(!searchFormInput.value) {
      searchFormInput.value = transcript;
    }
    else {
      if(transcript.toLowerCase().trim()==="go") {
        var url = "";
        var img = "";
        var title = "";
        varauthor = "";

        $.get("https://www.googleapis.com/books/v1/volumes?q=" + searchFormInput.value, function(response){
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
      }
      else if(transcript.toLowerCase().trim()==="reset input") {
        searchFormInput.value = "";
      }
      else {
        searchFormInput.value = transcript;
      }
    }
    searchFormInput.value = transcript;
    searchFormInput.focus();
    setTimeout(() => {
      recognition.stop();
      var url = "";
      var img = "";
      var title = "";
      varauthor = "";

      $.get("https://www.googleapis.com/books/v1/volumes?q=" + searchFormInput.value, function(response){
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
    }, 500);
  }

}
