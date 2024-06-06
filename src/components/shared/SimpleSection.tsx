interface SimpleSectionProps {
  children: React.ReactNode;
  className?: string;
}

function SimpleSection({children, className}: SimpleSectionProps) {
  return <section className={`px-10 pt-16 ${className}`}>{children}</section>;
}

export default SimpleSection;
