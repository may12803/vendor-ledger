import './HeroSummary.css'

interface MetricProps {
  label: string
  value: string
}

function MetricGroup({ label, value }: MetricProps) {
  return (
    <div className="metric-group">
      <span className="label-micro">{label}</span>
      <span className="metric-value">{value}</span>
    </div>
  )
}

interface HeroSummaryProps {
  title: React.ReactNode
  metrics: MetricProps[]
}

export function HeroSummary({ title, metrics }: HeroSummaryProps) {
  return (
    <section className="hero-summary">
      <h1 className="hero-title">{title}</h1>
      <div className="hero-metrics">
        {metrics.map((m) => (
          <MetricGroup key={m.label} label={m.label} value={m.value} />
        ))}
      </div>
    </section>
  )
}
