$(document).ready(() => {
  // This file just does a GET request to figure out which user is logged in
  // and updates the HTML on the page
  $.get("/api/user_data").then(data => {
    $(".member-name").text(data.email);
  });
  let userId;
  $.get("/api/user_data").then(data => {
    console.log(data);
    userId = data.id;
    $.get("/api/character/" + userId).then(data => {
      console.log(data);
      sessionStorage.setItem('character', JSON.stringify(data));

      let character = JSON.parse(sessionStorage.getItem('character'));
      $("#level").text(character.level);
    });
  });
});
