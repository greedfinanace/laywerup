export interface RedFlag {
  clause: string;
  issue: string;
  severity: "High" | "Medium";
  fix: string;
}

export interface AnalysisResult {
  contractType: string;
  riskScore: number;
  summary: string;
  redFlags: RedFlag[];
  fairTerms: string[];
  missingClauses: string[];
}
