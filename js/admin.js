(function(){
  const params = new URLSearchParams(location.search);
  const isAdmin = params.get("admin") === "1";
  window.IS_ADMIN = isAdmin;

  const panel = document.getElementById("adminPanel");
  if (panel) panel.style.display = isAdmin ? "block" : "none";

  const badge = document.getElementById("mode");
  if (badge) badge.textContent = isAdmin ? "admin" : "colegas";
})();