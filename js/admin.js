(function () {
  const params = new URLSearchParams(window.location.search);
  const isAdmin = params.get("admin") === "1";
  window.IS_ADMIN = isAdmin;

  const panel = document.getElementById("adminPanel");
  if (panel) panel.style.display = isAdmin ? "block" : "none";

  const badge = document.getElementById("modeBadge");
  if (badge) badge.textContent = isAdmin ? "modo admin" : "modo colegas";
})();