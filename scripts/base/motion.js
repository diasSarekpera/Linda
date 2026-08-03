// motion.js — reveal au scroll (Intersection Observer), avec transition
// garantie à CHAQUE chargement de page, quelle que soit la position de
// scroll de départ.
//
// Progressive enhancement : ce script n'active l'état "masqué puis révélé"
// (classe .motion-armed sur <html>) que si IntersectionObserver est
// supporté ET si l'utilisateur n'a pas demandé de réduire les animations.
// Dans tous les autres cas, on ne touche à rien : le contenu reste visible
// par défaut (voir motion.css). Aucune section ne peut donc rester
// invisible si ce script échoue ou n'est pas exécuté.
//
// --- Le problème que ce fichier corrige -------------------------------
// Quand une cible est DÉJÀ dans le viewport au moment où on l'observe
// (bannière au tout premier chargement, page courte, ou position de
// scroll restaurée par le navigateur après un rechargement), l'observer
// déclenche son callback quasi instantanément. Si on ajoute ".is-visible"
// directement dans ce callback, le navigateur peint l'état masqué et
// l'état visible dans le même cycle : les deux se fusionnent et la
// transition CSS (fade + décalage) n'est jamais perçue — la section
// "apparaît" déjà finie, comme si l'animation ne s'était pas jouée.
// C'est exactement ce qui se produisait sur toutes les sections SAUF la
// bannière (qui avait, elle, un correctif dédié).
//
// La correction — appliquée ici à TOUTES les sections — force un double
// requestAnimationFrame avant d'ajouter ".is-visible" : ça laisse le
// navigateur peindre l'état masqué au moins une fois avant de basculer
// vers l'état visible, donc la transition est garantie d'être visible,
// que la cible soit révélée au chargement ou en scrollant plus tard.

const prefersReducedMotion = window.matchMedia(
  '(prefers-reduced-motion: reduce)'
).matches;

if (!prefersReducedMotion && 'IntersectionObserver' in window) {
  document.documentElement.classList.add('motion-armed');

  const selecteurCibles =
    '.profil-banniere, .profil-apropos, .profil-projets-phares, .profil-experience, .profil-formation, .profil-langues, .profil-references';

  function revelerAvecTransitionGarantie(cible) {
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        cible.classList.add('is-visible');
      });
    });
  }

  let observateur = null;

  function armerReveal() {
    const cibles = document.querySelectorAll(selecteurCibles);

    observateur = new IntersectionObserver(
      (entrees, obs) => {
        entrees.forEach((entree) => {
          if (entree.isIntersecting) {
            revelerAvecTransitionGarantie(entree.target);
            obs.unobserve(entree.target);
          }
        });
      },
      {
        threshold: 0.15,
        rootMargin: '0px 0px -40px 0px',
      }
    );

    cibles.forEach((cible) => observateur.observe(cible));
  }

  armerReveal();

  // --- Retour arrière/avant via le cache du navigateur (bfcache) --------
  // Quand la page est restaurée depuis le bfcache (bouton précédent/
  // suivant) plutôt que rechargée, le DOM garde ses classes ".is-visible"
  // telles quelles et aucun script ne se ré-exécute : sans ce correctif,
  // revenir sur la page ne rejouerait jamais l'apparition. On réinitialise
  // les cibles et on relance l'observation pour que le reveal rejoue aussi
  // dans ce cas — cohérent avec un rechargement classique.
  window.addEventListener('pageshow', (evenement) => {
    if (!evenement.persisted) return;

    if (observateur) observateur.disconnect();
    document
      .querySelectorAll(selecteurCibles)
      .forEach((cible) => cible.classList.remove('is-visible'));

    requestAnimationFrame(() => requestAnimationFrame(armerReveal));
  });
}
