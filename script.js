// ===============================
// AUTO FILL LOCAL STORAGE
// ===============================
$(document).on("focus", "#name", function () {
  $("#name").val(localStorage.getItem("name") || "");
  $("#email").val(localStorage.getItem("email") || "");
  $("#message").val(localStorage.getItem("message") || "");
});

// ===============================
// FORM VALIDATION + SAVE
// ===============================
$(document).on("submit", "#contactForm", function (e) {
  e.preventDefault();

  let name = $("#name").val().trim();
  let email = $("#email").val().trim();
  let message = $("#message").val().trim();
  let valid = true;

  $(".error").text(""); // reset error

  if (name === "") {
    $("#nameError").text("Nama wajib diisi");
    valid = false;
  }

  if (!email.includes("@")) {
    $("#emailError").text("Email tidak valid");
    valid = false;
  }

  if (message.length < 5) {
    $("#messageError").text("Pesan minimal 5 karakter");
    valid = false;
  }

  if (valid) {
    localStorage.setItem("name", name);
    localStorage.setItem("email", email);
    localStorage.setItem("message", message);

    $("#successMsg")
      .removeClass("hidden")
      .addClass("text-green-600 font-semibold")
      .fadeIn()
      .delay(2000)
      .fadeOut();

    $("#contactForm")[0].reset();
  }
});

// ===============================
// GITHUB API (RESPONSIVE UI)
// ===============================
$(document).on("click", "#loadGithub", function () {
  let username = $("#githubUser").val().trim();

  if (username === "") {
    alert("Masukkan username GitHub!");
    return;
  }

  $("#loading").show();
  $("#githubData").html("");
  $("#repoList").html("");

  // USER DATA
  $.ajax({
    url: `https://api.github.com/users/${username}`,
    success: function (data) {
      $("#loading").hide();

      // PROFILE CARD (RESPONSIVE)
      $("#githubData").html(`
        <div class="bg-white rounded-2xl shadow-md p-6 text-center max-w-md mx-auto border">
          <img src="${data.avatar_url}" 
               class="w-24 h-24 mx-auto rounded-full border-4 border-blue-500 mb-3">
          
          <h3 class="text-xl font-bold">${data.name || data.login}</h3>
          <p class="text-sm text-gray-500">@${data.login}</p>

          <div class="flex justify-center gap-4 mt-3 text-sm">
            <span>📦 ${data.public_repos}</span>
            <span>👥 ${data.followers}</span>
          </div>
        </div>
      `);

      // REPO LIST
      $.ajax({
        url: `https://api.github.com/users/${username}/repos?per_page=5`,
        success: function (repos) {

          $("#repoList").append(`
            <h4 class="mt-6 mb-3 font-bold text-gray-700 text-center">
              Latest Repositories
            </h4>
          `);

          repos.forEach(repo => {
            $("#repoList").append(`
              <li class="bg-white border rounded-xl p-4 mb-3 shadow-sm hover:shadow-md transition">
                <div class="flex justify-between items-center">
                  <span class="font-semibold text-gray-800">${repo.name}</span>
                  <a href="${repo.html_url}" target="_blank" 
                     class="text-blue-600 text-sm hover:underline">View</a>
                </div>
              </li>
            `);
          });
        }
      });
    },

    error: function () {
      $("#loading").hide();
      $("#githubData").html(`
        <p class="text-center text-red-500 font-semibold mt-4">
          User tidak ditemukan
        </p>
      `);
    }
  });
});