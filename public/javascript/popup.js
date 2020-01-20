document.getElementById("tpopup").style.display = "none";

$("#shelfmap").click(function(){
  document.getElementById("tpopup").style.display = "block";
});

$("#shelfmapbtn").click(function(){
  document.getElementById("tpopup").style.display = "block";
});

  $("#tclose").click(function(){
    $("#tpopup").fadeOut('slow');
  });
