// Grab the articles as a json
$.getJSON("/articles", function(data) {
  // For each one
  for (var i = 0; i < data.length; i++) {
    // Display the information on the page
    $("#articles").append(
    "<div class='col s6'>"+
    "<div data-id='" + data[i]._id + "'class='card'>"+
    "<div class='card-image'>"+
    "<img src='"+data[i].image+"'>"+
    "<span class='card-title z-depth-1 white-text'>"+data[i].title+"</span>"+
    "</div>"+
    "<div class='card-content'>"+
    "<p>"+data[i].summary+"</p>"+
    "</div>"+
    "<div class='card-action'>"+
    "<a href='"+data[i].link+"'>Go to Article</a>"+
    "<a class='waves-effect waves-light btn orange modal-trigger' data-id='" + data[i]._id + "' href='#modal1'>Notes</a>"+
    "</div>"+
    "</div>"+
    "</div>");
  
    // <p data-id='" + data[i]._id + "'>" + data[i].title + "<br />" + data[i].link + "</p>

    // "<div class='row'><div class='col s12'><div class='card'><div class='card-image'><img src='"data[i].image"'><span class='card-title'>"data[i].title"</span></div><div class='card-content'><p>"data[i].summary"</p></div><div class='card-action'><a href='"data[i].link"'>Go to Article</a></div></div></div></div>"
    

  }
});


//initlaize modals
// $(document).ready(function(){
//   $('.modal').modal();
// });
// $('.modal-trigger').on('click', function() {
//   $('.modal').modal();
//   console.log("it's a modal")
// })

document.addEventListener('DOMContentLoaded', function() {
  var elems = document.querySelectorAll('#modal1');
  var instances = M.Modal.init(elems, null);
});

$(document).on("click", ".modal-trigger", function() {
  console.log("click")


  // Empty the notes from the note section
  $("#notes").empty();
  // Save the id from the p tag
  var thisId = $(this).attr("data-id");

  // Now make an ajax call for the Article
  $.ajax({
    method: "GET",
    url: "/articles/" + thisId
  })
    // With that done, add the note information to the page
    .then(function(data) {
      console.log(data);
      $("#notes").append("<h3>" + data.title + "</h3>");
      $("#notes").append("<input id='titleinput' name='title' >");
      $("#notes").append("<textarea id='bodyinput' name='body'></textarea>");
      $(".modal-footer .modal-close")[0].outerHTML="<a class='waves-effect waves-green btn-flat' data-id='" + data._id + "' id='savenote'>Save Note</a>";

      if (data.note) {
        $("#titleinput").val(data.note.title);
        $("#bodyinput").val(data.note.body);
      }
    });
});

// When you click the savenote button
$(document).on("click", "#savenote", function() {
  // Grab the id associated with the article from the submit button
  var thisId = $(this).attr("data-id");

  // Run a POST request to change the note, using what's entered in the inputs
  $.ajax({
    method: "POST",
    url: "/articles/" + thisId,
    data: {
      // Value taken from title input
      title: $("#titleinput").val(),
      // Value taken from note textarea
      body: $("#bodyinput").val()
    }
  })
    // With that done
    .then(function(data) {
      // Log the response
      console.log(data);
      // Empty the notes section
      $("#notes").empty();
    });

  // Also, remove the values entered in the input and textarea for note entry
  $("#titleinput").val("");
  $("#bodyinput").val("");
});
