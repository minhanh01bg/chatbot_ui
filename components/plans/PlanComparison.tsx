'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Check, X } from 'lucide-react';
import { Plan } from '@/types/plan';

interface PlanComparisonProps {
  plans: Plan[];
}

export default function PlanComparison({ plans }: PlanComparisonProps) {
  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatTokens = (tokens: number) => {
    if (tokens >= 1000000) {
      return (tokens / 1000000).toFixed(1) + 'M';
    } else if (tokens >= 1000) {
      return (tokens / 1000).toFixed(0) + 'K';
    }
    return tokens.toString();
  };

  if (plans.length === 0) return null;

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-center">Plan Comparison</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b">
                <th className="text-left p-4 font-semibold">Features</th>
                {plans.map((plan) => (
                  <th key={plan.id} className="text-center p-4 min-w-[150px]">
                    <div className="space-y-2">
                      <div className="font-bold text-lg">{plan.name}</div>
                      <div className="text-2xl font-bold">
                        {plan.price === 0 ? 'Free' : `$${plan.price}`}
                      </div>
                      {plan.price > 0 && (
                        <div className="text-sm text-muted-foreground">/{plan.period}</div>
                      )}
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {/* Sites */}
              <tr className="border-b hover:bg-muted/50">
                <td className="p-4 font-medium">Number of Sites</td>
                {plans.map((plan) => (
                  <td key={plan.id} className="text-center p-4">
                    {plan.limits.number_of_sites}
                  </td>
                ))}
              </tr>

              {/* Documents */}
              <tr className="border-b hover:bg-muted/50">
                <td className="p-4 font-medium">Documents</td>
                {plans.map((plan) => (
                  <td key={plan.id} className="text-center p-4">
                    {plan.limits.number_of_documents}
                  </td>
                ))}
              </tr>

              {/* File Size */}
              <tr className="border-b hover:bg-muted/50">
                <td className="p-4 font-medium">Max File Size</td>
                {plans.map((plan) => (
                  <td key={plan.id} className="text-center p-4">
                    {formatFileSize(plan.limits.file_size)}
                  </td>
                ))}
              </tr>

              {/* FAQs */}
              <tr className="border-b hover:bg-muted/50">
                <td className="p-4 font-medium">FAQs</td>
                {plans.map((plan) => (
                  <td key={plan.id} className="text-center p-4">
                    {plan.limits.number_of_faqs}
                  </td>
                ))}
              </tr>

              {/* Crawlers */}
              <tr className="border-b hover:bg-muted/50">
                <td className="p-4 font-medium">Crawlers</td>
                {plans.map((plan) => (
                  <td key={plan.id} className="text-center p-4">
                    {plan.limits.number_of_crawlers}
                  </td>
                ))}
              </tr>

              {/* Chat Tokens */}
              <tr className="border-b hover:bg-muted/50">
                <td className="p-4 font-medium">Chat Tokens</td>
                {plans.map((plan) => (
                  <td key={plan.id} className="text-center p-4">
                    {formatTokens(plan.limits.number_token_chat)}
                  </td>
                ))}
              </tr>

              {/* Self Signup */}
              <tr className="border-b hover:bg-muted/50">
                <td className="p-4 font-medium">Self Signup</td>
                {plans.map((plan) => (
                  <td key={plan.id} className="text-center p-4">
                    {plan.is_self_sigup_allowed ? (
                      <Check className="w-5 h-5 text-green-500 mx-auto" />
                    ) : (
                      <X className="w-5 h-5 text-red-500 mx-auto" />
                    )}
                  </td>
                ))}
              </tr>

              {/* Custom Plan */}
              <tr className="border-b hover:bg-muted/50">
                <td className="p-4 font-medium">Custom Plan</td>
                {plans.map((plan) => (
                  <td key={plan.id} className="text-center p-4">
                    {plan.is_custom ? (
                      <Badge variant="secondary">Custom</Badge>
                    ) : (
                      <Badge variant="outline">Standard</Badge>
                    )}
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}
