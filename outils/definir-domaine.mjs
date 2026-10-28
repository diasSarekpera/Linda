// Remplace l'adresse du site dans tous les fichiers qui la contiennent
// (balises de partage, lien canonique, données structurées Google, sitemap, robots).
//
// Utilisation (depuis le dossier du projet) :
//   node outils/definir-domaine.mjs ancien-domaine.com nouveau-domaine.com
// Exemple :
//   node outils/definir-domaine.mjs linda-9193.onrender.com lindaanagonou.com
import { readFileSync, writeFileSync } from 'node:fs';

const [ancien, nouveau] = process.argv.slice(2);
if (!ancien || !nouveau) {
  console.error('Usage : node outils/definir-domaine.mjs ancien-domaine nouveau-domaine');
  process.exit(1);
}
const clean = (d) => d.replace(/^https?:\/\//, '').replace(/\/$/, '');
const [a, n] = [clean(ancien), clean(nouveau)];
let total = 0;
for (const f of ['index.html', 'sitemap.xml', 'robots.txt']) {
  const t = readFileSync(f, 'utf8');
  const nb = t.split(a).length - 1;
  if (nb) { writeFileSync(f, t.split(a).join(n)); console.log(`✓ ${f} : ${nb} remplacement(s)`); total += nb; }
}
console.log(total ? `\nTerminé : ${a} → ${n}` : `Aucune occurrence de "${a}" trouvée.`);
