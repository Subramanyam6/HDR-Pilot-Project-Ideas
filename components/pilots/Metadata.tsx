import { Badge } from '@/components/ui/badge';
import type { Pilot } from '@/lib/pilots';

interface MetadataProps {
  pilot: Pilot;
}

export function Metadata({ pilot }: MetadataProps) {
  const parsedRisk = typeof pilot.wheelRisk === 'number' ? pilot.wheelRisk : parseFloat(String(pilot.wheelRisk));
  const riskScore = Number.isFinite(parsedRisk) ? parsedRisk : 0;

  return (
    <div className="space-y-6">
      {/* Sector */}
      <div>
        <h3 className="text-sm font-semibold text-muted-foreground mb-2">Sector</h3>
        <Badge variant="outline">{pilot.sector}</Badge>
      </div>

      {/* Tags */}
      <div>
        <h3 className="text-sm font-semibold text-muted-foreground mb-2">Tags</h3>
        <div className="flex flex-wrap gap-1.5">
          {pilot.tags.map((tag) => (
            <Badge key={tag} variant="outline" className="text-xs">
              {tag}
            </Badge>
          ))}
        </div>
      </div>

      {/* Feasibility */}
      <div>
        <h3 className="text-sm font-semibold text-muted-foreground mb-2">Feasibility</h3>
        <div className="text-sm">
          {pilot.feasibility === 'solo-90-day' ? (
            <div className="flex items-center gap-2">
              <span className="text-sm">Solo 90-day build</span>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <span className="text-sm">Configuration project</span>
            </div>
          )}
        </div>
      </div>

      {/* Wheel Risk */}
      <div>
        <h3 className="text-sm font-semibold text-muted-foreground mb-2">Implementation Risk</h3>
        <div className="flex items-center gap-3">
          <span
            className={`text-2xl font-bold ${
              riskScore <= 4
                ? 'text-green-600 dark:text-green-400'
                : riskScore <= 7
                ? 'text-yellow-600 dark:text-yellow-400'
                : 'text-red-600 dark:text-red-400'
            }`}
          >
            {riskScore}/10
          </span>
          <div className="flex-1">
            <div className="w-full bg-secondary rounded-full h-2">
              <div
                className={`h-2 rounded-full ${
                  riskScore <= 4
                    ? 'bg-green-600 dark:bg-green-400'
                    : riskScore <= 7
                    ? 'bg-yellow-600 dark:bg-yellow-400'
                    : 'bg-red-600 dark:bg-red-400'
                }`}
                style={{ width: `${(riskScore / 10) * 100}%` }}
              />
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {riskScore <= 4 ? 'Low risk' : riskScore <= 7 ? 'Moderate risk' : 'Higher risk'}
            </p>
          </div>
        </div>
      </div>

      {/* Stack */}
      <div>
        <h3 className="text-sm font-semibold text-muted-foreground mb-2">Tech Stack</h3>
        <div className="flex flex-wrap gap-1.5">
          {pilot.stack.map((tech) => (
            <Badge key={tech} variant="outline" className="text-xs">
              {tech}
            </Badge>
          ))}
        </div>
      </div>
    </div>
  );
}
