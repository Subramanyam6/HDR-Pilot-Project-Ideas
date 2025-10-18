import { Badge } from '@/components/ui/badge';
import type { Pilot } from '@/lib/pilots';

interface MetadataProps {
  pilot: Pilot;
}

export function Metadata({ pilot }: MetadataProps) {
  return (
    <div className="space-y-6">
      {/* Sector */}
      <div>
        <h3 className="text-sm font-semibold text-muted-foreground mb-2">Sector</h3>
        <Badge variant="default">{pilot.sector}</Badge>
      </div>

      {/* Tags */}
      <div>
        <h3 className="text-sm font-semibold text-muted-foreground mb-2">Tags</h3>
        <div className="flex flex-wrap gap-2">
          {pilot.tags.map((tag) => (
            <Badge key={tag} variant="secondary">
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
              <span className="text-green-600 dark:text-green-400 text-xl">✓</span>
              <span>Solo 90-day build</span>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <span className="text-blue-600 dark:text-blue-400 text-xl">⚙️</span>
              <span>Configuration project</span>
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
              pilot.wheelRisk <= 4
                ? 'text-green-600 dark:text-green-400'
                : pilot.wheelRisk <= 7
                ? 'text-yellow-600 dark:text-yellow-400'
                : 'text-red-600 dark:text-red-400'
            }`}
          >
            {pilot.wheelRisk}/10
          </span>
          <div className="flex-1">
            <div className="w-full bg-secondary rounded-full h-2">
              <div
                className={`h-2 rounded-full ${
                  pilot.wheelRisk <= 4
                    ? 'bg-green-600 dark:bg-green-400'
                    : pilot.wheelRisk <= 7
                    ? 'bg-yellow-600 dark:bg-yellow-400'
                    : 'bg-red-600 dark:bg-red-400'
                }`}
                style={{ width: `${(pilot.wheelRisk / 10) * 100}%` }}
              />
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {pilot.wheelRisk <= 4 ? 'Low risk' : pilot.wheelRisk <= 7 ? 'Moderate risk' : 'Higher risk'}
            </p>
          </div>
        </div>
      </div>

      {/* Stack */}
      <div>
        <h3 className="text-sm font-semibold text-muted-foreground mb-2">Tech Stack</h3>
        <div className="flex flex-wrap gap-2">
          {pilot.stack.map((tech) => (
            <span key={tech} className="text-sm px-2 py-1 bg-accent rounded">
              {tech}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

