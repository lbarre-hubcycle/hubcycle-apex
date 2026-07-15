"use client";

import { PROFILES } from "@/lib/profiles";
import { VALUES } from "@/lib/culture";
import { useI18n } from "@/lib/i18n";
import { SectionTitle } from "@/components/ui";

export default function MethodologyPage() {
  const { l, lang } = useI18n();
  const fr = lang === "fr";

  return (
    <div className="mx-auto max-w-3xl">
      <SectionTitle
        title={fr ? "Méthodologie" : "Methodology"}
        sub={
          fr
            ? "Comment Apex évalue — et ce qu’il n’évalue pas."
            : "How Apex assesses — and what it deliberately does not."
        }
      />

      <div className="space-y-4">
        <div className="card">
          <h3 className="font-heading text-lg text-deep">
            {fr ? "Des styles de contribution, pas des étiquettes" : "Contribution styles, not labels"}
          </h3>
          <p className="mt-2 text-sm leading-relaxed text-ink/70">
            {fr
              ? "Apex décrit comment une personne contribue naturellement à la performance d’une équipe — pas qui elle « est ». Les profils sont séparés du poste : on peut avoir un profil d’Ingénieur de course en travaillant comme Sales Manager, ou un profil de Stratège en Opérations. L’approche s’inspire des méthodologies de référence (SOSIE 2, Pearson TalentLens, Hogan, Working Genius, Predictive Index, DISC, CliftonStrengths) tout en évitant les stéréotypes des tests de personnalité traditionnels."
              : "Apex describes how someone naturally contributes to team performance — not who they “are”. Profiles are separated from the role: someone can have a Race Engineer profile while working as a Sales Manager, or a Strategist profile in Operations. The approach draws on reference methodologies (SOSIE 2, Pearson TalentLens, Hogan, Working Genius, Predictive Index, DISC, CliftonStrengths) while avoiding the stereotypes of traditional personality tests."}
          </p>
        </div>

        <div className="card">
          <h3 className="font-heading text-lg text-deep">
            {fr ? "Quatre dimensions d’évaluation" : "Four assessment dimensions"}
          </h3>
          <ul className="mt-3 space-y-2 text-sm text-ink/70">
            <li>
              <strong className="text-deep">{fr ? "Profil naturel" : "Natural profile"}</strong> —{" "}
              {fr
                ? "24 paires à choix forcé mesurent 8 styles de contribution. Le format ipsatif (deux affirmations positives) réduit la désirabilité sociale."
                : "24 forced-choice pairs measure 8 contribution styles. The ipsative format (two positive statements) reduces social desirability."}
            </li>
            <li>
              <strong className="text-deep">{fr ? "Adéquation au poste" : "Role match"}</strong> —{" "}
              {fr
                ? "chaque fiche de poste Notion fournit ses facteurs clés de succès ; chacun est noté de 1 à 5 via des compétences comportementales."
                : "each Notion fiche de poste provides its top success factors; each is rated 1–5 through behavioural competencies."}
            </li>
            <li>
              <strong className="text-deep">{fr ? "Dynamique d’équipe" : "Team dynamics"}</strong> —{" "}
              {fr
                ? "cartographie des styles sur deux axes (Réflexion ↔ Action, Systèmes ↔ Personnes) et analyse de couverture."
                : "styles mapped on two axes (Reflection ↔ Action, Systems ↔ People) plus coverage analysis."}
            </li>
            <li>
              <strong className="text-deep">{fr ? "Alignement culturel" : "Culture alignment"}</strong> —{" "}
              {fr
                ? "21 items mesurent les 7 valeurs du Manifeste Hubcycle, de « Super fit » à « Misfit »."
                : "21 items measure the 7 values of the Hubcycle Manifesto, from “Super fit” to “Misfit”."}
            </li>
          </ul>
        </div>

        <div className="card">
          <h3 className="font-heading text-lg text-deep">{fr ? "Les 8 profils" : "The 8 profiles"}</h3>
          <div className="mt-3 grid gap-2 sm:grid-cols-2">
            {PROFILES.map((p) => (
              <div key={p.id} className="rounded-xl bg-cloud/50 p-3 text-sm">
                <span className="font-semibold text-deep">
                  {p.emoji} {l(p.name)}
                </span>
                <div className="text-xs text-ink/60">{l(p.tagline)}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="card">
          <h3 className="font-heading text-lg text-deep">
            {fr ? "Les 7 valeurs du Manifeste" : "The 7 Manifesto values"}
          </h3>
          <div className="mt-3 space-y-2">
            {VALUES.map((v) => (
              <div key={v.id} className="text-sm">
                <span className="font-semibold text-deep">{l(v.name)}</span>{" "}
                <span className="text-xs text-ink/40">({l(v.scope)})</span>
                <div className="text-xs text-ink/60">{l(v.summary)}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="card border-coral/30">
          <h3 className="font-heading text-lg text-deep">
            {fr ? "Neutralité et éthique" : "Neutrality & ethics"}
          </h3>
          <ul className="mt-3 space-y-2 text-sm leading-relaxed text-ink/70">
            <li>
              •{" "}
              {fr
                ? "Tous les items décrivent des comportements et préférences de travail. Aucun item ne porte sur — ni ne corrèle avec — l’origine, l’âge, le genre ou le handicap."
                : "Every item describes work behaviours and preferences. No item references — or correlates with — origin, age, gender or disability."}
            </li>
            <li>
              •{" "}
              {fr
                ? "Aucun profil n’est « meilleur » qu’un autre : chaque style a des forces et des points de vigilance."
                : "No profile is “better” than another: every style has strengths and watch-outs."}
            </li>
            <li>
              •{" "}
              {fr
                ? "Les résultats sont des hypothèses à explorer en entretien structuré, jamais des verdicts, et ne doivent jamais être l’unique critère d’une décision de recrutement."
                : "Results are hypotheses to explore in a structured interview, never verdicts, and must never be the sole criterion of a hiring decision."}
            </li>
            <li>
              •{" "}
              {fr
                ? "Accès restreint : seuls les admins (RH, managers recruteurs) voient les résultats complets. La personne évaluée ne reçoit que sa synthèse, sans comparaison avec les valeurs, le poste ou l’équipe."
                : "Restricted access: only admins (HR, hiring managers) see full results. The person assessed only receives their digest, with no comparison against values, role or team."}
            </li>
            <li>
              •{" "}
              {fr
                ? "Passation : 15 à 20 minutes, en français ou en anglais."
                : "Completion time: 15–20 minutes, in French or English."}
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
