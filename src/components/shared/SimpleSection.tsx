interface Props {
  children: React.ReactNode;
  className?: string;
}

function SimpleSection({children, className}: Props) {
  return <section className={`pt-16 ${className}`}>{children}</section>;
}

export default SimpleSection;
