/* External events imported from SF_NYC_Dev_and_Startup_Events_2026.xlsx
   (New York City and San Francisco tabs). Columns without a source value stay blank. */

function importedEvent(id, eventName, date, expectedAttendees, targetAudience) {
  return { id, eventName, date, lumaLink: '', expectedAttendees, currentAttendees: '', targetAudience, checklistLink: '' };
}

export const NYC_EXTERNAL_EVENTS = [
  importedEvent("nyc-ext-1", "AI Tinkerers NYC – Jev Demo Day", "Oct 7", "n/a", "5-minute live demos from AI builders/practitioners"),
  importedEvent("nyc-ext-2", "AI Engineer New York 2026", "Oct 12–14", "n/a", "Engineers & technical leaders building production AI in finance"),
  importedEvent("nyc-ext-3", "AI Tinkerers NYC – Agentic Loops Demo Day", "Oct 21", "n/a", "Keynote + community demos on autonomous agent loops"),
  importedEvent("nyc-ext-4", "ERA Summer 2026 Demo Day", "Late Oct (TBC – batch runs to Oct 31)", "700", "~15 startups from NYC's largest accelerator pitch to angels & VCs"),
  importedEvent("nyc-ext-5", "AI Native DevCon New York 2026", "Nov 2–4", "n/a", "AI-native software development"),
  importedEvent("nyc-ext-6", "Open Source in Finance Forum New York", "Nov 4–5", "n/a", "Open source in financial services (Linux Foundation / FINOS)"),
  importedEvent("nyc-ext-7", "JSNation US 2026", "Nov 16 in person (Nov 19 remote)", "700", "JavaScript / full-stack engineers; 40 talks, workshops"),
  importedEvent("nyc-ext-8", "AI Coding Summit NYC", "Nov 16–17 in person (Nov 19 remote)", "n/a", "Coding agents, AI code review, context engineering"),
  importedEvent("nyc-ext-9", "React Summit US 2026", "Nov 17 in person (Nov 20 remote)", "800", "React / front-end & full-stack engineers"),
  importedEvent("nyc-ext-10", "AI Dev NYC 2026 (DeepLearning.AI)", "Nov 30 – Dec 1", "2,500", "Hands-on AI engineering conference hosted by Andrew Ng's team; 50+ labs"),
  importedEvent("nyc-ext-11", "The AI Summit New York", "Dec 9–10", "5,000", "Enterprise/commercial AI; buyers, vendors, startup & investor village"),
  importedEvent("nyc-ext-12", "Techstars NYC Fall 2026 Demo Day", "Dec 10", "n/a", "Techstars NYC Fall cohort (~10–12 startups) pitches to investors"),
];

export const SF_EXTERNAL_EVENTS = [
  importedEvent("sf-ext-1", "SF Tech Week", "Oct 5–11", "n/a", "Week of founder/VC/dev meetups, mixers, demo nights hosted across SF"),
  importedEvent("sf-ext-2", "a16z speedrun Demo Day (SR007)", "Oct 6", "1,000", "~60–70 speedrun startups pitch (AI, gaming, consumer, XR) to investors"),
  importedEvent("sf-ext-3", "TechCrunch Disrupt 2026", "Oct 13–15", "10,000", "Startup pitches (Startup Battlefield), founders, VCs, tech leaders; 250+ sessions"),
  importedEvent("sf-ext-4", "Next.js Conf 2026", "Oct 22 (listings show Oct 22–23)", "1,000", "Vercel's web dev conference: Next.js, React, AI SDK, v0"),
  importedEvent("sf-ext-5", "GitHub Universe 2026", "Oct 28–29 (invite-only day Oct 27)", "4,000", "GitHub's flagship dev event: Copilot, agentic coding, DevOps, security"),
  importedEvent("sf-ext-6", "OWASP Global AppSec USA", "Nov 2–6", "800", "Application security engineers, AppSec teams, security researchers"),
  importedEvent("sf-ext-7", "AI Engineer Code Summit 2026", "Nov 10–12", "1,500", "Coding agents & dev tools; AI engineers, researchers, founders"),
  importedEvent("sf-ext-8", "Cerebral Valley AI Summit", "Nov 12", "350", "~50% venture-backed AI founders, ~33% investors, plus media/execs"),
  importedEvent("sf-ext-9", "QCon San Francisco 2026", "Nov 16–18 (+ training Nov 19–20)", "1,500", "Senior engineers, architects, eng leaders; 12 tracks incl. AI engineering"),
  importedEvent("sf-ext-10", "Microsoft Ignite 2026", "Nov 17–20 (pre-day Nov 16)", "15,000", "IT pros, cloud architects, developers: Azure, Copilot, agents, security"),
  importedEvent("sf-ext-11", "YC Fall 2026 Demo Day", "Dec 2", "1,500", "Y Combinator F26 batch pitches to investors and press"),
];

