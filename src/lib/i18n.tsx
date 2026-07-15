"use client";

import { createContext, useCallback, useContext, useEffect, useState } from "react";
import type { L10n, Lang } from "./types";

/** UI chrome dictionary. Content (profiles, roles, items) carries its own L10n. */
const DICT = {
  tagline: {
    en: "The Performance Intelligence Platform by Hubcycle",
    fr: "La plateforme d’intelligence de la performance par Hubcycle",
  },
  "nav.recruit": { en: "Apex Recruit", fr: "Apex Recruit" },
  "nav.dynamics": { en: "Apex Dynamics", fr: "Apex Dynamics" },
  "nav.coach": { en: "Apex Coach", fr: "Apex Coach" },
  "nav.growth": { en: "Apex Growth", fr: "Apex Growth" },
  "nav.insights": { en: "Apex Insights", fr: "Apex Insights" },
  "nav.methodology": { en: "Methodology", fr: "Méthodologie" },
  "nav.logout": { en: "Sign out", fr: "Déconnexion" },
  "section.recruit.desc": { en: "Candidate fit — culture, role and team.", fr: "Adéquation candidat — culture, poste et équipe." },
  "section.dynamics.desc": { en: "Team maps — strengths and gaps of each team.", fr: "Cartographies d’équipe — forces et manques de chaque équipe." },
  "section.coach.desc": { en: "Manager guidance — motivators, frustrations, coaching.", fr: "Guide manager — moteurs, frustrations, coaching." },
  "section.growth.desc": { en: "Individual profile, coaching and development.", fr: "Profil individuel, coaching et développement." },
  "section.insights.desc": { en: "Organizational analytics.", fr: "Analyses organisationnelles." },
  "home.title": { en: "Reveal how people perform.", fr: "Révélez comment les personnes performent." },
  "home.sub": {
    en: "Apex assesses natural contribution styles — not job titles, not stereotypes. Culture alignment, role match and team dynamics, in one understated platform.",
    fr: "Apex évalue les styles de contribution naturels — pas les intitulés de poste, pas les stéréotypes. Alignement culturel, adéquation au poste et dynamique d’équipe, sur une plateforme sobre.",
  },
  "home.admin": { en: "Admin access", fr: "Accès admin" },
  "home.invited": { en: "I received an invitation link", fr: "J’ai reçu un lien d’invitation" },
  "home.invitedHint": {
    en: "Open the personal link you received by email to start your assessment.",
    fr: "Ouvrez le lien personnel reçu par e-mail pour démarrer votre évaluation.",
  },
  "login.title": { en: "Admin access", fr: "Accès admin" },
  "login.code": { en: "Access code", fr: "Code d’accès" },
  "login.submit": { en: "Sign in", fr: "Se connecter" },
  "login.error": { en: "Invalid access code.", fr: "Code d’accès invalide." },
  "login.note": {
    en: "Full results are restricted to HR and hiring managers.",
    fr: "Les résultats complets sont réservés aux RH et aux managers recruteurs.",
  },
  "dash.title": { en: "Dashboard", fr: "Tableau de bord" },
  "dash.completed": { en: "completed assessments", fr: "évaluations complétées" },
  "dash.pending": { en: "pending invitations", fr: "invitations en attente" },
  "dash.teams": { en: "teams", fr: "équipes" },
  "recruit.title": { en: "Apex Recruit", fr: "Apex Recruit" },
  "recruit.sub": { en: "Send the assessment to candidates and review their fit.", fr: "Envoyez l’évaluation aux candidats et analysez leur adéquation." },
  "recruit.invite": { en: "New invitation", fr: "Nouvelle invitation" },
  "recruit.name": { en: "Full name", fr: "Nom complet" },
  "recruit.email": { en: "Email (optional)", fr: "E-mail (facultatif)" },
  "recruit.role": { en: "Role (fiche de poste)", fr: "Poste (fiche de poste)" },
  "recruit.team": { en: "Team to compare with (optional)", fr: "Équipe de comparaison (facultatif)" },
  "recruit.kind": { en: "Type", fr: "Type" },
  "recruit.candidate": { en: "Candidate", fr: "Candidat·e" },
  "recruit.employee": { en: "Employee", fr: "Collaborateur·rice" },
  "recruit.create": { en: "Create invitation", fr: "Créer l’invitation" },
  "recruit.copyLink": { en: "Copy link", fr: "Copier le lien" },
  "recruit.copied": { en: "Copied", fr: "Copié" },
  "recruit.viewReport": { en: "View report", fr: "Voir le rapport" },
  "recruit.awaiting": { en: "Awaiting completion", fr: "En attente de passation" },
  "recruit.none": { en: "No invitations yet.", fr: "Aucune invitation pour le moment." },
  "recruit.delete": { en: "Delete", fr: "Supprimer" },
  "report.fullTitle": { en: "Full assessment report", fr: "Rapport d’évaluation complet" },
  "report.confidential": { en: "Confidential — HR & hiring manager only", fr: "Confidentiel — réservé RH et manager recruteur" },
  "report.digest": { en: "Candidate digest", fr: "Synthèse candidat" },
  "report.digestNote": {
    en: "This digest describes the personality and contribution style only. It contains no comparison with Hubcycle values, role success factors or teams, and can be shared with the person assessed.",
    fr: "Cette synthèse décrit uniquement la personnalité et le style de contribution. Elle ne contient aucune comparaison avec les valeurs Hubcycle, les facteurs de succès du poste ou les équipes, et peut être partagée avec la personne évaluée.",
  },
  "report.downloadPdf": { en: "Download PDF", fr: "Télécharger le PDF" },
  "report.openDigest": { en: "Open candidate digest", fr: "Ouvrir la synthèse candidat" },
  "report.profile": { en: "Natural profile", fr: "Profil naturel" },
  "report.secondary": { en: "Secondary profile", fr: "Profil secondaire" },
  "report.profileScores": { en: "Contribution profile", fr: "Profil de contribution" },
  "report.culture": { en: "Culture alignment", fr: "Alignement culturel" },
  "report.cultureVs": { en: "Against the Hubcycle Manifesto", fr: "Au regard du Manifeste Hubcycle" },
  "report.roleMatch": { en: "Role match", fr: "Adéquation au poste" },
  "report.roleVs": { en: "Against the role's top success factors", fr: "Au regard des facteurs clés de succès du poste" },
  "report.teamFit": { en: "Team dynamics", fr: "Dynamique d’équipe" },
  "report.strengths": { en: "Core strengths", fr: "Forces principales" },
  "report.watchouts": { en: "Potential watch-outs", fr: "Points de vigilance" },
  "report.asContributor": { en: "As an individual contributor in the role", fr: "En tant que contributeur·rice individuel·le dans le poste" },
  "report.asTeamFit": { en: "As a fit to the team", fr: "En tant que membre de l’équipe" },
  "report.motivators": { en: "Top 3 motivators", fr: "Top 3 des moteurs" },
  "report.frustrations": { en: "Top 3 frustrations", fr: "Top 3 des frustrations" },
  "report.coachTips": { en: "How to coach", fr: "Comment les coacher" },
  "report.workstyle": { en: "Work-style facets", fr: "Facettes du style de travail" },
  "report.hypothesis": {
    en: "These results describe declared work preferences. They are hypotheses to explore in a structured interview — not verdicts.",
    fr: "Ces résultats décrivent des préférences de travail déclarées. Ce sont des hypothèses à explorer en entretien structuré — pas des verdicts.",
  },
  "report.notCompleted": { en: "This assessment has not been completed yet.", fr: "Cette évaluation n’a pas encore été complétée." },
  "assess.welcome": { en: "Welcome", fr: "Bienvenue" },
  "assess.intro1": {
    en: "This assessment explores how you naturally contribute at work. It takes 15–20 minutes.",
    fr: "Cette évaluation explore votre façon naturelle de contribuer au travail. Elle dure 15 à 20 minutes.",
  },
  "assess.intro2": {
    en: "There are no right or wrong answers. Answer spontaneously, as you are at work most of the time — not as you think you should be.",
    fr: "Il n’y a pas de bonnes ou de mauvaises réponses. Répondez spontanément, tel·le que vous êtes au travail la plupart du temps — pas tel·le que vous pensez devoir être.",
  },
  "assess.privacy": {
    en: "Your answers are only used to generate your assessment. Items only concern work behaviours and preferences.",
    fr: "Vos réponses servent uniquement à générer votre évaluation. Les questions ne portent que sur des comportements et préférences de travail.",
  },
  "assess.start": { en: "Start the assessment", fr: "Commencer l’évaluation" },
  "assess.next": { en: "Next", fr: "Suivant" },
  "assess.back": { en: "Back", fr: "Retour" },
  "assess.submit": { en: "Submit my answers", fr: "Envoyer mes réponses" },
  "assess.progress": { en: "Question", fr: "Question" },
  "assess.of": { en: "of", fr: "sur" },
  "assess.likert1": { en: "Not at all like me", fr: "Pas du tout moi" },
  "assess.likert5": { en: "Exactly like me", fr: "Exactement moi" },
  "assess.done.title": { en: "Thank you — your assessment is complete.", fr: "Merci — votre évaluation est terminée." },
  "assess.done.body": {
    en: "Your answers have been recorded. The Hubcycle team will come back to you about the next steps.",
    fr: "Vos réponses ont été enregistrées. L’équipe Hubcycle reviendra vers vous pour la suite.",
  },
  "assess.invalid": { en: "This invitation link is invalid or has already been used.", fr: "Ce lien d’invitation est invalide ou a déjà été utilisé." },
  "assess.answerAll": { en: "Please answer every question in this section.", fr: "Merci de répondre à toutes les questions de cette section." },
  "dyn.title": { en: "Apex Dynamics", fr: "Apex Dynamics" },
  "dyn.sub": { en: "Map the contribution profiles of each team, spot strengths and gaps.", fr: "Cartographiez les profils de contribution de chaque équipe, identifiez forces et manques." },
  "dyn.newTeam": { en: "New team", fr: "Nouvelle équipe" },
  "dyn.teamName": { en: "Team name", fr: "Nom de l’équipe" },
  "dyn.create": { en: "Create", fr: "Créer" },
  "dyn.allHubcycle": { en: "All Hubcycle", fr: "Tout Hubcycle" },
  "dyn.members": { en: "members with results", fr: "membres avec résultats" },
  "dyn.coverage": { en: "Profile coverage", fr: "Couverture des profils" },
  "dyn.wellCovered": { en: "Well covered", fr: "Bien couvert" },
  "dyn.gap": { en: "Gap", fr: "Manque" },
  "dyn.map": { en: "Team map", fr: "Carte d’équipe" },
  "dyn.axisX": { en: "Reflection ↔ Action", fr: "Réflexion ↔ Action" },
  "dyn.axisY": { en: "Systems ↔ People", fr: "Systèmes ↔ Personnes" },
  "dyn.candidateOverlay": { en: "Candidate overlay", fr: "Candidat·e superposé·e" },
  "dyn.noMembers": { en: "No completed assessments in this team yet.", fr: "Aucune évaluation complétée dans cette équipe pour le moment." },
  "coach.title": { en: "Apex Coach", fr: "Apex Coach" },
  "coach.sub": { en: "Practical guidance for managers, person by person.", fr: "Des repères concrets pour les managers, personne par personne." },
  "growth.title": { en: "Apex Growth", fr: "Apex Growth" },
  "growth.sub": { en: "Individual profile, strengths and development priorities.", fr: "Profil individuel, forces et priorités de développement." },
  "insights.title": { en: "Apex Insights", fr: "Apex Insights" },
  "insights.sub": { en: "Organizational analytics across all completed assessments.", fr: "Analyses organisationnelles sur l’ensemble des évaluations complétées." },
  "insights.profileDist": { en: "Profile distribution", fr: "Répartition des profils" },
  "insights.cultureAvg": { en: "Average culture alignment by value", fr: "Alignement culturel moyen par valeur" },
  "insights.none": { en: "No completed assessments yet.", fr: "Aucune évaluation complétée pour le moment." },
  "common.employees": { en: "Employees", fr: "Collaborateurs" },
  "common.candidates": { en: "Candidates", fr: "Candidats" },
  "common.role": { en: "Role", fr: "Poste" },
  "common.team": { en: "Team", fr: "Équipe" },
  "common.overall": { en: "Overall", fr: "Global" },
  "common.scale15": { en: "on a 1–5 scale", fr: "sur une échelle de 1 à 5" },
  "common.back": { en: "Back", fr: "Retour" },
  "common.save": { en: "Save", fr: "Enregistrer" },
  "common.demo": {
    en: "Demo storage mode: data is not persistent. Configure Vercel KV / Upstash to persist data (see README).",
    fr: "Mode de stockage démo : les données ne sont pas persistantes. Configurez Vercel KV / Upstash pour les conserver (voir README).",
  },
} as const;

export type DictKey = keyof typeof DICT;

interface I18nCtx {
  lang: Lang;
  setLang: (l: Lang) => void;
  t: (key: DictKey) => string;
  l: (s: L10n) => string;
}

const Ctx = createContext<I18nCtx>({
  lang: "en",
  setLang: () => {},
  t: (k) => DICT[k].en,
  l: (s) => s.en,
});

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<Lang>("en");

  useEffect(() => {
    const saved = window.localStorage.getItem("apex-lang");
    if (saved === "fr" || saved === "en") setLangState(saved);
    else if (navigator.language.toLowerCase().startsWith("fr")) setLangState("fr");
  }, []);

  const setLang = useCallback((l: Lang) => {
    setLangState(l);
    window.localStorage.setItem("apex-lang", l);
  }, []);

  const t = useCallback((key: DictKey) => DICT[key][lang], [lang]);
  const l = useCallback((s: L10n) => s[lang], [lang]);

  return <Ctx.Provider value={{ lang, setLang, t, l }}>{children}</Ctx.Provider>;
}

export function useI18n() {
  return useContext(Ctx);
}
