// ═════════════════════════════════════════════════════════════════════════════
// FOODIES ZIMBABWE — GROQ API INTEGRATION SERVICE
// AI-powered intelligence for request analysis and reporting
// ═════════════════════════════════════════════════════════════════════════════

import { GroqAnalysis } from '@/types';

// GROQ API Configuration
const GROQ_API_KEY = process.env.GROQ_API_KEY || '';
const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions';
const GROQ_MODEL = process.env.GROQ_MODEL || 'llama3-70b-8192';

interface GroqRequest {
  model: string;
  messages: { role: 'system' | 'user' | 'assistant'; content: string }[];
  temperature?: number;
  max_tokens?: number;
}

interface GroqResponse {
  id: string;
  choices: {
    message: {
      content: string;
    };
    finish_reason: string;
  }[];
  usage: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}

// ═════════════════════════════════════════════════════════════════════════════
// GROQ SERVICE CLASS
// ═════════════════════════════════════════════════════════════════════════════

class GroqService {
  private apiKey: string;
  private model: string;
  private enabled: boolean;

  constructor() {
    this.apiKey = GROQ_API_KEY;
    this.model = GROQ_MODEL;
    this.enabled = !!this.apiKey;
  }

  /**
   * Check if GROQ service is available
   */
  isAvailable(): boolean {
    return this.enabled;
  }

  /**
   * Make API call to GROQ with retry logic
   */
  private async callGroq(request: GroqRequest, retries = 3): Promise<GroqResponse | null> {
    if (!this.enabled) {
      console.warn('GROQ API key not configured');
      return null;
    }

    for (let attempt = 1; attempt <= retries; attempt++) {
      try {
        const response = await fetch(GROQ_API_URL, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${this.apiKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(request),
        });

        if (!response.ok) {
          throw new Error(`GROQ API error: ${response.status} ${response.statusText}`);
        }

        return await response.json();
      } catch (error) {
        console.error(`GROQ API attempt ${attempt} failed:`, error);
        if (attempt === retries) return null;
        // Exponential backoff
        await new Promise(resolve => setTimeout(resolve, 1000 * attempt));
      }
    }
    return null;
  }

