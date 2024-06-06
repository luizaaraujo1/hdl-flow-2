interface SimpleCardProps {
  title: string;
  subtitle: string;
  className?: string;
}

function SimpleCard({title, subtitle, className}: SimpleCardProps) {
  return (
    <div className={`simple-card ${className}`}>
      <h3 className="mb-4 text-xl font-bold">{title}</h3>
      <p className="text-gray-700">{subtitle}</p>
    </div>
  );
}

export default SimpleCard;
