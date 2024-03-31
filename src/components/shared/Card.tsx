interface Props {
  children: React.ReactNode;
  className?: string;
}

function Card({children, className}: Props) {
  return <div className={`simple-card ${className}`}>{children}</div>;
}

export default Card;
