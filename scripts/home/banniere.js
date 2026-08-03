// banniere.js — comportement JS de la section Bannière + identité.
//
// Effet "machine à écrire" sur l'adresse : "Comè, Bénin" est déjà affiché
// en dur dans le HTML (visible immédiatement, y compris sans JS). Le reste
// de l'adresse (attribut data-suite sur .profil-lieu-suite, ex.
// ", Rue Amoussouvi") est ajouté lettre par lettre au chargement de la
// page, avec un curseur clignotant qui disparaît une fois le texte complet.

const suiteLieu = document.querySelector('.profil-lieu-suite');

if (suiteLieu) {
  const texteAEcrire = suiteLieu.dataset.suite || '';
  const curseurLieu = document.querySelector('.profil-lieu-curseur');
  const prefersReducedMotion = window.matchMedia(
    '(prefers-reduced-motion: reduce)'
  ).matches;

  if (!texteAEcrire) {
    // Rien à écrire : on masque simplement le curseur.
    if (curseurLieu) curseurLieu.classList.add('est-termine');
  } else if (prefersReducedMotion) {
    // Pas d'animation : le texte complet est affiché directement.
    suiteLieu.textContent = texteAEcrire;
    if (curseurLieu) curseurLieu.classList.add('est-termine');
  } else {
    const delaiParLettre = 120; // ms entre chaque caractère
    const delaiDepart = 2100; // laisse le temps à la cascade d'identité (motion.js), désormais plus lente, de s'afficher

    let index = 0;

    const ecrireLettreSuivante = () => {
      index += 1;
      suiteLieu.textContent = texteAEcrire.slice(0, index);

      if (index < texteAEcrire.length) {
        setTimeout(ecrireLettreSuivante, delaiParLettre);
      } else if (curseurLieu) {
        curseurLieu.classList.add('est-termine');
      }
    };

    setTimeout(ecrireLettreSuivante, delaiDepart);
  }
}
