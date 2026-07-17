/* CVFuté — éditeur de CV 100 % côté navigateur.
   Aucune donnée ne quitte cette page : état en mémoire + localStorage. */
(function () {
  "use strict";

  var STORAGE_KEY = "cvfute_data";
  var PRO_KEY = "cvfute_pro";
  // Lien de paiement Stripe (Payment Link) — remplacé au lancement.
  var STRIPE_LINK = "#tarifs";

  var state = {
    nom: "", titre: "", email: "", tel: "", ville: "", lien: "",
    profil: "", competences: "", langues: "", interets: "",
    exp: [], form: [],
    template: "moderne"
  };

  // ---------- Persistance ----------
  function save() {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); } catch (e) { /* stockage plein/désactivé */ }
  }
  function load() {
    try {
      var raw = localStorage.getItem(STORAGE_KEY);
      if (raw) Object.assign(state, JSON.parse(raw));
    } catch (e) { /* données corrompues : on repart à neuf */ }
  }
  function isPro() { return localStorage.getItem(PRO_KEY) === "1"; }

  // ---------- Utilitaires ----------
  function esc(text) {
    var div = document.createElement("div");
    div.textContent = text || "";
    // innerHTML n'échappe pas les guillemets : indispensable dans les attributs value="…".
    return div.innerHTML.replace(/"/g, "&quot;").replace(/'/g, "&#39;");
  }
  function $(sel) { return document.querySelector(sel); }
  function $all(sel) { return Array.prototype.slice.call(document.querySelectorAll(sel)); }

  // ---------- Listes dynamiques (expériences / formations) ----------
  function expRow(item, index) {
    return '<div class="list-item" data-kind="exp" data-index="' + index + '">' +
      '<div class="form-row">' +
      '<label>Poste<input type="text" data-field="poste" value="' + esc(item.poste) + '" placeholder="Chef de projet"></label>' +
      '<label>Entreprise<input type="text" data-field="entreprise" value="' + esc(item.entreprise) + '" placeholder="Agence Web, Lyon"></label>' +
      "</div>" +
      '<div class="form-row">' +
      '<label>Début<input type="text" data-field="debut" value="' + esc(item.debut) + '" placeholder="2022"></label>' +
      '<label>Fin<input type="text" data-field="fin" value="' + esc(item.fin) + '" placeholder="Aujourd’hui"></label>' +
      "</div>" +
      '<label>Missions clés<textarea data-field="description" rows="2" placeholder="Une réalisation par ligne, avec des chiffres si possible">' + esc(item.description) + "</textarea></label>" +
      '<button type="button" class="btn-link danger" data-remove>Supprimer</button>' +
      "</div>";
  }
  function formRow(item, index) {
    return '<div class="list-item" data-kind="form" data-index="' + index + '">' +
      '<div class="form-row">' +
      '<label>Diplôme<input type="text" data-field="diplome" value="' + esc(item.diplome) + '" placeholder="Master Marketing"></label>' +
      '<label>École<input type="text" data-field="ecole" value="' + esc(item.ecole) + '" placeholder="Université Lyon 2"></label>' +
      "</div>" +
      '<label>Année<input type="text" data-field="annee" value="' + esc(item.annee) + '" placeholder="2020"></label>' +
      '<button type="button" class="btn-link danger" data-remove>Supprimer</button>' +
      "</div>";
  }
  function renderLists() {
    $("#list-exp").innerHTML = state.exp.map(expRow).join("");
    $("#list-form").innerHTML = state.form.map(formRow).join("");
  }

  // ---------- Aperçu ----------
  function splitList(raw) {
    return (raw || "").split(",").map(function (s) { return s.trim(); }).filter(Boolean);
  }

  function renderPreview() {
    var sidebar =
      '<aside class="cv-side">' +
      (state.email ? '<p class="cv-contact">' + esc(state.email) + "</p>" : "") +
      (state.tel ? '<p class="cv-contact">' + esc(state.tel) + "</p>" : "") +
      (state.ville ? '<p class="cv-contact">' + esc(state.ville) + "</p>" : "") +
      (state.lien ? '<p class="cv-contact">' + esc(state.lien) + "</p>" : "") +
      (splitList(state.competences).length ?
        "<h3>Compétences</h3><ul>" + splitList(state.competences).map(function (c) { return "<li>" + esc(c) + "</li>"; }).join("") + "</ul>" : "") +
      (splitList(state.langues).length ?
        "<h3>Langues</h3><ul>" + splitList(state.langues).map(function (l) { return "<li>" + esc(l) + "</li>"; }).join("") + "</ul>" : "") +
      (state.interets ? "<h3>Intérêts</h3><p>" + esc(state.interets) + "</p>" : "") +
      "</aside>";

    var expHtml = state.exp.filter(function (e) { return e.poste || e.entreprise; }).map(function (e) {
      var dates = [e.debut, e.fin].filter(Boolean).join(" — ");
      return '<div class="cv-item">' +
        '<div class="cv-item-head"><strong>' + esc(e.poste) + "</strong><span>" + esc(dates) + "</span></div>" +
        '<p class="cv-item-sub">' + esc(e.entreprise) + "</p>" +
        (e.description ? "<ul>" + e.description.split("\n").filter(Boolean).map(function (l) { return "<li>" + esc(l) + "</li>"; }).join("") + "</ul>" : "") +
        "</div>";
    }).join("");

    var formHtml = state.form.filter(function (f) { return f.diplome || f.ecole; }).map(function (f) {
      return '<div class="cv-item">' +
        '<div class="cv-item-head"><strong>' + esc(f.diplome) + "</strong><span>" + esc(f.annee) + "</span></div>" +
        '<p class="cv-item-sub">' + esc(f.ecole) + "</p></div>";
    }).join("");

    var main =
      '<div class="cv-main">' +
      '<header class="cv-head"><h1>' + (esc(state.nom) || "Votre Nom") + "</h1>" +
      '<p class="cv-title">' + (esc(state.titre) || "Titre du poste visé") + "</p></header>" +
      (state.profil ? '<p class="cv-profil">' + esc(state.profil) + "</p>" : "") +
      (expHtml ? "<h2>Expérience</h2>" + expHtml : "") +
      (formHtml ? "<h2>Formation</h2>" + formHtml : "") +
      "</div>";

    $("#cv-preview").innerHTML = sidebar + main;
    $("#cv-preview").className = "cv-sheet tpl-" + state.template;
  }

  function renderAll() { renderLists(); renderPreview(); save(); }

  // ---------- Champs simples ----------
  var simpleFields = ["nom", "titre", "email", "tel", "ville", "lien", "profil", "competences", "langues", "interets"];
  function bindSimpleFields() {
    simpleFields.forEach(function (name) {
      var input = $("#f-" + name);
      input.value = state[name] || "";
      input.addEventListener("input", function () {
        state[name] = input.value;
        renderPreview(); save();
      });
    });
  }

  // ---------- Événements listes ----------
  document.addEventListener("click", function (event) {
    var add = event.target.getAttribute && event.target.getAttribute("data-add");
    if (add === "exp") { state.exp.push({ poste: "", entreprise: "", debut: "", fin: "", description: "" }); renderAll(); }
    if (add === "form") { state.form.push({ diplome: "", ecole: "", annee: "" }); renderAll(); }
    if (event.target.hasAttribute && event.target.hasAttribute("data-remove")) {
      var item = event.target.closest(".list-item");
      state[item.getAttribute("data-kind")].splice(Number(item.getAttribute("data-index")), 1);
      renderAll();
    }
  });
  document.addEventListener("input", function (event) {
    var field = event.target.getAttribute && event.target.getAttribute("data-field");
    if (!field) return;
    var item = event.target.closest(".list-item");
    if (!item) return;
    state[item.getAttribute("data-kind")][Number(item.getAttribute("data-index"))][field] = event.target.value;
    renderPreview(); save();
  });

  // ---------- Modèles & Pack Pro ----------
  function refreshPickerLocks() {
    $all("#template-picker button").forEach(function (btn) {
      if (btn.getAttribute("data-pro") && isPro()) {
        btn.textContent = btn.textContent.replace(" 🔒", "");
        btn.removeAttribute("data-pro");
      }
    });
  }
  $("#template-picker").addEventListener("click", function (event) {
    var btn = event.target.closest("button");
    if (!btn) return;
    if (btn.getAttribute("data-pro") && !isPro()) {
      // Modèle verrouillé : on emmène vers la section Pack Pro (pas de popup).
      document.getElementById("tarifs").scrollIntoView({ behavior: "smooth" });
      $("#input-code").focus({ preventScroll: true });
      return;
    }
    state.template = btn.getAttribute("data-template");
    $all("#template-picker button").forEach(function (b) { b.classList.remove("active"); });
    btn.classList.add("active");
    renderPreview(); save();
  });

  if (STRIPE_LINK.indexOf("http") === 0) {
    $("#btn-buy").setAttribute("href", STRIPE_LINK);
  } else {
    // Paiement pas encore branché : on l'annonce au lieu de ne rien faire.
    $("#btn-buy").addEventListener("click", function (event) {
      event.preventDefault();
      feedback("Le paiement en ligne ouvre très bientôt. Revenez dans quelques jours !", "ok");
    });
  }

  function sha256Hex(text) {
    return crypto.subtle.digest("SHA-256", new TextEncoder().encode(text)).then(function (buf) {
      return Array.prototype.map.call(new Uint8Array(buf), function (b) {
        return b.toString(16).padStart(2, "0");
      }).join("");
    });
  }
  function feedback(message, cls) {
    $("#code-feedback").textContent = message;
    $("#code-feedback").className = "code-feedback " + cls;
  }
  function validateCode() {
    var code = $("#input-code").value.trim().toUpperCase();
    if (!code) { feedback("Entrez votre code (format CVPRO-XXXX-XXXX).", "ko"); return; }
    if (!window.crypto || !crypto.subtle) {
      feedback("Navigateur trop ancien ou page non sécurisée : ouvrez le site en https.", "ko");
      return;
    }
    sha256Hex(code).then(function (hash) {
      if (window.CVFUTE_CODE_HASHES && window.CVFUTE_CODE_HASHES.indexOf(hash) !== -1) {
        localStorage.setItem(PRO_KEY, "1");
        refreshPickerLocks();
        $("#code-feedback").textContent = "✅ Pack Pro débloqué à vie. Merci ! Tous les modèles sont disponibles.";
        $("#code-feedback").className = "code-feedback ok";
      } else {
        feedback("Code invalide. Vérifiez la saisie (format CVPRO-XXXX-XXXX).", "ko");
      }
    }).catch(function () {
      feedback("Erreur inattendue pendant la vérification. Réessayez.", "ko");
    });
  }
  $("#btn-validate-code").addEventListener("click", validateCode);
  $("#input-code").addEventListener("keydown", function (event) {
    if (event.key === "Enter") { event.preventDefault(); validateCode(); }
  });

  // ---------- PDF & reset ----------
  $("#btn-pdf").addEventListener("click", function () { window.print(); });
  $("#btn-reset").addEventListener("click", function () {
    if (!confirm("Effacer toutes les données du CV ?")) return;
    localStorage.removeItem(STORAGE_KEY);
    location.reload();
  });

  // ---------- Démarrage ----------
  load();
  if (!state.exp.length) state.exp.push({ poste: "", entreprise: "", debut: "", fin: "", description: "" });
  if (!state.form.length) state.form.push({ diplome: "", ecole: "", annee: "" });
  bindSimpleFields();
  refreshPickerLocks();
  var activeBtn = document.querySelector('#template-picker [data-template="' + state.template + '"]');
  if (activeBtn && !(activeBtn.getAttribute("data-pro") && !isPro())) {
    $all("#template-picker button").forEach(function (b) { b.classList.remove("active"); });
    activeBtn.classList.add("active");
  } else {
    state.template = "moderne";
  }
  renderAll();
})();