  /**
   * Generate executive summary for Director dashboard
   */
  async generateExecutiveSummary(data: {
    period: string;
    totalSpend: number;
    budgetUtilization: number;
    pendingApprovals: number;
    exceptions: number;
    priceDeviations: number;
    stockRisks: number;
  }): Promise<GroqAnalysis | null> {
    const systemPrompt = `You are a financial analyst for Foodies Zimbabwe. Generate a concise executive summary (3-4 bullet points) highlighting key risks, trends, and actions needed. Be professional and data-driven.`;

    const userPrompt = `Generate an executive summary for ${data.period}:
- Total Spend: $${data.totalSpend.toLocaleString()}
- Budget Utilization: ${data.budgetUtilization}%
- Pending Approvals: ${data.pendingApprovals}
- Exception Cases: ${data.exceptions}
- Price Deviations: ${data.priceDeviations}
- Stock Risk Items: ${data.stockRisks}

Provide 3-4 key insights and recommended actions.`;

    const response = await this.callGroq({
      model: this.model,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt },
      ],
      temperature: 0.3,
      max_tokens: 500,
    });

    if (!response) return null;

    return {
      id: `groq_${Date.now()}`,
      type: 'executive_brief',
      entityType: 'dashboard',
      entityId: 'executive',
      inputData: data,
      summary: response.choices[0]?.message?.content || '',
      model: this.model,
      tokensUsed: response.usage.total_tokens,
      processingTimeMs: 0, // Would track actual time
      createdAt: new Date().toISOString(),
    };
  }

  /**
   * Explain price deviation patterns
   */
  async explainDeviationPattern(deviations: Array<{
    productName: string;
    variancePercent: number;
    reason: string;
    supplierName: string;
  }>): Promise<GroqAnalysis | null> {
    const systemPrompt = `You are a procurement analyst. Analyze price deviation patterns and provide insights on supplier pricing behavior and market trends. Be concise and actionable.`;

    const deviationsText = deviations.map(d => 
      `- ${d.productName}: ${d.variancePercent}% variance from ${d.supplierName} (${d.reason})`
    ).join('\n');

    const userPrompt = `Analyze these price deviations and provide insights:\n${deviationsText}\n\nIdentify patterns, risky suppliers, and recommendations for procurement strategy.`;

    const response = await this.callGroq({
      model: this.model,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt },
      ],
      temperature: 0.4,
      max_tokens: 400,
    });

    if (!response) return null;

    return {
      id: `groq_${Date.now()}`,
      type: 'deviation_explanation',
      entityType: 'price_deviation',
      entityId: 'batch',
      inputData: { deviations },
      summary: response.choices[0]?.message?.content || '',
      model: this.model,
      tokensUsed: response.usage.total_tokens,
      processingTimeMs: 0,
      createdAt: new Date().toISOString(),
    };
  }

  /**
   * Analyze supplier performance issues
   */
  async analyzeSupplierIssues(supplierData: {
    supplierName: string;
    urgentRequests: number;
    priceDeviationCount: number;
    avgFulfillmentDays: number;
    unavailableProducts: number;
  }): Promise<GroqAnalysis | null> {
    const systemPrompt = `You are a supplier relationship manager. Analyze supplier performance data and provide recommendations for supplier management.`;

    const userPrompt = `Analyze supplier ${supplierData.supplierName}:
- Urgent requests caused: ${supplierData.urgentRequests}
- Price deviations: ${supplierData.priceDeviationCount}
- Avg fulfillment time: ${supplierData.avgFulfillmentDays} days
- Unavailable products: ${supplierData.unavailableProducts}

Provide risk assessment and recommendations.`;

    const response = await this.callGroq({
      model: this.model,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt },
      ],
      temperature: 0.3,
      max_tokens: 400,
    });

    if (!response) return null;

    return {
      id: `groq_${Date.now()}`,
      type: 'supplier_assessment',
      entityType: 'supplier',
      entityId: supplierData.supplierName,
      inputData: supplierData,
      summary: response.choices[0]?.message?.content || '',
      model: this.model,
      tokensUsed: response.usage.total_tokens,
      processingTimeMs: 0,
      createdAt: new Date().toISOString(),
    };
  }

  /**
   * Summarize invalid request patterns
   */
  async summarizeInvalidRequests(invalidRequests: Array<{
    reason: string;
    stageFailed: string;
    amount?: number;
  }>): Promise<GroqAnalysis | null> {
    const systemPrompt = `You are a compliance auditor. Analyze invalid request patterns and identify systemic issues or training needs.`;

    const requestsText = invalidRequests.map(r => 
      `- ${r.reason} at ${r.stageFailed}${r.amount ? ` ($${r.amount})` : ''}`
    ).join('\n');

    const userPrompt = `Analyze these invalid requests:\n${requestsText}\n\nIdentify patterns, root causes, and recommendations for process improvement.`;

    const response = await this.callGroq({
      model: this.model,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt },
      ],
      temperature: 0.3,
      max_tokens: 400,
    });

    if (!response) return null;

    return {
      id: `groq_${Date.now()}`,
      type: 'invalid_analysis',
      entityType: 'invalid_request',
      entityId: 'batch',
      inputData: { invalidRequests },
      summary: response.choices[0]?.message?.content || '',
      model: this.model,
      tokensUsed: response.usage.total_tokens,
      processingTimeMs: 0,
      createdAt: new Date().toISOString(),
    };
  }

  /**
   * Generate narrative report for Director
   */
  async generateDirectorReport(metrics: {
    period: string;
    keyHighlights: string[];
    concerns: string[];
    achievements: string[];
  }): Promise<string | null> {
    const systemPrompt = `You are writing a formal director's report for Foodies Zimbabwe. Use professional business language. Structure with Executive Summary, Key Concerns, and Recommendations.`;

    const userPrompt = `Generate a Director's report for ${metrics.period}:

Key Highlights:
${metrics.keyHighlights.map(h => `- ${h}`).join('\n')}

Concerns:
${metrics.concerns.map(c => `- ${c}`).join('\n')}

Achievements:
${metrics.achievements.map(a => `- ${a}`).join('\n')}

Write a professional narrative report suitable for board presentation.`;

    const response = await this.callGroq({
      model: this.model,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt },
      ],
      temperature: 0.4,
      max_tokens: 800,
    });

    return response?.choices[0]?.message?.content || null;
  }
}

// Export singleton instance
export const groqService = new GroqService();

// ═════════════════════════════════════════════════════════════════════════════
// FALLBACK SERVICE (when GROQ is unavailable)
// ═════════════════════════════════════════════════════════════════════════════

export class FallbackAnalysisService {
  /**
   * Generate simple executive summary without AI
   */
  static generateExecutiveSummary(data: {
    pendingApprovals: number;
    exceptions: number;
    priceDeviations: number;
    stockRisks: number;
  }): string {
    const points: string[] = [];
    
    if (data.pendingApprovals > 5) {
      points.push(`High volume of pending approvals (${data.pendingApprovals}) requires Director attention.`);
    }
    if (data.exceptions > 3) {
      points.push(`Exception cases (${data.exceptions}) indicate potential process gaps or urgent operational needs.`);
    }
    if (data.priceDeviations > 0) {
      points.push(`Price deviations (${data.priceDeviations}) detected - review cost impact.`);
    }
    if (data.stockRisks > 5) {
      points.push(`Critical stock risks (${data.stockRisks}) require immediate procurement action.`);
    }
    
    if (points.length === 0) {
      points.push('Operations within normal parameters. No immediate action required.');
    }
    
    return points.join('\n\n');
  }

  /**
   * Simple deviation pattern analysis
   */
  static analyzeDeviations(deviations: Array<{ variancePercent: number; supplierName: string }>): string {
    const avgVariance = deviations.reduce((sum, d) => sum + d.variancePercent, 0) / deviations.length;
    const supplierSet = new Set(deviations.map(d => d.supplierName));
    const suppliers = Array.from(supplierSet);
    
    return `Average price deviation: ${avgVariance.toFixed(1)}%. 
Involved suppliers: ${suppliers.join(', ')}. 
Review supplier pricing policies and consider alternative sources.`;
  }
}
