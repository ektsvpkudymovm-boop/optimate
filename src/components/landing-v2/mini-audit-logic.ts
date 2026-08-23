import { auditRecommendations } from "./landing-v2-data";

export type AuditResult = { heading: string; lead: string; recommendations: readonly string[] };

export function getAuditResult(selectedIndexes: readonly number[]): AuditResult {
  const selected = [...new Set(selectedIndexes)].filter((index) => Number.isInteger(index) && index >= 0 && index < auditRecommendations.length).sort((a, b) => a - b);
  if (selected.length === 0) return { heading: "Похоже, у вас всё уже оптимизировано", lead: "Если позже появятся ручные повторы, рост команды или звонков — обсудим, как ИИ снизит нагрузку.", recommendations: [] };
  if (selected.length <= 2) return { heading: `Есть ${selected.length} точка роста`, lead: "Вы отметили признаки, которые можно автоматизировать. Вот направления, которые подойдут именно вам:", recommendations: selected.map((index) => auditRecommendations[index]) };
  return { heading: "Сильный потенциал автоматизации", lead: `Если хотя бы на 2–3 вопроса ответ «да» — есть что автоматизировать. У вас ${selected.length} совпадений. Рекомендуем начать с:`, recommendations: selected.map((index) => auditRecommendations[index]) };
}
