import type { LucideIcon } from 'lucide-react';
import './StatCard.css';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  color?: 'primary' | 'secondary' | 'success' | 'warning' | 'error';
}

export function StatCard({ title, value, icon: Icon, trend, color = 'primary' }: StatCardProps) {
  return (
    <div className={`stat-card glass-card color-${color}`}>
      <div className="stat-icon-wrapper">
        <Icon size={24} className="stat-icon" />
      </div>
      <div className="stat-content">
        <span className="stat-title">{title}</span>
        <div className="stat-value-wrapper">
          <span className="stat-value">{value}</span>
          {trend && (
            <span className={`stat-trend ${trend.isPositive ? 'positive' : 'negative'}`}>
              {trend.isPositive ? '+' : ''}{trend.value}%
            </span>
          )}
        </div>
      </div>
      <div className="stat-glow" />
    </div>
  );
}
