interface Props {
  title: string;
  subtitle: string;
  className?: string;
}

function SimpleCard({title, subtitle, className}: Props) {
  return (
    <div className={`simple-card ${className}`}>
      <h3 className="text-xl font-bold mb-4">{title}</h3>
      <p className="text-gray-700">{subtitle}</p>
    </div>
  );
}

export default SimpleCard;
