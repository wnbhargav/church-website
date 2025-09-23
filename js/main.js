async function getJSON(path) {
  try {
    const res = await fetch(path);
    return await res.json();
  } catch (e) {
    console.warn("Failed to load", path, e);
    return null;
  }
}

function setYear() {
  document.querySelectorAll("#year").forEach(n => n.textContent = new Date().getFullYear());
}

async function hydrateSiteInfo() {
  const site = await getJSON("data/site.json");
  if (!site) { setYear(); return; }

  document.querySelectorAll("#site-name, #site-name-foot").forEach(n => {
    n.textContent = site.church_name;
  });

  const social = document.getElementById("social-links");
  if (social && site.social) {
    social.innerHTML = "";
    Object.entries(site.social).forEach(([k, url]) => {
      if (url) {
        const a = document.createElement("a");
        a.href = k === "email" ? `mailto:${url}` : url;
        a.target = "_blank";
        const i = document.createElement("i");
        i.className = (k === "email") ? "fa fa-envelope" : `fab fa-${k}`;
        a.appendChild(i);
        social.appendChild(a);
      }
    });
  }

  setYear();
}

async function renderEvents() {
  const container = document.getElementById("events");
  if (!container) return;

  const data = await getJSON("data/events.json");
  if (!data) return;

  container.innerHTML = "";
  data.events.forEach(ev => {
    const card = document.createElement("div");
    card.className = "event-card";

    if (ev.poster) {
      const img = document.createElement("img");
      img.src = ev.poster;
      card.appendChild(img);
    }

    const h3 = document.createElement("h3");
    h3.textContent = ev.title;
    card.appendChild(h3);

    const p = document.createElement("p");
    p.textContent = ev.description;
    card.appendChild(p);

    container.appendChild(card);
  });
}

document.addEventListener("DOMContentLoaded", () => {
  hydrateSiteInfo();
  renderEvents();
});
